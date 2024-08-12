import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { docClient } from '../Database/ConnectDB.js';
import { v4 as uuidv4 } from 'uuid';

// Register Route
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields',
      });
    }

    // Check if the user already exists
    const existingUserParams = {
      TableName: 'Users',
      IndexName: 'email-index', // GSI for email lookup
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const existingUserResult = await docClient.query(existingUserParams).promise();
    const existingUser = existingUserResult.Items && existingUserResult.Items.length > 0 ? existingUserResult.Items[0] : undefined;

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: 'Users',
      Item: newUser,
    };

    await docClient.put(params).promise();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set the token as a cookie
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      secure: process.env.NODE_ENV !== 'development',
    });

    // Respond with the new user's data
    res.status(200).json({
      success: true,
      message: 'Registered successfully',
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Route
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields',
      });
    }

    // Find the user by email
    const params = {
      TableName: 'Users',
      IndexName: 'email-index', // GSI for email lookup
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const result = await docClient.query(params).promise();
    const user = result.Items && result.Items.length > 0 ? result.Items[0] : undefined;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email',
      });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set the token as a cookie
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      secure: process.env.NODE_ENV !== 'development',
    });

    // Respond with the user's data
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Route
export const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;

    // Fetch the current user from DynamoDB by their ID
    const currentUserParams = {
      TableName: 'Users',
      Key: {
        id: id,
      },
    };

    const currentUserResult = await docClient.get(currentUserParams).promise();
    const currentUser = currentUserResult.Item;

    if (!currentUser) {
      return res.status(404).json('User not found');
    }

    // Check if the email is already in use by another user
    if (email && email !== currentUser.email) {
      const existingUserParams = {
        TableName: 'Users',
        IndexName: 'email-index', // GSI for email lookup
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      };

      const existingUserResult = await docClient.query(existingUserParams).promise();
      const existingUser = existingUserResult.Items && existingUserResult.Items.length > 0 ? existingUserResult.Items[0] : undefined;

      if (existingUser) {
        return res.status(400).json('Email already in use');
      }
    }

    // Update the user's information
    const updatedUser = {
      ...currentUser,
      email: email || currentUser.email,
      name: name || currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    if (password) {
      updatedUser.password = await bcrypt.hash(password, 10);
    }

    const updateUserParams = {
      TableName: 'Users',
      Item: updatedUser,
    };

    await docClient.put(updateUserParams).promise();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
};

// Get User Route
export const GetUser = async (userId) => {
  const params = {
    TableName: 'Users',
    Key: {
      id: userId,
    },
  };

  const result = await docClient.get(params).promise();

  if (result && result.Item) {
    return result.Item;
  } else {
    return null;
  }
};

// Get All Users Route
export const GetAllUsers = async (req, res) => {
  try {
    const query = req.query.new;
    const currentUser = await GetUser(req.user.id); // Pass user ID explicitly

    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json('You are not allowed to see this data');
    }

    const params = {
      TableName: 'Users',
      Limit: query ? 10 : undefined,
      ScanIndexForward: false, // To get the latest entries first
    };

    const result = await docClient.scan(params).promise();

    if (result.Items.length > 0) {
      return res.status(200).json(result.Items);
    } else {
      return res.status(404).json('No users found');
    }
  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
};

// Delete User Route
export const DeleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const paramsGet = {
      TableName: 'Users',
      Key: {
        id: req.user.id,
      },
    };

    const currentUserResult = await docClient.get(paramsGet).promise();
    const currentUser = currentUserResult.Item;

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const paramsGetTarget = {
      TableName: 'Users',
      Key: {
        id: req.params.id,
      },
    };

    const targetUserResult = await docClient.get(paramsGetTarget).promise();
    const targetUser = targetUserResult.Item;

    if (!targetUser) {
      return res.status(404).json({ message: 'User to delete not found' });
    }

    if (req.params.id === req.user.id || currentUser.isAdmin) {
      const paramsDelete = {
        TableName: 'Users',
        Key: {
          id: req.params.id,
        },
      };

      await docClient.delete(paramsDelete).promise();
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(403).json({ message: 'You can delete only your own account or if you are an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// // Logout route
export const Logout = (req, res) => {
  try {
    res
      .cookie('token', '', {
        maxAge: new Date(0),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        secure: process.env.NODE_ENV === 'development' ? false : true,
      })
      .json({
        success: true,
        message: 'Logout successful',
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// //GET USER STATS
export const Stats = async (req, res) => {
  const today = new Date();
  const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

  try {
    const params = {
      TableName: 'Users',
    };

    const result = await docClient.scan(params).promise();
    const users = result.Items;

    // Aggregate users by month
    const stats = users.reduce((acc, user) => {
      const createdAt = new Date(user.createdAt);
      if (createdAt >= lastYear) {
        const month = createdAt.getMonth() + 1; // JavaScript months are 0-based
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert stats object to an array for easier consumption
    const statsArray = Object.keys(stats).map((month) => ({
      month: parseInt(month),
      total: stats[month],
    }));

    res.status(200).json(statsArray);
  } catch (error) {
    res.status(500).json(error);
  }
};
//Get My profile.

export const MyProfile = async (req, res) => {
  try {
    // Fetch the user's ID from the request object (set by isAuth middleware)
    const userId = req.user.id;  // Use the ID from the decoded token

    // Fetch the user's data from DynamoDB
    const params = {
      TableName: 'Users', // Table name in DynamoDB
      Key: {
        id: userId, // Use 'id' as the partition key
      },
    };

    const result = await docClient.get(params).promise();

    if (result.Item) {
      return res.status(200).json(result.Item);
    } else {
      return res.status(404).json('User not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json('Internal Server Error');
  }
};


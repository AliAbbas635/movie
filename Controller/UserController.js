import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../Database/Models/User.js"
import { docClient } from '../Database/ConnectDB.js';



export const Register = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
          return res.status(400).json({
              success: false,
              message: 'Please fill in all fields',
          });
      }

      const existingUser = await findUserByEmail(email); // Function to find user by email from DB

      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: 'User already exists',
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await createUser({
          name,
          email,
          password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
          secure: process.env.NODE_ENV !== 'development',
      });

      res.status(200).json({
          success: true,
          message: 'Registered successfully',
          user: { id: newUser.id, email: newUser.email, name: newUser.name },
          token, // Send the token in the response
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message,
      });
  }
};


export const Login = async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({
              success: false,
              message: 'Please fill in all fields',
          });
      }

      const user = await findUserByEmail(email); // Function to find user by email from DB

      if (!user) {
          return res.status(400).json({
              success: false,
              message: 'Invalid credentials',
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(400).json({
              success: false,
              message: 'Invalid credentials',
          });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
          secure: process.env.NODE_ENV !== 'development',
      });

      res.status(200).json({
          success: true,
          message: 'Logged in successfully',
          user: { id: user.id, email: user.email, name: user.name },
          token, // Send the token in the response
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message,
      });
  }
};



export const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;

    // Fetch the current user from DynamoDB by their ID
    const currentUser = await updateUserById(id);

    if (!currentUser) {
      return res.status(404).json('User not found');
    }

    // Check if the email is already in use by another user
    if (email && email !== currentUser.email) {
      const existingUser = await findUserByEmail(email);
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

    // Save the updated user to DynamoDB
    const result = await updateUserById(id, updatedUser);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
};

// Corrected GetUser Function
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
    console.log('User not found');
    return null;
  }
};

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
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
};



// Delete User
export const DeleteUser = async (req, res) => {
  try {
    // Ensure that req.user is properly set
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Fetch the current user to check permissions
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

    // Check if the user to be deleted exists
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

    // Check if the user is deleting their own account or is an admin
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
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
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


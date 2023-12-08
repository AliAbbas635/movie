import { User } from "../Database/Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password)
      return res.status(400).json({ message: "Please fill in all fields" });

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let newUser = new User({ email, name, password });

    newUser = await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        message: "Registered Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const MyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not found",
      });
    }
    return res.status(200).json({
      success: false,
      MyProfile: user,
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
        message: "Please fill in all fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userWithoutPassword = {
      _id: user._id,
      username: user.name,
      email: user.email,
    };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        message: "Logged in Successfully"
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UpdateUser = async (req, res) => {
    const uer= await User.findById(req.user);
   
  try {
    if (req.params.id === req.user || req.user.isAdmin) {
      // Check if the email is already in use
      if (req.body.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json("Email already in use");
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (updatedUser) {
        return res.status(200).json(updatedUser);
      } else {
        return res.status(404).json("User not found");
      }
    } else {
      return res
        .status(403)
        .json("You can update only your account or as an admin");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

//GetUser

export const GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json("User not found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
//AllUsers

export const GetAllUsers = async (req, res) => {
    const query = req.query.new;
   const uer= await User.findById(req.user);
    
  if (uer.isAdmin) {
    try {
      const users = query? await User.find().sort({_id:-1}).limit(10):
      await User.find();
      if (users.length > 0) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json("No users found");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else {
    return res.status(403).json("You are not allowed to see");
  }
};

// Delete User

export const DeleteUser = async (req, res) => {
    const usr= await User.findById(req.user);
  try {
    if (req.params.id === req.user || usr.isAdmin === true ) {

      await User.findByIdAndDelete(req.params.id).then(() => {
        return res.status(200).json("User Deleted");
      });
    } else {
      return res
        .status(403)
        .json("You can Delete only your account or as an admin");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

// Logout route
export const Logout = (req, res) => {
  try {
    // Clear the token by setting an empty value and an immediate expiration
    res
      .cookie("token", "", {
        maxAge: new Date(0),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        message: "Logout successful",
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
 };
 


//GET USER STATS
export const  Stats= async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  };
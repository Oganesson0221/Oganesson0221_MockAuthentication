const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const fs = require("fs");
let multer = require("multer");
let uuidv4 = require("uuid");

var jwtSecret = "mysecrettoken";

// @route   POST /users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /users/auth
// @desc    Get user by token/Load user
// @access  Private
router.get("/auth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /users/auth
// @desc    Authenticate user & get token/Login user using name
// @access  Public
router.post(
  "/auth",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
      // Check if user exists by name
      let user = await User.findOne({ name });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST /users/changepassword
// @desc    Change user password
// @access  Private
router.post(
  "/changepassword",
  [
    auth,
    check("currentPassword", "Current password is required").exists(),
    check("newPassword", "New password must be at least 6 characters").isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Find user by ID
      const user = await User.findById(req.user.id);

      // Check if current password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Current password is incorrect" }] });
      }

      // Encrypt new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      // Save updated user
      await user.save();
      res.status(200).json({ msg: "Password changed successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Upload File
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// @route   POST /users/uploadfile
// @desc    Avatar Upload File
// @access  Private
router.post(
  "/uploadfile",
  auth,
  [upload.single("avatar")],
  async (req, res) => {
    try {
      const url = req.protocol + "://" + req.get("host");

      const user = await User.findOne({ _id: req.user.id });

      const deletepicture = user.avatar.split("/");
      try {
        fs.unlinkSync("public/" + deletepicture[4]);
      } catch (err) {
        console.log(err);
      }

      const response = await User.update(
        { _id: req.user.id },
        {
          $set: {
            avatar: url + "/public/" + req.file.filename,
          },
        }
      );
      console.log(response);
      return res.status(200).send();
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

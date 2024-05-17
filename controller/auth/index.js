require("dotenv").config();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const DB = require("../../config/database");
const e = require("express");
const User = DB.collection("user");

module.exports = function (lib, db) {
  const register = async (params) => {
    try {
      // check if user already exists
      const userExists = await User.findOne({ email: params.email });
      if (userExists) {
        throw new Error("User already exists.");
      }

      // create a new user in mongodb
      const user = await User.insertOne({
        name: params.name,
        email: params.email,
        password: bcrypt.hashSync(params.password, 8),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!user) {
        throw new Error("Error while creating user.");
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (params) => {
    try {
      const user = await User.findOne({ email: params.email });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(params.password, user.password);

      if (!isMatch) {
        throw new Error("Invalid password");
      }

      const expiry_time = 86400; // 24 hours
      const token = jwt.sign(
        { id: user._id },
        process.env.JSON_SECRET_KEY || "pakistan1234000",
        {
          expiresIn: expiry_time, // 24 hours
        }
      );

      return {
        token,
        expiresIn: expiry_time,
        user,
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    register,
    login,
  };
};

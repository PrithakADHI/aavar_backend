import sequelize from "../database.js";
import { DataTypes } from "sequelize";

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    perHourPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contactNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        is: /^\d{10}$/,
      },
    },

    citizenshipNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    citizenshipPhotoFront: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    citizenshipPhotoBack: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    certifications: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    verification: {
      type: DataTypes.ENUM("verified", "pending", "unverified"),
      defaultValue: "pending",
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("nurse", "doctor", "caretaker"),
      defaultValue: "doctor",
    },

    stripeProductId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    stripePriceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
  }
);

export default Doctor;

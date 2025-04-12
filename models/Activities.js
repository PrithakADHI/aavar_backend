import sequelize from "../database.js";
import { DataTypes } from "sequelize";

const Activities = sequelize.define(
  "Activities",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    numberOfPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    tentativeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    numberOfDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    images: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    booked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "activities",
    timestamps: true,
  }
);

export default Activities;

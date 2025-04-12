import sequelize from "../database.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const VitalReport = sequelize.define(
  "VitalReport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    bodyTemperatureCelsius: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    bloodPressureSystolic: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bloodPressureDiastolic: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    oxygenSaturationPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bloodGlucoseMgDl: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "vitalReports",
    timestamps: true,
  }
);

export default VitalReport;

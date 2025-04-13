import sequelize from "../database.js";
import { DataTypes } from "sequelize";

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    patientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("accepted", "pending", "declined"),
      allowNull: true,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);

export default Transaction;

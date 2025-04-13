import sequelize from "../database.js";
import { DataTypes } from "sequelize";

const Bookings = sequelize.define(
  "Bookings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"), // e.g., 'pending', 'confirmed', 'cancelled'
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  }
);

export default Bookings;

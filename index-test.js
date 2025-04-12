import sequelize from "./database.js";
import Doctor from "./models/Doctor.js";

const runApp = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB:", sequelize.getDatabaseName());

    await sequelize.sync({ force: true });
    console.log("Tables synced.");

    const schema = await sequelize.getQueryInterface().describeTable("doctors");
    console.log("Doctor table schema:", schema);

    process.exit();
  } catch (err) {
    console.error("Error:", err);
  }
};

runApp();

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "vitalReports",
      "bodyTemperatureCelsius",
      {
        type: Sequelize.FLOAT,
        allowNull: true, // keep or adjust based on your original schema
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "vitalReports",
      "bodyTemperatureCelsius",
      {
        type: Sequelize.INTEGER,
        allowNull: true, // same here
      }
    );
  },
};

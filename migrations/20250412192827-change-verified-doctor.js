"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column exists before trying to remove it (optional safety)
    await queryInterface.removeColumn("doctors", "verified");

    await queryInterface.addColumn("doctors", "verification", {
      type: Sequelize.ENUM("verified", "pending", "unverified"),
      defaultValue: "pending",
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("doctors", "verification");

    await queryInterface.addColumn("doctors", "verified", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },
};

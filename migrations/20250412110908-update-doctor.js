"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("doctors", "bio", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("doctors", "perHourPrice", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("doctors", "perHourPrice");
    await queryInterface.removeColumn("doctors", "bio");
  },
};

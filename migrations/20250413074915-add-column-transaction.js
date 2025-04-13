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

    queryInterface.addColumn("transactions", "status", {
      type: Sequelize.ENUM("accepted", "pending", "declined"),
      allowNull: true,
    });

    queryInterface.addColumn("transactions", "description", {
      type: Sequelize.STRING,
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
    queryInterface.removeColumn("transactions", "status");
    queryInterface.removeColumn("transactions", "description");
  },
};

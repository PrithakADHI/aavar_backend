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
    queryInterface.addColumn("doctors", "stripeProductId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    queryInterface.addColumn("doctors", "stripePriceId", {
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
    queryInterface.removeColumn("doctors", "stripeProductId");
    queryInterface.removeColumn("doctors", "stripePriceId");
  },
};

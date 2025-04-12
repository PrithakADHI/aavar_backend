"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("doctors", "specialization", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("doctors", "rating", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("doctors", "experience", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("doctors", "specialization");
    await queryInterface.removeColumn("doctors", "rating");
    await queryInterface.removeColumn("doctors", "experience");
  },
};

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

    queryInterface.changeColumn("doctors", "certifications", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "doctors"
      ALTER COLUMN "certifications" TYPE JSON USING certifications::json,
      ALTER COLUMN "certifications" SET DEFAULT '[]'::json,
      ALTER COLUMN "certifications" DROP NOT NULL;
    `);
  },
};

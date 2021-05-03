"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "post_infos",
      [
        {
          post_id: 1,
          emoji_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 1,
          emoji_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 1,
          emoji_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 1,
          emoji_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("post_infos", null, {});
  },
};

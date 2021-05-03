require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "localhost",
    dialect: "mysql",
  },
  // rds에서 작동시키기 위한 설정
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD_TEST,
    database: process.env.DATABASE_NAME_TEST,
    host: "deploytest.cnue2ib67wps.us-east-1.rds.amazonaws.com",
    dialect: "mysql",
    dialectOptions: {
      ssl: "Amazon RDS",
    },
    port: process.env.DATABASE_PORT_TEST,
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "localhost",
    dialect: "mysql",
  },
};

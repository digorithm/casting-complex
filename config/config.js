module.exports = {
  development: {
    dialect: "postgres",
    host: "localhost",
    username: "rodrigo",
    database: "castingcomplex",
    password: "123",
    port: "5432"
  },
  test: {
    dialect: "postgres",
    host: "localhost",
    username: "rodrigo",
    database: "castingcomplex",
    password: "123",
    port: "5432"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
  }
};

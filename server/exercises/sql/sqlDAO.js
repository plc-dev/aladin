module.exports = async config => {
  try {
    const adapter = require("./sqlAdapter")(config.flavour);
    const db = await adapter.connectDB(config);
    console.log(`${config.flavour}-DB initialized!`);
    db.adapter = adapter;
    return db;
  } catch (err) {
    console.log(err);
  }
};

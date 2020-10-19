module.exports = async () => {
  try {
    const mongoose = require("mongoose");

    // manual configuration due to deprecation of collection.ensureIndex
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);

    // Setup Connection
    await mongoose.connect("mongodb://mongodb:27017/aladin", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Add all models to one object for better accessibility
    const db = mongoose;
    db.models.User = require("./model/User")(mongoose);

    console.log(`Mongoose initialized!`);

    return db;
  } catch (err) {
    console.log(err);
  }
};

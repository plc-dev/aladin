module.exports = mongoose => {
  const User = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    subscription: {
      type: {
        endpoint: String,
        keys: {
          p256dh: String,
          auth: String
        }
      },
      unique: true,
      sparse: true
    },
    language: {
      type: String
    }
  });
  return mongoose.model("User", User);
};

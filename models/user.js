const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let passportLocalMongoose = require("passport-local-mongoose");

// 🔥 FIX — unwrap default export if present
passportLocalMongoose = passportLocalMongoose.default || passportLocalMongoose;

console.log("PLM TYPE =", typeof passportLocalMongoose);

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

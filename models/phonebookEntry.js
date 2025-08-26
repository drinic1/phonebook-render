const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(connectionString)
  .then(() => console.log("mongodb server started"))
  .catch(() => console.log("server disconnected"));

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

phonebookEntrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("PhoneBookEntry", phonebookEntrySchema);

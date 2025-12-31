const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');

main().then(() => {
    console.log("Connected to MongoDB");
})  
.catch((err) =>{ console.log(err);

});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '695282998386b9a48d87ccb9'}));
    await listing.insertMany(initData.data);
    console.log("Database Initialized with sample data");
};

initDB();
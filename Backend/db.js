// const mongoose = require('mongoose');
// const mongoURI="mongodb://localhost:27017"

// const connectToMongo= async()=>{
//     await mongoose.connect(mongoURI,()=>{
//         console.log("Connected succesfully");
//     })
// }
// module.exports=connectToMongo;

const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/iNoteBook'; // Replace with your MongoDB URI

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongo;

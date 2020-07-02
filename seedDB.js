const mongoose = require('mongoose')
const Games = require('./routes/Games/models/Game')
const gameSeed = require('./gameSeed.json')
require('dotenv').config()

const seedFunc = async ()=>{

  try {
    const data = await Games.create(gameSeed);
  console.log(`${data.length} records created`)
  await mongoose.disconnect();
  console.log('MongoDB Disconnected');
  process.exit(0);
    
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },()=>{
    mongoose.connection.db.dropDatabase();
  })
  .then(() => {
  console.log('MongoDB Connected')
  seedFunc()
})
.catch((err) => console.log(`MongoDB Error: ${err}`));
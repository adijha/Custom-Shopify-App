const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		});

		console.log('MongoConnected'.yellow.bold);
	} catch (error) {
		console.error(error);
	}
};

module.exports = connectDB;

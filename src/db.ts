import mongoose from 'mongoose';

export const db = {
	connection: mongoose.connection,
	connect(): void {
		mongoose.connect(process.env.DB_URISTRING||"", {useNewUrlParser: true, useUnifiedTopology: true}).then(
			(orm) => { console.log(`Connected to MongoDB on port ${orm.connection.port}`) },
			(reason) => { console.error('MongoDB connection failed', reason); process.exit(1); }
		)
	}
}

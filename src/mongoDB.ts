import { MongoClient } from 'mongodb';

export class MongoDriver {
	static url = 'mongodb://localhost:27017';
	static isConnected = false;
	static client = new MongoClient(MongoDriver.url, {
		maxPoolSize: 10,
		minPoolSize: 0,
	});

	static async connect() {
		if (MongoDriver.isConnected) {
			return null;
		} else {
			await MongoDriver.client.connect();
			MongoDriver.isConnected = true;
			console.log('Connected successfully to server');
		}
	}
}

export function getUserCollection() {
	const dbName = 'usersTg';
	const db = MongoDriver.client.db(dbName);
	const collection = db.collection('users');
	return collection;
}

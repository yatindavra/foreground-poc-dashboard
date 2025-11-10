
// lib/dbConnect.js
import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
const uri = 'mongodb+srv://yatindavra:davrayatin@cluster0.c5zi4fb.mongodb.net/?appName=Cluster0'
const options = {}; // Add options as needed, e.g., { useNewUrlParser: true, useUnifiedTopology: true }

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to reuse the client
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
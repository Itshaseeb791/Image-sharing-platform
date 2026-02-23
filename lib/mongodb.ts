import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/homecloud";

if (!uri) throw new Error("Please define DATABASE_URL in .env");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global var in dev to avoid multiple connections
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

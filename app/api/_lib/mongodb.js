import { MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB_NAME || "ghhs";
const mongoClientOptions = {
  serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 8000),
  connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 8000),
  socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 15000),
};

let clientPromise;

function getClientPromise() {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalThis.__ghhsMongoClientPromise) {
      globalThis.__ghhsMongoClientPromise = new MongoClient(uri, mongoClientOptions).connect();
    }
    clientPromise = globalThis.__ghhsMongoClientPromise;
    clientPromise.catch(() => {
      globalThis.__ghhsMongoClientPromise = null;
      clientPromise = null;
    });
    return clientPromise;
  }

  const client = new MongoClient(uri, mongoClientOptions);
  clientPromise = client.connect();
  clientPromise.catch(() => {
    clientPromise = null;
  });
  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}

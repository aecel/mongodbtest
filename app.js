const { MongoClient, ObjectId } = require("mongodb")
const uri = require("./atlas_uri")

const client = new MongoClient(uri)

const db_name = "banK"
const collection_name = "accounts"
const accountsCollection = client.db(db_name).collection(collection_name)

// Connects to database
const connectToDatabase = async () => {
  try {
    await client.connect()
    console.log("Connection established")
  } catch (error) {
    console.log("Error connecting to database")
    console.error(`Error: ${error}`)
  }
}

// Lists database names
const listDatabases = async (client) => {
  try {
    const databaseList = await client.db().admin().listDatabases()
    console.log("Databases: ")
    databaseList.databases.forEach((db) => {
      console.log(` - ${db.name}`)
    })
  } catch (error) {
    console.log("Error listing database names")
    console.error(`Error: ${error}`)
  }
}

const sampleAccount = {
  account_holder: "Linus Torvalds",
  account_id: "MDB829001337",
  account_type: "checking",
  balance: 50352434,
  last_updated: new Date(),
}

const sampleAccountId = new ObjectId("64280b07e1bf6b49034e2b51")

// Insert one document into a collection
const insertDoc = async (collection, document) => {
  try {
    // To insert many documents, use .insertMany(), the input is an array of documents
    // e.g. let result = await collection.insertMany([sampleAccount1, sampleAccount2])
    let result = await collection.insertOne(document)
    console.log(`Inserted document: ${result.insertedId}`)
  } catch (error) {
    console.log("Error inserting document")
    console.error(`Error: ${error}`)
  }
}

// Find documents in a given collection that matches a query
// Sample usage
// findDoc(accountsCollection, {balance: {$gt: 530} })
// findDoc(accountsCollection, {_id: sampleAccountId})
const findDoc = async (collection, query) => {
  try {
    // To find only one document, use .findOne()
    let result = await collection.find(query)
    let docCount = await collection.countDocuments(query)
    console.log(`Found ${docCount} document/s`)
    await result.forEach((doc) => console.log(doc))
  } catch (error) {
    console.log("Error finding document")
    console.error(`Error: ${error}`)
  }
}

const updateDoc = async (collection, docToUpdate, update) => {
  try {
    // To update many documents, use .updateMany()
    let result = await collection.updateOne(docToUpdate, update)
    result.modifiedCount === 1
      ? console.log("Updated one document")
      : console.log("No documents updated")
  } catch (error) {
    console.log("Error updating document")
    console.error(`Error: ${error}`)
  }
}

const updateDocs = async (collection, docsToUpdate, update) => {
  try {
    let result = await collection.updateMany(docsToUpdate, update)
    result.modifiedCount > 0
      ? console.log(`Updated ${result.modifiedCount} documents`)
      : console.log("No documents updated")
  } catch (error) {
    console.log("Error updating documents")
    console.error(`Error: ${error}`)
  }
}

const deleteDoc = async (collection, docToDelete) => {
  try {
    // To delete many documents, use .deleteMany()
    let result = await collection.deleteOne(docToDelete)
    result.deletedCount === 1
      ? console.log("Deleted one document")
      : console.log("No documents deleted")
  } catch (error) {
    console.log("Error deleting document")
    console.error(`Error: ${error}`)
  }
}

const deleteDocs = async (collection, docsToDelete) => {
  try {
    let result = await collection.deleteMany(docsToDelete)
    result.deletedCount > 0
      ? console.log(`Deleted ${result.deletedCount} documents`)
      : console.log("No documents deleted")
  } catch (error) {
    console.log("Error deleting documents")
    console.error(`Error: ${error}`)
  }
}

const docToUpdate = { _id: sampleAccountId }
const update = { $inc: { balance: 100 } }

// Main function
const main = async () => {
  try {
    await connectToDatabase()
    await findDoc(accountsCollection, { _id: sampleAccountId })
  } catch (error) {
    console.error(`Error: ${error}`)
  } finally {
    await client.close()
    console.log("Connection closed")
  }
}

main()

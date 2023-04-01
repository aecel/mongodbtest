const { MongoClient, ObjectId } = require("mongodb")
const uri = require("./atlas_uri")

const client = new MongoClient(uri)

// Create variables used in the transaction.
// Collections
const accounts = client.db("bank").collection("accounts")
const transfers = client.db("bank").collection("transfers")

// Account information
let account_id_sender = "MDB574189300"
let account_id_receiver = "MDB343652528"
let transaction_amount = 100

// Start a new session.
const session = client.startSession()

const main = async () => {
  try {
    // Begin a transaction with the WithTransaction() method on the session.
    const transactionResults = await session.withTransaction(async () => {
      // Operations will go here

      // Update the balance field of the sender’s account by decrementing the transaction_amount from the balance field.
      const senderUpdate = await accounts.updateOne(
        { account_id: account_id_sender },
        { $inc: { balance: -transaction_amount } },
        { session }
      )

      // Update the balance field of the receiver’s account by incrementing the transaction_amount to the balance field.
      const receiverUpdate = await accounts.updateOne(
        { account_id: account_id_receiver },
        { $inc: { balance: transaction_amount } },
        { session }
      )

      // Create a transfer document and insert it into the transfers collection.
      const transfer = {
        transfer_id: "TR21872187",
        amount: 100,
        from_account: account_id_sender,
        to_account: account_id_receiver,
      }

      const insertTransferResults = await transfers.insertOne(transfer, {
        session,
      })

      // Update the transfers_complete array of the sender’s account by adding the transfer_id to the array.
      const updateSenderTransferResults = await accounts.updateOne(
        { account_id: account_id_sender },
        { $push: { transfers_complete: transfer.transfer_id } },
        { session }
      )

      // Update the transfers_complete array of the receiver’s account by adding the transfer_id to the array.
      const updateReceiverTransferResults = await accounts.updateOne(
        { account_id: account_id_receiver },
        { $push: { transfers_complete: transfer.transfer_id } },
        { session }
      )
    })

    // Log a message regarding the success or failure of the transaction.
    if (transactionResults) {
      console.log("Transaction completed successfully.")
    } else {
      console.log("Transaction failed.")
    }

    // Catch any errors and close the session.
  } catch (err) {
    console.error(`Transaction aborted: ${err}`)
    process.exit(1)
  } finally {
    await session.endSession()
    await client.close()
  }
}

main()

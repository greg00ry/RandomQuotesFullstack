

const MongoSingleton = require("../data/mongoDBsingleton")
const ObjectId = require("mongodb").ObjectId

function saveAll(quotes) {
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection()
        const result = await collection.insertMany(quotes)

        if (result && result.insertedCount > 0) {
            resolve(result)
        } else {
            reject("Can't save quotes to the DB")
        }
    })
} 

function getAll() {
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection()
        const cursor = await collection.find()
        const results = await cursor.toArray()


        if (results.length > 0) {
            resolve(results)
        } else {
            reject("Can't get all quotes.")
        }
    })
}

function getById(id) {
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection()
        const result = await collection.findOne({_id: new ObjectId(id)})

        if(result) {
            resolve(result)
        } else {
            reject(`Can't get quote by id: ${id}`)
        }
    })
} 

function deleteById(id) {
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection()
        const result = await collection.deleteMany({_id: new ObjectId(id)})

        if (result && result.deletedCount > 0) {
            resolve(result)
        } else {
            reject("Can't delete quote by id")
        }
    })
} 

function updateById(id, updateFields) {
    return new Promise( async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection()
        const result = await collection.updateOne({
            _id: new ObjectId(id)
        },
        {$set: updateFields})

        if (result && result.matchedCount > 0 ) {
            resolve(result)
        } else {
            reject("Can't update quote by id")
        }
    })
}

function insertQuote(quote) {
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection()
        const result = await collection.insertOne(quote)

        if (result && (result.insertedId || result.insertedCount > 0)) {
            resolve(result)
        } else {
            reject("Can't add new quote to the DB")
        }
    })
}

module.exports = {
    saveAll,
    getAll,
    getById,
    deleteById,
    updateById,
    insertQuote
}
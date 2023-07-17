const MongoClient = require("mongodb").MongoClient;
const url = process.env.DATABASE_URL;

let mongodb;

const mongoClient = new MongoClient(url);

async function connect(callback){
    console.log("connect");
    const newDb = mongoClient.db("hrTest");
    mongodb = newDb
    callback();
}
async function getDb(){
    return mongodb;
}

function close(){
    mongodb.close();
}

module.exports = {
    connect,
    getDb,
    close
};
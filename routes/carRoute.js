const Router = require('express');
const router = new Router();
const db = require('../db');
const bodyParser = require('body-parser');

async function getMarksAndCount(req, res) {
    console.log('getMarksAndCount');
    const connection = await db.getDb();
    const results = await connection.collection("stock").aggregate([
        {
            $group: { _id: '$mark', count: { $sum: 1 } }
        },
        { $sort: { _id: 1 } },
        { $addFields: { mark: '$_id' } },
        { $unset: '_id' }
    ]).toArray();
    return res.json(results);
}

async function getCarsWithSetting(req, res) {
    console.log('getCarsWithSetting');
    const {  currentMark, currentModel, currentPaginationLimit, currentPaginationPageNumber } = req.body;
    console.log(currentMark,currentModel, currentPaginationLimit, currentPaginationPageNumber);
    console.log(currentPaginationLimit * currentPaginationPageNumber);

    const connection = await db.getDb();
    let results;
    if (currentModel.length > 0) {
        results = await connection.collection("stock").aggregate([
            {
                $match: {
                    mark: currentMark,
                    model: { '$in': Object.values(currentModel) }
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: (currentPaginationPageNumber * currentPaginationLimit) },
            { $limit: currentPaginationLimit }
        ]).toArray();
    } else {
        results = await connection.collection("stock").aggregate([
            {
                $match: {
                    mark: currentMark,
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: (currentPaginationPageNumber * currentPaginationLimit) },
            { $limit: currentPaginationLimit }
        ]).toArray();
    }
    return res.json(results);
}


router.get("/marks", getMarksAndCount);

router.post("/", bodyParser.json(), getCarsWithSetting);

module.exports = router;
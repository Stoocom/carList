const express = require('express');
const app = express();
const carRouter = require('./routes/carRoute');
const cors = require("cors");
const db = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

db.connect(() => {
    app.listen(process.env.PORT || 3010, function (){
        console.log(`Listening`);
    });
});

app.use("/api", carRouter);




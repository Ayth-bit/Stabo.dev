const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const port = 3000;

// CORS設定
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// JSONデータのパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static('public'));

// 掲示板の表示
app.get('/board', async (req, res) => {
    try {
        const params = {
            TableName: 'boards',
            ProjectionExpression: 'id, title, message'
        };
        const result = await dynamodb.scan(params).promise();
        res.json(result.Items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 掲示板への書き込み
app.post('/board', async (req, res) => {
    const { title, message } = req.body;

    try {
        const boardData = {
            id: Date.now().toString(),
            title: title,
            message: message
        };
        await dynamodb.put({ TableName: 'boards', Item: boardData }).promise();
        res.send('Message posted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

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

// 掲示板の表示
app.get('/board/:qrCode', async (req, res) => {
    const qrCode = req.params.qrCode;
    const location = req.query.location; // クエリパラメータから位置情報を取得

    // 位置情報によるアクセス制限
    if (!validateLocation(location)) {
        return res.status(403).send('Access denied');
    }

    try {
        const params = {
            TableName: 'boards',
            Key: { qrCode: qrCode }
        };
        const result = await dynamodb.get(params).promise();

        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).send('Board not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 掲示板への書き込み
app.post('/board/:qrCode', async (req, res) => {
    const qrCode = req.params.qrCode;
    const message = req.body.message;
    const location = req.query.location; // クエリパラメータから位置情報を取得

    // 位置情報によるアクセス制限
    if (!validateLocation(location)) {
        return res.status(403).send('Access denied');
    }

    try {
        const params = {
            TableName: 'boards',
            Key: { qrCode: qrCode },
            UpdateExpression: 'set #messages = list_append(#messages, :message)',
            ExpressionAttributeNames: {
                '#messages': 'messages'
            },
            ExpressionAttributeValues: {
                ':message': [message]
            }
        };
        await dynamodb.update(params).promise();
        res.send('Message posted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// 位置情報の検証関数
function validateLocation(location) {
    // 位置情報の検証ロジックをここに実装
    // 例: 特定の範囲内にいるかどうか
    return true; // 一時的に常に許可
}

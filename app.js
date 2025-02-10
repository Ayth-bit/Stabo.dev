const express = require('express');
const app = express();
const port = 3000;

// 静的ファイルの提供
app.use(express.static('public'));

// トップページの表示
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

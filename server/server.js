const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

// 读取数据
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf-8");
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// 写入数据
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// 获取全部图书
app.get('/books', (req, res) => {
  const data = readData();
  res.json(data);
});

// 添加图书
app.post('/books', (req, res) => {
  const data = readData();
  const book = req.body;
  book.id = Date.now().toString(); // 简单的唯一 id
  data.push(book);
  writeData(data);
  res.json(book);
});

// 更新图书
app.put('/books/:id', (req, res) => {
  const data = readData();
  const id = req.params.id;
  const idx = data.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  data[idx] = { ...data[idx], ...req.body, id };
  writeData(data);
  res.json(data[idx]);
});

// 删除图书
app.delete('/books/:id', (req, res) => {
  let data = readData();
  const id = req.params.id;
  const idx = data.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const removed = data.splice(idx, 1);
  writeData(data);
  res.json(removed[0]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
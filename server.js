const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5500;

const _dirname = __dirname + '/WebFront-Hits-frontend-project-2';

app.get('/:page', (req, res) => {   
    const page = req.params.page;
  
    // Отправляем базовую структуру
    const indexPath = path.join(_dirname, '../index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
    // Читаем содержимое страницы и вставляем в <main>
    const pagePath = path.join(_dirname, `../views/${page}.html`);
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
    // Вставляем содержимое страницы внутрь <main>
    const modifiedContent = indexContent.replace('<main></main>', `<main>${pageContent}</main>`);
  
    // Отправляем результат
    res.status(200).send(modifiedContent);
});

app.get('/post/:id', (req, res) => {   
    const indexContent = fs.readFileSync( path.join(_dirname, '../index.html'), 'utf-8');
    const postContent = fs.readFileSync(path.join(_dirname, `../views/post.html`), 'utf-8');
  
    // Вставляем содержимое страницы внутрь <main>
    const modifiedContent = indexContent.replace('<main></main>', `<main>${postContent}</main>`);
  
    // Отправляем результат
    res.status(200).send(modifiedContent);
});

app.get('/communities/:id', (req, res) => {   
  const indexContent = fs.readFileSync( path.join(_dirname, '../index.html'), 'utf-8');
  const communityContent = fs.readFileSync(path.join(_dirname, `../views/community.html`), 'utf-8');

  // Вставляем содержимое страницы внутрь <main>
  const modifiedContent = indexContent.replace('<main></main>', `<main>${communityContent}</main>`);

  // Отправляем результат
  res.status(200).send(modifiedContent);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(_dirname, '../index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
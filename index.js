const express = require('express');
const server = express();

const router = require('./posts/posts-router')

server.use(expres.json());

const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`);
  next;
}

server.use(logger);

server.use('/api/posts', router);

server.listen(4000, (req, res) => console.log('Server listening on port 4000'))
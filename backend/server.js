const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(cors());
server.use(middlewares);
server.use(router);

server.listen(3001, () => {
    console.log('Backend server running on http://localhost:3001');
    console.log('Users API: http://localhost:3001/users');
});
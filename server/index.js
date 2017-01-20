const app = require('express')();
const server = require('http').createServer(app);
require('./variables/paths')(app);

const port = 8888;

/* run server listen on 8888 */
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`drawful server is connected to port ${port}`);
});

/* socket io */
const io = require('socket.io').listen(server);
require('./socket-io/sockets')(io);

/*  static middle */
app.use(require('./middleware/static.middleware'));

/* file path */
app.get('/*', (req, res, next) => {
  console.log('requiring path:', req.path);
  res.sendFile(app.get('indexHTMLPath'));
  next();
});

/*  error handling*/
app.get((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'server error occured');
  next();
});



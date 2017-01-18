'use strict';

const app = require('express')();
const path = require('path');
const chalk = require('chalk');
require('./variables/paths')(app);

const port = 8888;


/*static middle*/
app.use(require('./middleware/static.middleware'));



app.get('/*', (req, res, next) => {
    console.log('requiring path:', req.path);
    res.sendFile(app.get('indexHTMLPath'))
});

/*error handling*/
app.get((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'server error occured');
});

const server = app.listen(port, (err) => {
    if(err) throw err;
    console.log(`drawful server is connected to port ${port}`);
});

module.exports = server;
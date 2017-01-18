'use strict';

const path = require('path');

const logMiddleware = require('volleyball');

const rootPath = path.join(__dirname, '..', '..');

const indexPath = path.join(rootPath, './client/index.html');

module.exports = (app) => {
    app.set('projectRoot', rootPath);
    app.set('indexHTMLPath', indexPath);
}
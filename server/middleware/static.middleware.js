'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

const rootPath = path.join(__dirname, '..', '..');
const buildPath = path.join(rootPath, 'build');


router.use(express.static(buildPath));

module.exports = router;

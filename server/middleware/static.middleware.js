'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

const rootPath = path.join(__dirname, '..', '..');
const buildPath = path.join(rootPath, 'build');
const imagePath = path.join(rootPath, 'client');


router.use(express.static(buildPath));
router.use(express.static(imagePath));

module.exports = router;

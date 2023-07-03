const express = require('express');
const dotenv = require('dotenv').config();
const ConnectDatabase = require('./src/configs/Database');

const app = express();
ConnectDatabase();


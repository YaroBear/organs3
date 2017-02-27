var express = require("express");
var mongodb = require("mongodb");

var app = express();

//importing init_collections.js
var collections = require("./init_collections");

collections.buildCollections();
//collections.destroyCollections();
#!/usr/bin/env node
'use strict';

const DEBUG = true;

function list(val) {
  return val.split(',');
}

var express = require('express'),
    opts = require('commander')
        .version('0.0.2')
        .option('-p, --port <n>', 'port address of this config server client application - default is 8080', parseInt)
        .option('-a, --application <s>', 'config server application')
        .option('-r, --profiles <items>', 'config server profiles', list)
        .option('-e, --configserver <s>', 'config server host')
        .parse(process.argv),
    fs = require('fs'),
    app = express(),
    port = (opts.port === parseInt(opts.port, 10)) ? opts.port : 8080,
	application = opts.application,
	profiles = opts.profiles,
	configserver = opts.configserver;

if (!opts.application) {
	console.log('The command line option --application is required. See \'node server.js --help\'.');
	process.exit();
}
if (!opts.profiles) {
	console.log('The command line option --profiles is required. See \'node server.js --help\'.')
	process.exit();
}
if (!opts.configserver){ 
	console.log('The command line option --configserver is required. See \'node server.js --help\'.');
	process.exit()
}

const client = require(".");
const options = {
    application: application,
    endpoint: configserver,
    profiles: profiles
};

app.get('/_properties', function (req, res) {
    client.load(options).then((cfg) => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(cfg._properties);
    }).catch((error) => console.error(error));
});

app.listen(port, function () {
    console.log(
        'running on port ' + port + ' with options ' + JSON.stringify(options)
    );
});
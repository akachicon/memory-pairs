const express = require('express'),
  app = express(),
  PORT = process.env.PORT || 3030;

app.use('/favicon.ico', express.static(__dirname + '/resources/favicon.ico'));

app.use(express.static(__dirname, { maxAge: 7 * 60 * 60 * 1000 }));

app.listen(PORT, console.log(`memory game server is running on port ${ PORT }`));

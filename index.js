const express  = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3123;

app.use( bodyParser.json() );

app.post("/trello", function(req, res, next) {
	// const {} = req.body;
	console.log(req.body);
	res.send('OK');
});

const server = app.listen(port, function () {
	console.log('Webhook handler listening on port %s', port);
});
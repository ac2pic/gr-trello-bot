const express  = require('express'),
	fetch = require('node-fetch'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3123;

app.use( bodyParser.json() );
const discordWebhookUrl = 'https://discordapp.com/api/webhooks/696156837963104277/n1AhF8X0YlPxfxTEsGsxwfUjNKaNkAbFr7FRAAkqg2e_XqD2OsciPLIFNGmLRZr3O9DY';

function sendDiscordMessage(message) {
	return fetch(discordWebhookUrl, {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(message)
	});
}

app.post("/trello", async (req, res, next) => {
	const {name, url} = req.body;

	await sendDiscordMessage({
		"embeds": [{
			"color": 6232278,
			"title": "Card Complete",
			"description": `The "[${name}](${url})" step has been completed!`,
			"image": {
			  "url": "https://cdn.discordapp.com/attachments/696050162149097613/696129710266253392/tumblr_p4rz82xWrm1vte390o3_500.gif"
			}
		}]
	});
	res.send('OK');
});

const server = app.listen(port, function () {
	console.log('Webhook handler listening on port %s', port);
});
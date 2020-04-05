const express = require('express'),
	fetch = require('node-fetch'),
	app = express(),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3123;

app.use(bodyParser.json());

const gifs = [
	"https://cdn.discordapp.com/attachments/696050162149097613/696129710266253392/tumblr_p4rz82xWrm1vte390o3_500.gif"
];

function sendDiscordMessage(message) {
	return fetch(process.env.webhook_url.trim(), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(message)
	});
}


const chooseRandom = (arr) => arr[parseInt(Math.random() * arr.length)];


app.head('/trello', (req, res, next) => {
	console.log('Trello called.');
	next();
});

app.post("/trello", async (req, res, next) => {
	const { action, model } = req.body;

	if (action && action.type === 'updateCard') {

		const data = action.data;
		if (data.listBefore) {
			const [old_list, new_list] = [data.listBefore.name, data.listAfter.name];

			if (old_list !== new_list && new_list.toLowerCase() === 'completed') {
				console.log(req.body);
				/*await sendDiscordMessage({
					"embeds": [{
						"color": 6232278,
						"title": "Step Complete",
						"description": `The [${name}](${url}) step has been completed!`,
						"image": {
							"url": chooseRandom(gifs)
						}
					}]
				});*/
			}

		}

	}

	res.send('OK');
});

app.listen(port, function () {
	console.log('Webhook handler listening on port %s', port);
});
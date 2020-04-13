const express = require('express'),
	fetch = require('node-fetch'),
	app = express(),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3123;

app.use(bodyParser.json());

const gifs = [{
	"comment": "Kat and Raven nod",
	"image": "https://cdn.discordapp.com/attachments/696050162149097613/696129710266253392/tumblr_p4rz82xWrm1vte390o3_500.gif"
}, {
	"comment": "Kat cheer",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696863984057450536/napKSIJ.gif"
}, {
	"comment": "Kat and Raven final attack",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696864515358195812/FondLittleGrizzlybear-size_restricted.gif"
}, {
	"comment": "GR2 Kat and Raven fight military",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696864845433143378/g4gif.gif"
}, {
	"comment": "GR: Overture Kat fighting Nevi",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696865232869523496/1470.gif"
}, {
	"comment": "GR2 Kat random fight montage",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696865460695859292/34461.gif"
}, {
	"comment": "GR2 big boy damage",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696866844073525308/34458.gif"
}, {
	"comment": "Homeless Kat slaps evil, smug boy",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696867465187033168/ezgif-6-0baff79647af.gif"
}, {
	"comment": "Kat and Raven shift up after eating",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696868355591634974/ezgif-6-af2aad28f00b.gif"
}, {
	"comment": "Kat and Cecie look at crates full of gems",
	"image": "https://media.discordapp.net/attachments/696096294967705630/696210652527853608/ep03_5_12_files.png"
}, {
	"comment": "Kat happy",
	"image": "https://media.discordapp.net/attachments/696096294967705630/696210677471248384/ep08_1_68_files.png"
}, {
	"comment": "Smug kat",
	"image": "https://cdn.discordapp.com/attachments/696096294967705630/696215805750149161/unknown.png"
}, {
	"comment": "Nice art",
	"image": "https://media.discordapp.net/attachments/696096294967705630/696216054019391578/gallery_illustration_003.png"
}, {
	"comment": "Kali Angel grows wings",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696869665548533760/ezgif-6-e83d0e0aa8f1.gif"
}, {
	"comment": "Kali Angel kills robot. Rip",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696870305506787328/ezgif-6-56bd2f512843.gif"
}, {
	"comment": "Kali Angel angry",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696870837139144714/ezgif-6-7725371e5f95.gif"
}, {
	"comment": "Raven Ready to fight",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696871415491592292/ezgif-6-8e9140d6e32d.gif"
}, {
	"comment": "Raven has been spotted",
	"image": "https://media.discordapp.net/attachments/559791525303681034/696871690344595536/ezgif-6-f64ccf93ffb6.gif"
}];

function sendDiscordMessage(message) {
	return fetch(process.env.webhook_url.trim(), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(message)
	});
}


const chooseRandom = (arr) => {
	const index = parseInt(Math.random() * arr.length);
	return {
		choice: arr[index],
		index
	};
};


app.get('/ping', (req, res, next) => {
	console.log('Pinged server to keep it alive.');
	res.sendStatus(200);
});

app.head('/trello', (req, res, next) => {
	res.sendStatus(200);
});

function createCardUrl(shortLink) {
	return `https://trello.com/c/${shortLink}/`;
}

async function onUpdateCard(body) {
	const action = body.action;
	const data = action.data;
	const { username } = body.memberCreator;

	if (data.listBefore) {
		const [old_list, new_list] = [data.listBefore.name, data.listAfter.name];
		if (old_list !== new_list) {
			const { name, shortLink } = data.card;
			const card_url = createCardUrl(shortLink);
			if (new_list.toLowerCase() === 'completed') {
				const { choice: { image }, index } = chooseRandom(gifs);
				console.log(`Selected "${image} at ${index}.`);
				await sendDiscordMessage({
					"embeds": [{
						"color": 6232278,
						"title": "Step Complete",
						"description": `${username} marked [${name}](${card_url}) as completed!`,
						"image": {
							"url": image
						}
					}]
				});
			} else if (new_list.toLowerCase() === 'in progress') {
				await sendDiscordMessage({
					"embeds": [{
						"color": 6232278,
						"title": "New card in progress",
						"description": `[${name}](${card_url}) has been moved to "${new_list}"!`
					}]
				});
			}
		}
	}
}

async function onCreateCard(body) {
	const action = body.action;
	const { username } = body.memberCreator;
	const data = action.data;
	const list = data.list;
	const { name, shortLink } = data.card;
	const card_url = createCardUrl(shortLink);

	await sendDiscordMessage({
		"embeds": [{
			"color": 6232278,
			"title": "New card",
			"description": `${username} created [${name}](${card_url}) under "${list.name}"!`
		}]
	});
}

app.post("/trello", async (req, res, next) => {
	const { action, model } = req.body;
	if (action) {
		switch (action.type) {
			case 'updateCard': {
				await onUpdateCard(req.body);
				break;
			}
			case 'createCard': {
				await onCreateCard(req.body);
				break;
			}
		}
	}
	res.send('OK');
});

app.listen(port, function () {
	console.log('Webhook handler listening on port %s', port);
});
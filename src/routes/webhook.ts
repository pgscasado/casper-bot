import { Router } from 'express'

export const webhookRouter = Router()
	.get('/', (req, res) => {
		res.send('It is working! :D')
	})
	.post('/', (req, res) => {
		let intent = req.body.queryResult.intent.displayName;
		if (!intent)
			return res.status(400).send("Not a intent")
		console.log(intent)
		return res.status(200).json({
			"fulfillmentText": "Olá, eu sou o Casper, o seu assistente de notícias! Me chama no Messenger do Facebook que lá eu posso te ajudar melhor :)",
			"fulfillmentMessages": [
				{
				"quickReplies": {
					"title": "Olá, eu sou o Casper, o seu assistente de notícias!\nSobre qual tipo de notícia você quer ler?",
					"quickReplies": [
						"Esportes",
						"Política",
						"Entretenimento",
						"Famosos"
					]
				},
				"platform": "FACEBOOK"
				},
			],
			})
	})
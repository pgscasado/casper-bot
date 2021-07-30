import { newsModel } from '../../models/News';
import { IntentHandler } from '../../classes/Handler.class';

export const welcomeIntentHandler = new IntentHandler('Default Welcome Intent')
	.default((intent, req, res) => {
		res.status(200).json({
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
			]
		});
	});
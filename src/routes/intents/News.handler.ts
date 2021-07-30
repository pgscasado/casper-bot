import { newsModel } from '../../models/News';
import { IntentHandler } from '../../classes/Handler.class';

interface FBGeneric {
	image_url: string,
	buttons: {
		url: string,
		type: "web_url",
		title: string
		}[],
	title: string,
	subtitle: string,
	default_action: {
		webview_height_ratio: "tall",
		url: string,
		type: "web_url"
	}
}

export const newsIntentHandler = new IntentHandler('Default Welcome Intent - yes')
	.default((intent, req, res) => {
		if(intent.parameters['noticias_categoria'] === 'Esporte') {
			newsModel.paginate({
				page: req.query.page || 1,
				limit: 10
			}).then(
				(docs) => { 
					let elements: FBGeneric[] = []
					if(docs)
						docs.docs.forEach((news) => {
							elements.push({
								image_url: news.picture_url.valueOf(),
								buttons: [
									{
										url: news.news_url.valueOf(),
										type: "web_url",
										title: "Visitar"
									}
								],
								title: news.title.valueOf(),
								subtitle: news.description.valueOf(),
								default_action: {
									webview_height_ratio: "tall",
									url: news.news_url.valueOf(),
									type: "web_url"
								}
							})
						})
					res.status(200).json({
						"fulfillmentMessages": [{
							"payload": {
								"facebook": {
									"attachment": {
										"type": "template",
										"payload": {
										"template_type": "generic",
										"elements": elements
										}
									}
								}
							},
							"platform": "FACEBOOK"
						}]
				  }) },
				(err) => { console.error(err.message); res.status(500).end(err.message); }
			  )
		} else {
			console.error("Unknown parameter!");
			res.status(400).end("Unknown parameter!");
		}
	})
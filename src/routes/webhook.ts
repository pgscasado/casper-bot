import { IntentHandler } from '../classes/Handler.class';
import { Router } from 'express'
import { handlersMap } from './intents';
import { Intent } from '../classes/Intent.class';

interface queryIntentData {
	intent: {
		name: string,
		displayName: string
	}
}

export const webhookRouter = Router()
	.get('/', (req, res) => {
		res.send('It is working! :D')
	})
	.post('/', (req, res) => {
		const { intent }: queryIntentData = req.body.queryResult;
		if (!intent.name)
			return res.status(400).send("Not a intent")
		const intentObj = new Intent(intent.name, intent.displayName, req.body.queryResult.parameters)
		if (Object.keys(handlersMap).includes(intent.displayName))
			handlersMap[intent.displayName].run(intentObj, req, res)
		else
			return res.status(200).json({
				'fulfillmentText': 'Não sei te responder isso :('
			})
	})
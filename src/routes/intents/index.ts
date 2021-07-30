import { welcomeIntentHandler } from './Welcome.handler';
import { IntentHandler } from '../../classes/Handler.class';
import { newsIntentHandler } from './News.handler'

const handlers = [
	newsIntentHandler, welcomeIntentHandler
]

export const handlersMap: {[name: string]: IntentHandler} = {};

handlers.forEach((h: IntentHandler) => { handlersMap[h.name] = h });
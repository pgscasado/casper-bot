import { Request, Response } from 'express';
import { Intent } from './Intent.class';

export class IntentHandler {
	name: string;
	private defaultFn: (intent: Intent, req: Request, res: Response) => void = () => {};
	
	constructor(name: string) {
		this.name = name;
	}
	
	default(fn: (intent: Intent, req: Request, res: Response) => void) {
		this.defaultFn = fn;
		return this;
	}
	
	run(intent: Intent, req: Request, res: Response) {
		this.defaultFn(intent, req, res);
		return this;
	}
}
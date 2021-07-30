export class Intent {
	public name: string;
	public displayName: string;
	public parameters: {[name: string]: string};
	
	constructor(name: string, displayName: string, parameters: {[name: string]: string}) {
		this.name = name;
		this.displayName = displayName;
		this.parameters = parameters;
	}

	isFollowUpIntent() {
		return (this.displayName.split(' - ').length > 1)
	}
}
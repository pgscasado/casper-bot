controller = {}

controller.init = function() {
	console.log("it works")
}

controller.sanitizeAndSubmit = function() {
	let input = document.getElementById('typeNumber')
	input.value = input.value.replace(/\D+/g, '')
	if (input.value.length >= 4) {
		input.setAttribute('disabled', 'true')
		fetch('api/authenticate', {
			method: 'POST',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: input.value
			})
		})
			.then((res) => res.json())
			.then((jwt) => {
				console.log(jwt)
				localStorage.setItem('token', jwt);
				window.location.href = '/#/news-cp'
			}).catch((error) => {
				input.value = ''
				input.removeAttribute('disabled')
			})
	}
}

controller.authenticate = function() {

}

exportController = function(cb){
    cb && cb(controller);
    return controller;
}
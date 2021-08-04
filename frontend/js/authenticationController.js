controller = {}

controller.init = function() {
	document.body.style = ""
	const bd = document.querySelector('.modal-backdrop')
	if(bd) bd.parentElement.removeChild(bd)
	if(localStorage.getItem('token'))
	fetch('api/authenticate', {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${localStorage.getItem('token')}`,
			"Accept": "application/json",
			"Content-Type": "application/json"
		}
	}).then((res) => res.json())
	.then(() => {
		document.location.href = "/#/news-cp"
	}, (error) => {
		document.getElementById("errorPopUpText").innerText = 'Por favor insira o PIN, pois sua sessão expirou.'
		new mdb.Collapse(document.querySelector('.collapse.card'))
	})
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
				document.getElementById("errorPopUpText").innerText = 'O PIN fornecido está errado!'
				if(!document.querySelector('.collapse.card').classList.contains('show'))
					new mdb.Collapse(document.querySelector('.collapse.card'))
			})
	}
}

exportController = function(cb){
    cb && cb(controller);
    return controller;
}
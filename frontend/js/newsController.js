controller = {};

controller.observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false
    mutations.forEach(function(mutation) {
        shouldUpdate = shouldUpdate || mutation.type === 'attributes'
    });
    console.log(shouldUpdate)
    if(shouldUpdate){
        controller.fetchNews(()=>{
            controller.renderNews();
        });
    }
});

controller.observer.observe(document.querySelector('.modal.fade'), { attributes: true })

controller.categories = {
    'Esporte': 'success',
    'Política': 'danger',
    'Entretenimento': 'secondary',
    'Famosos': 'dark'
}

controller.categoryMap = {
    '1': 'Esporte',
    '2': 'Famosos',
    '3': 'Política',
    '4': 'Entretenimento'
}

controller.categoryReverseMap = {}
Object.keys(controller.categoryMap).forEach(k => controller.categoryReverseMap[controller.categoryMap[k]] = k)

controller.pagination = {
    page: 1,
    hasNext: false,
    hasPrev: false
}

controller.tryGetImage = function() {
    document.getElementById('previewImg').src = document.getElementById('imgURL').value
}

controller.startModal = function(param, data){
    if(document.getElementById("modalErrorPopUp").classList.contains('show'))
        new mdb.Collapse(document.getElementById("modalErrorPopUp"))
    let action = document.getElementById('modalAction'),
        newsURL = document.getElementById('newsURL'),
        imgURL = document.getElementById('imgURL'),
        category = document.getElementById('categoryInput'),
        title = document.getElementById('titleInput'),
        description = document.getElementById('descriptionInput'),
        submit = document.getElementById('submitButton'),
        closeModal = document.getElementById('closeModalButton');
    submit.removeAttribute('disabled')
    submit.classList.remove('btn-success')
    submit.classList.add('btn-primary')
    submit.innerText = 'Salvar'
    
    closeModal.classList.remove('btn-primary')
    closeModal.classList.add('btn-danger')
    closeModal.innerText = 'Cancelar'

    document.getElementById('previewImg').src = '';
    if (param === 'create') {
        action.innerText = 'Cadastrar notícia'
        newsURL.value = ''
        imgURL.value = ''
        category.value = ''
        title.value = ''
        description.value = ''
        submit.addEventListener('click', () => {
            console.log(newsURL.value,
                imgURL.value,
                title.value,
                description.value,
                category.value,)
            if(newsURL.value !== ''
            && imgURL.value !== ''
            && title.value !== ''
            && description.value !== ''
            && +category.value > 0) {
                submit.setAttribute('disabled', undefined)
                fetch('/api/news', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title.value,
                        description: description.value,
                        category: controller.categoryMap[category.value],
                        picture_url: imgURL.value,
                        news_url: newsURL.value,
                    })
                }).then(() => {
                    submit.classList.remove('btn-primary')
                    submit.classList.add('btn-success')
                    submit.innerText = 'Salvo!'
                    submit.replaceWith(submit.cloneNode(true))
                    
                    closeModal.classList.remove('btn-danger')
                    closeModal.classList.add('btn-primary')
                    closeModal.innerText = 'Fechar'
                    closeModal.addEventListener('click', () => {
                        controller.fetchNews(()=>{
                            controller.renderNews();
                            closeModal.onclick=undefined
                        });
                    })
                }).catch((error) => {
                    console.log(error)
                    window.location.href = '/#/'
                })
            } else {
                document.getElementById('modalErrorPopUpText').innerText = `Por favor, preencha os campos: 
                ${newsURL.value ? '':'Link da notícia\n'}${imgURL.value ? '': 'Link da imagem\n'}${category.value ? '' : 'Categoria\n'}${title.value ? '' : 'Título da notícia\n'}${description.value ? '' : 'Descrição da notícia'}`
                new mdb.Collapse(document.querySelector('#modalErrorPopUp'))
            }
        })
    } else if (param === 'edit') {
        action.innerText = 'Editar notícia'
        newsURL.value = data.news_url
        imgURL.value = data.picture_url
        document.getElementById('previewImg').src = data.picture_url;
        category.value = this.categoryReverseMap[data.category]
        title.value = data.title
        description.value = data.description
        submit.addEventListener('click', () => {
            console.log(newsURL.value,
                imgURL.value,
                title.value,
                description.value,
                category.value,)
            if(newsURL.value !== ''
            && imgURL.value !== ''
            && title.value !== ''
            && description.value !== ''
            && +category.value > 0) {
                let newsbody = {
                    _id: data._id,
                    title: title.value,
                    description: description.value,
                    picture_url: imgURL.value,
                    news_url: newsURL.value,
                    category: this.categoryMap[category.value],
                }
                submit.setAttribute('disabled', undefined)
                fetch(`api/news/${data._id}`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newsbody)
                }).then(response => response.json())
                .then(json => {
                    console.log(json);
                    submit.classList.remove('btn-primary')
                    submit.classList.add('btn-success')
                    submit.innerText = 'Salvo!'
                    submit.replaceWith(submit.cloneNode(true))
                    
                    closeModal.classList.remove('btn-danger')
                    closeModal.classList.add('btn-primary')
                    closeModal.innerText = 'Fechar'
                    closeModal.addEventListener('click', () => {
                        controller.fetchNews(()=>{
                            controller.renderNews();
                            closeModal.onclick=undefined
                        });
                    })
                })
                .catch(error => {
                    console.error(error);
                    window.location.href = '/#/'
                });
            } else {
                document.getElementById('modalErrorPopUpText').innerText = `Por favor, preencha os campos: 
                ${newsURL.value ? '':'Link da notícia\n'}${imgURL.value ? '': 'Link da imagem\n'}${category.value ? '' : 'Categoria\n'}${title.value ? '' : 'Título da notícia\n'}${description.value ? '' : 'Descrição da notícia'}`
                new mdb.Collapse(document.querySelector('#modalErrorPopUp'))
            }
        })
    }
}

controller.fetchNews = function(cb){
    console.log('fetching news');
    fetch(`api/news?page=${controller.pagination.page || 1}`, {method: "GET", headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }})
    .then(response => response.json())
    .then(json => {
        console.log(json)
        controller.news = json;
        controller.pagination = {
            hasNext: json.hasNextPage,
            hasPrev: json.hasPrevPage,
            page: json.page
        }
        cb && cb();
    })
    .catch(error => {
        window.location.href = '/#/'
        console.error(error);
    });
}

controller.deleteNews = function(id,cb){
    fetch(`api/news/${id}`, {method: "DELETE",  headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }})
    .then(response => response.json())
    .then(json => {
        console.log(json);
        cb && cb();
    })
    .catch(error => {
        console.error(error);
        window.location.href = '/#/'
    })
}

controller.patchNews = function(id, newsbody, cb){    
};

controller.renderNews = function(cb){
    console.log('renderizing news');
    document.querySelector("#newslist").innerHTML = "";

    this.news.docs.forEach(t => {
        let editIcon = document.createElement("button");
        editIcon.classList.add('btn', 'btn-sm', 'btn-warning', 'w-100')
        editIcon.innerHTML = '<i class="fas fa-pen"></i>'
        editIcon.setAttribute('data-mdb-toggle', 'modal')
        editIcon.setAttribute('data-mdb-target', '#interactionModal')
        editIcon.addEventListener('click', () => this.startModal('edit', t))
        let deleteIcon = document.createElement("button");
        deleteIcon.classList.add('btn', 'btn-sm', 'btn-danger', 'w-100')
        deleteIcon.innerHTML = '<i class="fas fa-trash"></i>'
        deleteIcon.addEventListener('click', () => this.deleteNews(t._id, () => {
            this.fetchNews(() => {
                this.renderNews()
            })
        }))
        let manageGroup = document.createElement('div');
        manageGroup.classList.add('btn-group')
        manageGroup.setAttribute('role', 'group')
        manageGroup.appendChild(editIcon)
        manageGroup.appendChild(deleteIcon)
        // imgIcon.addEventListener('click', () => window.open(t.picture_url))
        // url buttons
        let imgIcon = document.createElement("button");
        imgIcon.classList.add('btn', 'btn-sm', 'btn-primary', 'w-100')
        imgIcon.innerHTML = '<i class="fas fa-image"></i>'
        imgIcon.addEventListener('click', () => window.open(t.picture_url))
        let urlIcon = document.createElement("button");
        urlIcon.classList.add('btn', 'btn-sm', 'btn-primary', 'w-100')
        urlIcon.innerHTML = '<i class="fas fa-link"></i>'
        urlIcon.addEventListener('click', () => window.open(t.news_url))
        let btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group')
        btnGroup.setAttribute('role', 'group')
        btnGroup.appendChild(imgIcon)
        btnGroup.appendChild(urlIcon)
        // title
        let title = document.createTextNode(t.title);
        // category
        let category = document.createElement('button');
        category.innerText = (t.category);
        category.classList.add('btn', `btn-outline-${controller.categories[t.category]}`);
        category.style.cursor = 'default';
        // description
        let description = document.createTextNode(t.description);

        // list item setup
        let row = document.createElement("tr")
        let col = [
            document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td")
        ]
        col.forEach(c => {
            c.classList.add('text-left');
            row.appendChild(c);
        }); 
        col[0].appendChild(manageGroup)
        col[0].classList.add('col-2')
        // button group
        col[1].appendChild(btnGroup);
        col[1].classList.add('col-2')
        // button group
        col[1].appendChild(btnGroup);
        col[1].classList.add('col-2')
        // title
        col[2].appendChild(title);
        // col[2].classList.add('text-truncate')
        // category
        col[3].appendChild(category);
        col[3].classList.add('col-1')
        // description
        col[4].appendChild(description);
        // col[4].classList.add('text-truncate','mw-100')

        document.querySelector("#newslist").appendChild(row);
    });
    let row = document.createElement("tr"),
        btnGroup = document.createElement("div"),
        td = document.createElement('td'),
        btns = [document.createElement("button"), document.createElement("button"), document.createElement("button")]
    btnGroup.classList.add('btn-group')
    btnGroup.setAttribute('role', 'group')
    btnGroup.classList.add('over')
    btns[0].classList.add('btn', 'btn-primary')
    btns[0].innerText = "Anterior"
    btns[1].classList.add('btn', 'btn-primary', 'active')
    btns[1].innerText = controller.pagination.page
    btns[2].classList.add('btn', 'btn-primary')
    btns[2].innerText = "Próxima"

    if(controller.pagination.hasPrev) {
        btns[0].removeAttribute('disabled')
    } else {
        btns[0].setAttribute('disabled', 'true')
    }
    
    if(controller.pagination.hasNext) {
        btns[2].removeAttribute('disabled')
    } else {
        btns[2].setAttribute('disabled', 'true')
    }
    console.log(this.pagination)
    btns[0].addEventListener('click', () => {
        if (btns[0].getAttribute("disabled") !== "true") {
            controller.pagination.page -= 1;
            controller.fetchNews(() => {
                controller.renderNews()
            })
        }
    })
    
    btns[2].addEventListener('click', () => {
        if (btns[2].getAttribute("disabled") !== "true") {
            controller.pagination.page += 1;
            controller.fetchNews(() => {
                controller.renderNews()
            })
        }
    })

    btns.forEach((b) => btnGroup.appendChild(b))
    td.appendChild(btnGroup)
    row.appendChild(document.createElement('td'))
    row.appendChild(document.createElement('td'))
    row.appendChild(td)
    row.appendChild(document.createElement('td'))
    row.appendChild(document.createElement('td'))
    document.querySelector("#newslist").appendChild(row);

    cb && cb();
}

controller.init = function(){
    controller.fetchNews(()=>{
        controller.renderNews();
    });
}

exportController = function(cb){
    cb && cb(controller);
    return controller;
}

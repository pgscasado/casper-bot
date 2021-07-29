controller = {};

controller.categories = {
    'Esporte': 'success',
    'Política': 'danger',
    'Entretenimento': 'secondary',
    'Famosos': 'dark'
}

controller.fetchNews = function(cb){
    console.log('fetching news');
    fetch(`api/news`, {method: "GET", headers: {
        "Authorization": "Bearer C4Sp3rB07BE3TR0OT1w56rgrt1hb56twef",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }})
    .then(response => response.json())
    .then(json => {
        console.log(json)
        controller.news = json;
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    });
}

controller.createNews = function(cb){
    data = document.querySelector("#newnewsform").elements;
    var newnews = {};
    for(var field of data){
        console.log(field.value);
        if(field.value){
            newnews[field.name] = field.key||field.value;
        }
    }
    fetch(`api/news`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer C4Sp3rB07BE3TR0OT1w56rgrt1hb56twef",
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newnews)
    }).then(response => response.json())
    .then(json => {console.log(json); document.querySelector("#newnewsform").reset(); cb && cb();})
    .catch(error => {
        console.error(error);
    });
}

controller.deleteNews = function(id,cb){
    fetch(`api/news/${id}`, {method: "DELETE"})
    .then(response => response.json())
    .then(json => {
        console.log(json);
        controller.fetchNews(controller.renderNews);
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    })
}

controller.patchNews = function(id, newsbody, cb){
    fetch(`api/news/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer C4Sp3rB07BE3TR0OT1w56rgrt1hb56twef",
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newsbody)
    }).then(response => response.json())
    .then(json => {
        console.log(json);
        controller.fetchNews(controller.renderNews);
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    });
};

controller.toggleNews = function(id, cb){
    fetch(`api/news/${id}/toggle`, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer C4Sp3rB07BE3TR0OT1w56rgrt1hb56twef",
        }
    }).then(response => response.json())
    .then(json => {
        console.log(json);
        controller.fetchNews(controller.renderNews);
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    });
};

controller.editingAt = "";
controller.editmode = (id) => {
    if(id){
        controller.editingAt = id;
    } else {
        return controller.editingAt;
    }
}

controller.renderNews = function(cb){
    console.log('renderizing news');
    document.querySelector("#newslist").innerHTML = "";
    console.log(controller.news.docs)
    controller.news.docs.forEach(t => {
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
        // let description = document.createElement('button');
        // description.innerText = 'Mostrar';
        // description.classList.add('btn', 'btn-primary')
        // description.setAttribute('data-mdb-toggle', 'collapse')
        // description.setAttribute('data-mdb-target', `#_${t._id}`)
        // let descTr = document.createElement('tr');
        // descTr.id = `_${t._id}`
        // descTr.innerText = t.description;
        // descTr.classList.add('collapse')

        // list item setup
        let row = document.createElement("tr")
        let col = [
            document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td")
        ]
        col.forEach(c => {
            c.classList.add('text-center');
            row.appendChild(c);
        }); 
        // button group
        col[0].appendChild(btnGroup);
        col[0].classList.add('col-2')
        // title
        col[1].appendChild(title);
        col[1].classList.add('text-truncate')
        // category
        col[2].appendChild(category);
        col[2].classList.add('col-1')
        // description
        col[3].appendChild(description);
        col[3].classList.add('text-truncate','mw-100')

        document.querySelector("#newslist").appendChild(row);
    });
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

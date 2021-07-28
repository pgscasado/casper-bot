
// ---------------------- Global Variables

const defaultSocket = `${window.location.hostname}${window.location.port ? ":"+window.location.port:""}`,
    apiRoute = `${window.location.hostname}/api`,
    pieces = {
        "/": {file:"welcome.html", displayName: "Home", controller: ""},
        "/news-cp": {file:"news.html", displayName: "Painel de Controle", controller: "js/newsController.js"},
        "/contact": {file:"contact.html", displayName: "Contato", controller: ""},
        "/not-found": {file:"not-found.html", displayName: "Not Found", controller: ""},
    };

// ---------------------------------------

function fetchView(hash, callback){
    hash = hash.split("#")[1];
    if(!Object.keys(pieces).some(k => k === hash)){
        window.location.href = "/#/not-found";
        console.error("This route isn't registered");
        return;
    }

    fetch(`pieces/views/${pieces[hash].file}`)
    .then(response => {
        return response.text().then(html=>{
            if(document.querySelector("#controller")){
                document.querySelector("#controller").parentNode.removeChild(document.querySelector("#controller"));
                controller.destroy && controller.destroy();
                delete controller;
            }
            if(pieces[hash].controller)
                loadJs(pieces[hash].controller, ()=>{
                    viewController = exportController();
                    controller.init();
                });
            if(callback) callback(html);
            return html;
        });
    })
    .catch(error => {
        console.log(error);
        return error;
    });
}

function loadJs(url, callback){
    var script = document.createElement("script");
    script.setAttribute('src', url);
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('id', 'controller');
    var loaded = false;
    var loadFunction = () => {
        if(loaded) return;
        loaded = true;
        callback && callback();
    }
    script.onload = loadFunction;
    script.onreadystatechange = loadFunction;
    document.querySelector("#scripts").appendChild(script);
}

function initComponents(){
    if(!window.location.href.includes(`${defaultSocket}/#/`)){
        window.location.href = "/#/";
        window.location.reload();
        return;
    }
    window.onhashchange = (evt) => {
        fetchView(window.location.hash, (html) =>{
            document.querySelector("#dynamicWrapper").innerHTML = html;
        });
    }

    fetch('pieces/navbar.html')
    .then(response => {
        response.text().then(html=>{
            document.querySelector("#navbarWrapper").innerHTML = html;
            Object.keys(pieces).filter((k) => k !== "/not-found" && k !== "/").map((k)=>{
                let a = document.createElement("a");
                a.className = "nav-link",
                a.href = "#"+k;
                let text = document.createTextNode(pieces[k].displayName);
                a.appendChild(text);
                document.querySelector("#navLinks").appendChild(a);
            });
        });
    })
    .catch(error => {
        console.log(error);
    });

    fetchView(window.location.hash, (html) =>{
        document.querySelector("#dynamicWrapper").innerHTML = html;
    });
}

body.onload = initComponents();
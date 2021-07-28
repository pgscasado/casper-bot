controller = {};

controller.importanceClass = {
    0: {bg: "primary", text: "light", displayText: "low"},
    1: {bg: "warning", text: "dark", displayText: "medium"},
    2: {bg: "danger", text: "light", displayText: "high"},
}

controller.fetchTasks = function(cb){
    console.log('fetching tasks');
    fetch(`api/tasks`, {method: "GET"})
    .then(response => response.json())
    .then(json => {
        controller.tasks = json.tasks;
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    });
}

controller.createTask = function(cb){
    data = document.querySelector("#newtaskform").elements;
    var newtask = {};
    for(var field of data){
        console.log(field.value);
        if(field.value){
            newtask[field.name] = field.key||field.value;
        }
    }
    fetch(`api/tasks`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newtask)
    }).then(response => response.json())
    .then(json => {console.log(json); document.querySelector("#newtaskform").reset(); cb && cb();})
    .catch(error => {
        console.error(error);
    });
}

controller.deleteTask = function(id,cb){
    fetch(`api/tasks/${id}`, {method: "DELETE"})
    .then(response => response.json())
    .then(json => {
        console.log(json);
        controller.fetchTasks(controller.renderTasks);
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    })
}

controller.patchTask = function(id, taskbody, cb){
    fetch(`api/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskbody)
    }).then(response => response.json())
    .then(json => {
        console.log(json);
        controller.fetchTasks(controller.renderTasks);
        cb && cb();
    })
    .catch(error => {
        console.error(error);
    });
};

controller.toggleTask = function(id, cb){
    fetch(`api/tasks/${id}/toggle`, {
        method: "PATCH"
    }).then(response => response.json())
    .then(json => {
        console.log(json);
        controller.fetchTasks(controller.renderTasks);
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

controller.renderTasks = function(cb){
    console.log('renderizing tasks');
    document.querySelector("#taskslist").innerHTML = "";
    console.log(controller.tasks.docs)
    controller.tasks.docs.forEach(t => {
        if(t._id == controller.editmode()){
            let title = document.createElement("input");
            title.setAttribute("id", `title${t._id}`);
            title.setAttribute("type", "text");
            title.setAttribute("name", "title");
            title.setAttribute("placeholder", "Title");
            title.setAttribute("value", t.title);
            title.setAttribute("class", "form-control");
            let importance = document.createElement("select");
            importance.setAttribute("class", "custom-select");
            importance.setAttribute("id", `importance${t._id}`);
            let options = [
                {value: -1, text: "Importance", "selected": t.importance == -1},
                {value: 0, text: "Low", "selected": t.importance == 0},
                {value: 1, text: "Medium", "selected": t.importance == 1},
                {value: 2, text: "High", "selected": t.importance == 2}
            ]
            options.forEach(o => {
                let opt = document.createElement("option");
                opt.setAttribute("value", o.value);
                o.selected && opt.setAttribute("selected", "");
                opt.innerText = o.text;
                importance.appendChild(opt);
            });
            let buttonGrp = document.createElement('div');
            buttonGrp.setAttribute("class", "btn-group d-flex");
            let button = [
                document.createElement("button"), document.createElement("button")
            ]
            button[0].setAttribute("class", "btn btn-sm btn-success w-100");
            button[0].innerHTML = "<i class='fas fa-check'></i>";
            button[0].addEventListener("click", evt => {
                console.log('update here');
                let taskbody = {
                    title: document.querySelector(`#title${t._id}`).value,
                    importance: parseInt(document.querySelector(`#importance${t._id}`).value)
                }
                controller.patchTask(t._id, taskbody);
                controller.editmode(" ");
                controller.renderTasks();
            });
            button[1].setAttribute("class", "btn btn-sm btn-danger w-100");
            button[1].innerHTML = "<i class='fas fa-times'></i>";
            button[1].addEventListener("click", evt => {
                console.log('cancel here');
                controller.editmode(" ");
                controller.renderTasks();
            });
            button.forEach(b => {
                buttonGrp.appendChild(b);
            });
            var col = [
                document.createElement("div"), document.createElement("div"), document.createElement("div")
            ]
            col[0].appendChild(title);
            col[1].appendChild(importance);
            col[2].appendChild(buttonGrp);
        } else {
            let title = document.createTextNode(t.title);
            let importance = document.createElement("span");
                importanceClass = controller.importanceClass[t.importance]
            importance.innerText = importanceClass.displayText;
            importance.className = "float-right badge badge-pill badge-sm badge-"+importanceClass.bg;
            let buttonGrp = document.createElement('div');
            buttonGrp.setAttribute("class", "btn-group d-flex");
            let button = [
                document.createElement("button"), document.createElement("button"), document.createElement("button")
            ]
            button[0].setAttribute("class", "btn btn-sm btn-danger w-100");
            button[0].innerHTML = "<i class='fas fa-trash'></i>";
            button[0].addEventListener("click", evt => {
                controller.deleteTask(t._id, () => {});
            });
            button[1].setAttribute("class", "btn btn-sm btn-primary w-100");
            button[1].innerHTML = "<i class='fas fa-pen'></i>";
            button[1].addEventListener("click", evt => {
                controller.editmode(t._id);
                controller.renderTasks();
            });
            button[2].setAttribute("class", "btn btn-sm btn-"+(t.completed_at ? "success" : "danger")+" w-100");
            button[2].innerHTML = "<i class='fas fa-"+(t.completed_at ? "check" : "times")+"'></i>";
            button[2].addEventListener("click", evt => {
                controller.toggleTask(t._id);
                controller.renderTasks();
            });
            button.forEach(b => {
                buttonGrp.appendChild(b);
            });
            var col = [
                document.createElement("div"), document.createElement("div"), document.createElement("div")
            ]
            col[0].appendChild(title);
            col[1].appendChild(importance);
            col[2].appendChild(buttonGrp);
        }
        let li = document.createElement("li");
        li.className = "list-group-item bg-"+(t.completed_at ? "success" : "light")+" text-"+(t.completed_at ? "light" : "dark");
        let row = document.createElement("div")
        row.setAttribute("class","row");
        col.forEach(c => {
            c.setAttribute("class", "col");
            row.appendChild(c);
        }); 
        li.appendChild(row);
        document.querySelector("#taskslist").appendChild(li);
    });
    cb && cb();
}

controller.init = function(){
    document.querySelector("#newtaskform").addEventListener("submit", evt => {
        evt.preventDefault();
        controller.createTask(()=>{
            controller.fetchTasks(controller.renderTasks);
        });
    });
    controller.fetchTasks(()=>{
        controller.renderTasks();
    });
}

exportController = function(cb){
    cb && cb(controller);
    return controller;
}
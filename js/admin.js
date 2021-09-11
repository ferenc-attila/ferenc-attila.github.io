let dbUrl = "http://localhost:3000";
let menuDbTable = "menu";
let newsDbTable = "news";
let usersDbTable = "users";
let menuKeys = ["id", "category", "subcategory", "name", "price", "quantity", "promotion", "promotionValue"];
let newsKeys = ["id", "title", "body", "author", "date"];
let usersKeys = ["id", "name", "email", "role"];

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
};

function getDbTable(url, table) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(`${url}/${table}`, fetchOptions).then(
        resp => resp.json(),
        error => console.error(error)
    );
}

function fillTable (tableID, dbData, keys) {
    let table = document.querySelector(`${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" isn't found!`);
        return;
    }

    //Add new user row to the table.
    let tBody = table.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = newUserRow(keys);
    tBody.appendChild(newRow);
    
    for (let row of dbData) {
        let tr = createAnyElement("tr");
        for (let k of keys) {
            let td = createAnyElement("td");
            let input = createAnyElement ("input", {
                class: "form-control",
                value: row[k],
                name: k
            });
            if (k == "id") {
                input.setAttribute("readonly", true);
            }
            td.appendChild(input);
            tr.appendChild(td);
        }
        let btnGroup = createBtnGroup();
        tr.appendChild(btnGroup);
        tBody.appendChild(tr);
    }
}

function createBtnGroup () {
    let group = createAnyElement("div", {class: "btn btn-group"});
    let refreshBtn = createAnyElement("button", {class: "btn btn-info", onclick: "setRow(this)"});
    refreshBtn.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", {class: "btn btn-danger", onclick: "delRow(this)"});
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    
    group.appendChild(refreshBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);

    return td;

}

//Create new user
function newUserRow (keys) {
    let tr = createAnyElement ("tr");
    for (let k of keys) {
        let td = createAnyElement("td");
        if (k == "id") {
            td.innerHTML = "#";
        } else {
            let input = createAnyElement ("input", {
                class: "form-control",
                name: k
            });
            td.appendChild(input);
        }
        tr.appendChild(td);
    }

    let newBtn = createAnyElement("button", {
        class: "btn btn-success",
        onclick: "createUser(this)"
    });
    newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
    let td = createAnyElement("td");
    td.appendChild(newBtn);
    tr.appendChild(td);

    return tr;
}

let menu = getDbTable(dbUrl, menuDbTable).then(
    menu => fillTable("#menu", menu, menuKeys)
);

let news = getDbTable(dbUrl, newsDbTable).then(
    news => fillTable("#news", news, newsKeys)
);

let users = getDbTable(dbUrl, usersDbTable).then(
    users => fillTable("#users", users, usersKeys)
);

//Set data.
function setRow (btn) {
    let tableIdent = btn.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(`${dbUrl}/${tableIdent}/${data.id}`, fetchOptions).then (
        resp => resp.json(),
        err => console.error(err)
    ).then (
        data => getDbTable(dbUrl, tableIdent)
    );

    console.log (data);
}


function delRow(btn) {
    let tableIdent = btn.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
    let tr = btn.parentElement.parentElement.parentElement;
    let id = tr.querySelector("td:first-child").querySelector("input").getAttribute("value");
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    fetch(`${dbUrl}/${tableIdent}/${id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => getDbTable(dbUrl, tableIdent)
    );
}

function createUser(btn) {
    let tableIdent = btn.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
    let tr = btn.parentElement.parentElement;
    let data = getRowData (tr);
    delete data.id;
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(`${dbUrl}/${tableIdent}`, fetchOptions).then (
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => getDbTable(dbUrl, tableIdent)
    );
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i=0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    return data;
}
let newsData =[
    {
        "id": 1,
        "title": "Welcome!",
        "body": "We are pleased to inform you that our restaurant will open its doors tomorrow! We warmly welcome all our guests! More information (opening hours, contact information) can be found here: http://127.0.0.1:5500/html/about.html",
        "author": "Ferenc Alma",
        "date": "2021-08-31"
    },
    {
        "id": 2,
        "title": "Opening promotions!",
        "body": "You can find our opening promotions on the homepage of our website (http://127.0.0.1:5500/html/index.html) and on the menu (http://127.0.0.1:5500/html/menu.html).",
        "author": "Ferenc Attila",
        "date": "2021-09-01"
    }
];

let dbUrl = "http://localhost:3000";
let menuDbTable = "menu";
let newsDbTable = "news";

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

function filterDbTable(url, table, filter) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(`${url}/${table}${filter}`, fetchOptions).then(
        resp => resp.json(),
        error => console.error(error)
    );
}

function fillMenuTable(menu, tableID, keys) { //refaktorálás szükséges
    let tBody = document.querySelector(tableID).querySelector("tbody");
    for (let row of menu) {
        let tr = createAnyElement("tr");
        for (let k of keys) {
            if (row["promotion"] == "lower price") {
                let td = createAnyElement("td", {
                    class: "lowerPrice"
                });
                if (k == "promotionValue") {
                    td.innerHTML = (parseFloat(row["price"]) / 100 * (100 - parseFloat(row[k]))).toFixed(2);
                    tr.appendChild(td);
                } else {
                    td.innerHTML = row[k];
                    tr.appendChild(td);
                }
            } else if (row["promotion"] == "buy one get one free") {
                let td = createAnyElement("td", {
                    class: "getOneFree"
                });
                if (k == "promotionValue") {
                        td.innerHTML = "";
                        tr.appendChild(td);
                    } else {
                        td.innerHTML = row[k]
                        tr.appendChild(td);
                    }
            } else {
                continue;
            }     
        }
        tBody.appendChild(tr);
    }
};

function fillNewsBlock(newsTable){
    let newsDiv = document.querySelector("#newsDiv");
    for (let obj of newsTable) {
        for (j of newsKeys) {
            if (j == "title") {
                let newTitle = createAnyElement("blockquote", {
                    class: "text-center blockquote"
                });
                newTitle.innerHTML = obj[j];
                newsDiv.appendChild(newTitle);
            } else if (j == "body") {
                let newBody = createAnyElement("p");
                newBody.innerHTML = obj[j];
                newsDiv.appendChild(newBody);
            } else if (j == "author") {
                let newAuthor = createAnyElement("p", {
                    class: "lead" 
                });
                newAuthor.innerHTML = obj[j];
                newsDiv.appendChild(newAuthor);              
            } else if (j == "date") {
                let newDate = createAnyElement("figcaption", {
                    class: "blockquote-footer" 
                });
                newDate.innerHTML = obj[j];
                newsDiv.appendChild(newDate);              
            } else {
                continue;
            }
        }
    }
}

// Fill table of foods
let keys = ["name", "price", "promotion", "promotionValue"];

let promotions = filterDbTable(dbUrl, menuDbTable, "?promotion != none").then(
    promotions => fillMenuTable(promotions, "#promotionTable", keys)
);

// Create the news block
let newsKeys = ["id", "title", "body", "author", "date"];

let news = getDbTable(dbUrl, newsDbTable).then(
    news => fillNewsBlock(news)
);


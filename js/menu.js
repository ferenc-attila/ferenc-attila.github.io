let dbUrl = "http://localhost:3000";
let menuDbTable = "menu";

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
};

function filterDbTable(url, table, filter) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(`${url}/${table}?${filter}`, fetchOptions).then(
        resp => resp.json(),
        error => console.error(error)
    );
}

function fillMenuTable(menu, tableID, keys) { //refaktorálás szükséges
    let tBody = document.querySelector(tableID).querySelector("tbody");
    for (let row of menu) {
        let tr = createAnyElement("tr");
        for (let k of keys) {
            if (k == "category" || k == "subcategory") {
                continue;
            } else {
                    if (row["promotion"] == "lower price") {
                        let td = createAnyElement("td", {
                            class: "lowerPrice"
                        });
                        if (k == "promotionValue") {
                            td.innerHTML = (parseFloat(row["price"]) / 100 * (100 - parseFloat(row[k]))).toFixed(2);
                            tr.appendChild(td);
                        } else {
                            td.innerHTML = row[k]
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
                        if (k == "promotionValue") {
                            let td = createAnyElement("td");
                            td.innerHTML = "";
                            tr.appendChild(td);
                        } else if (k == "promotion") {
                            let td = createAnyElement("td");
                            td.innerHTML = "";
                            tr.appendChild(td);
                        } else {
                            let td = createAnyElement("td");
                            td.innerHTML = row[k]
                            tr.appendChild(td);
                        }
                    }
                }        
        }
        tBody.appendChild(tr);
    }
};

// Fill table of foods
let keys = ["category", "subcategory", "name", "price", "quantity", "promotion", "promotionValue"];

let foods = filterDbTable(dbUrl, menuDbTable, "category=food").then(
    foods => fillMenuTable(foods, "#foodTable", keys)
);

let drinks = filterDbTable(dbUrl, menuDbTable, "category=drink").then(
    drinks => fillMenuTable(drinks, "#drinkTable", keys)
);
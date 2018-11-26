const input = document.querySelector('#userInput');
const result = document.getElementById('result');
const fillin = document.getElementsByClassName('op');

//database created here
let dbPromise = idb.open("currencyconverter", 1, upgradeDB => {
    switch (upgradeDB.oldVersion) {
        case 0:
            let rateStore = upgradeDB.createObjectStore("rates");
    }
});

// a global function to be called when the user converts

let storeRate = (query, rate) => {
    let query_currencies = query.split("_");

    dbPromise
        .then(db => {
            let tx = db.transaction("rates", "readwrite");
            let rateStore = tx.objectStore("rates");

            if (query_currencies[0] == query_currencies[1]) {
                rateStore.put(parseFloat(rate).toFixed(6), query);
                return tx.complete;
            }

            rateStore.put(parseFloat(rate).toFixed(6), query);
            rateStore.put(
                parseFloat(1 / rate).toFixed(6),
                `${query_currencies[1]}_${query_currencies[0]}`
            );
            return tx.complete;
        })
        .then(() => console.log("Wow I just stored conversion rate for", query))
        .catch((err) => console.log("oops there is an error and here it is", err));
};

const autoConvert = () => {
    const from = document.querySelector('#from').value;
    const to = document.querySelector('#to').value;
    const errormessage = document.querySelector('#errormessages');
    const successmessage = document.querySelector('#successmessage');
    let valueToBeConverted = input.value;
    let query = `${from}_${to}`;
    let rate;
    if (!from || !to) {
        errormessage.innerText = `Select both currencies you wil be converting`;
        return;
    }
    dbPromise
        .then(db => {
            let tx = db.transaction("rates");
            let rateStore = tx.objectStore("rates");
            return rateStore.get(query);
        })
        .then(rate => {
            if (!rate) {
                const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;
                fetch(url)
                    .then((res) => res.json())
                    .then((res) => {
                        const keys = Object.entries(res);
                        rate = keys[0][1].val;
                        const xxx = Number(valueToBeConverted) * rate;
                        result.innerText = xxx.toLocaleString("us");
                        successmessage.innerText = `1 ${from} is equivalent to ${rate} ${to}`;
                        storeRate(query, rate);
                    })
                    .catch(err => {
                        errormessage.innerText = `Oops! seem you are not in good terms with the internet and unfortunately I'm yet to save conversion for ${query}`;
                    })
                return;
            }
            const xxx = Number(valueToBeConverted) * rate;
            result.innerText = xxx.toLocaleString("us");
            successmessage.innerText = `1 ${from} is equivalent to ${rate} ${to}`;
        });
};
const url = "https://free.currencyconverterapi.com/api/v5/currencies";
fetch(url)
    .then((res) => res.json())
    .then((res) => {
        const currencies = res.results;
        const currenciesArray = Object.entries(currencies).sort();
        currenciesArray.forEach(element => {
            // let country = element[1].name;
            let id = element[1].id;
            let name = element[1].currencyName;
            let symbolx = element[1].currencySymbol;
            if (element[1].currencySymbol == undefined) {
                symbolx = "";
            }
            fillin[0].innerHTML += `<option value="${id}">${name} - ${symbolx}</option>`;
            fillin[1].innerHTML += `<option value="${id}">${name} - ${symbolx}</option>`;
        });
    });

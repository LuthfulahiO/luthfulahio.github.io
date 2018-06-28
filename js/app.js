const input = document.querySelector('#userInput');
const result = document.getElementById('result');
const fillin = document.getElementsByClassName('op');
const autoConvert = () => {
    const from = document.querySelector('#from').value;
    const to = document.querySelector('#to').value;
    let valueToBeConverted = input.value;
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y`;
    fetch(url)
        .then((res) => res.json())
        .then((res) => {
            const keys = Object.entries(res);
            const xxx = Number(valueToBeConverted) * keys[0][1].val;
            result.innerText = xxx.toLocaleString("us");
        });
}
const url = "https://free.currencyconverterapi.com/api/v5/currencies";
fetch(url)
    .then((res) => res.json())
    .then((res) => {
        const currencies = res.results;
        const currenciesArray = Object.entries(currencies);
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
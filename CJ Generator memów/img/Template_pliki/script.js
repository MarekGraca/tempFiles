document.getElementById('searchCurrencyButton').addEventListener('click',searchCurrency);
const searchButton = document.getElementById('searchCur')
const section_one = document.getElementById('section_one');
const search = document.getElementById('search');
const homeButton = document.getElementById('home');

searchButton.addEventListener('click',()=>{
  section_one.style.display = 'none';
  search.style.display = 'block';
  searchButton.style.fontWeight = 'bold';
  homeButton.style.fontWeight = 'normal';
});

homeButton.addEventListener('click',()=>{
  search.style.display = 'none';
  section_one.style.display = 'block';
  homeButton.style.fontWeight = 'bold';
  searchButton.style.fontWeight = 'normal';
});


fetch('http://api.nbp.pl/api/exchangerates/tables/C/', {
})
.then(response => response.json())
.then(data => {
  console.log(data);
  let output1 = document.getElementById('output1');
  let output2 = document.getElementById('output2');
  printElement(output1, data[0].effectiveDate);
  data[0].rates.map((currency)=>{
    output2.innerHTML += `<span class="span1"> ${currency.currency}</span> <span class='span2'> ${currency.bid}</span><br>`;
  })
})
.catch(error => console.error(error));


fetch('http://api.nbp.pl/api/cenyzlota', {
})
.then(response => response.json())
.then(data => {
  let output1 = document.getElementById('output3');
  printElement(output1,data[0].cena);
})
.catch(error => console.error(error))

function searchCurrency(){
  let checkbox1 = document.getElementById('check1');
  let checkbox2 = document.getElementById('check2');
  let value = document.getElementById('currency_name_code').value.toUpperCase();


  if (value==='') {
    alert('Brak danych');
  }
  else  {

    if (checkbox1.checked==true) {
      searchCurrencyByCode(value,'http://api.nbp.pl/api/exchangerates/tables/A/');
      searchCurrencyByCode(value,'http://api.nbp.pl/api/exchangerates/tables/B/');
      searchCurrencyByCode(value,'http://api.nbp.pl/api/exchangerates/tables/C/');

    }
    else if (checkbox2.checked==true) {

    }
  }

}

function searchCurrencyByCode(currencyCode, api){
  fetch(api, {
  })
  .then(response => response.json())
  .then(data => {
    var output = document.getElementById('output5');
    let output1 = document.getElementById('output6');
    let outputError = document.getElementById('outputError');
    let emptyVar = "";
    let error = true;

      for (let i = 0; i < data[0].rates.length; i++) {
        let currency = data[0].rates[i];
        if (currencyCode===currency.code) {
          error = false;
          printElementOnce(output,`Znaleziono: <p> ${currency.currency} <p>`);
          if (typeof currency.mid == 'undefined') {
            printElementOnce(output1,`Cena waluty to ${currency.bid} złoty`);
          }
          else {
            printElementOnce(output1,`Cena waluty to ${currency.mid} złoty`);
          }
        }
      }
  })
  .catch(error => console.error(error));
}





function printElement(doc,el){
  doc.innerHTML += el;
}

function printElementOnce(doc,el){
  doc.innerHTML = el;
}







// var currency = document.getElementById('output2');
// currency.addEventListener('click', runEvent);
//
// function runEvent(e){
//   console.log(e.target);
// }

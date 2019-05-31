document.getElementById('searchCurrencyButton').addEventListener('click',saveCurrency);
document.getElementById('calculateButton').addEventListener('click',calculateCurrency);
document.getElementById('date_button').addEventListener('click',showGoldValueDate);
// document.getElementById('removeLocal').addEventListener('click',removeLocalStorage);



const section_one = document.getElementById('section_one');
const search_section = document.getElementById('searchSection');
const calculate_section = document.getElementById('calculate_section');
const navigation = document.getElementById('nav_list');
const section = document.getElementsByClassName('section');
const modal = document.querySelector(".modal");

showCodes();
fetchCurrency();
showGoldValue();


navigation.addEventListener('click',(e)=>{

  let parentElem = e.target.parentElement.parentElement.children;
  let targetElem = e.target;

  for (var i = 0; i < parentElem.length; i++) {
    if (targetElem!=parentElem[i].firstChild) {
      parentElem[i].firstChild.style.fontSize = '18px';
    }
    else {
      targetElem.style.fontSize = '25px';
      let visible = targetElem.id;
          for (let i = 0; i < section.length; i++) {

            if (visible==='s1') {
              if (i!=0) {
                section[i].style.display = 'none';
              }
              else {
                section[i].style.display = 'block';
              }
            }

            if (visible==='s2') {
              if (i!=1) {
                section[i].style.display = 'none';
              }
              else {
                section[i].style.display = 'block';
              }
            }

            if (visible==='s3') {
              if (i!=2) {
                section[i].style.display = 'none';
              }
              else {
                section[i].style.display = 'block';
              }
            }

            if (visible==='s4') {
              if (i!=3) {
                section[i].style.display = 'none';
              }
              else {
                section[i].style.display = 'block';
              }
            }
          }
    }
  }
});



function showGoldValue(){
  const goldOutput = document.getElementById('gold_output');
  fetch('http://api.nbp.pl/api/cenyzlota')
  .then(response => response.json())
  .then(data => {
    printElementOnce(goldOutput, `${data[0].cena} zł`);
  })
  .catch(error => console.error(error))
}

function showGoldValueDate(){
  const goldOutput1 = document.getElementById('gold_output1');
  const date = document.getElementById('date').value;
  const api = `http://api.nbp.pl/api/cenyzlota/${date}/`
  console.log(date);
  fetch(api)
  .then(response => response.json())
  .then(data => {
    const output = `<h2>Cena złota w dniu ${data[0].data} wynosiła ${data[0].cena} zł</h2>`;
    printElementOnce(goldOutput1, output);
  })
  .catch(error => console.error(error))
}

function removeLocalStorage(){
  localStorage.removeItem('currency');
}

function saveCurrency(){

  let currencyCode = document.getElementById('outputCodes').value.toUpperCase();
  if (currencyCode!='') {
  fetch('http://api.nbp.pl/api/exchangerates/tables/A/')
  .then(response => response.json())
  .then(data => {
    currencyValue1 = getCurrencyValue(data,currencyCode,'A');
    if (typeof currencyValue1.name != 'undefined') {
      if (localStorage.getItem('currency')===null) {
        let currencyArr = [];
        currencyArr.push(currencyValue1);
        localStorage.setItem('currency',JSON.stringify(currencyArr));
        fetchCurrency();
      }
      else {
        let currencyArr = [];
        let currencyArrCode = [];
        currencyArr = JSON.parse(localStorage.getItem('currency'));
        for (let i = 0; i < currencyArr.length; i++) {
          currencyArrCode [i] = currencyArr[i].code;
        }
        let validate = currencyArrCode.includes(currencyCode);
        if (validate!=true&&currencyArrCode.length<10) {
          currencyArr.push(currencyValue1);
          localStorage.setItem('currency',JSON.stringify(currencyArr));
          fetchCurrency();
        }
        if (validate==true) {
          alert('Waluta już dodana');
        }
        if (currencyArr.length>=10) {
          alert('Zbyt dużo dodanych walut');
        }
      }
      fetchCurrency();
    }
    return fetch('http://api.nbp.pl/api/exchangerates/tables/B/');
  })
  .then(response => response.json())
  .then(data => {

    if (typeof currencyValue1.name==='undefined') {
      currencyValue1 = getCurrencyValue(data,currencyCode,'B');
      if (typeof currencyValue1.name != 'undefined') {
      if (localStorage.getItem('currency')===null) {
        let currencyArr = [];
        currencyArr.push(currencyValue1);
        localStorage.setItem('currency',JSON.stringify(currencyArr));
        fetchCurrency();
      }
      else {
        let currencyArrCode = [];
        let currencyArr = JSON.parse(localStorage.getItem('currency'));
        for (let i = 0; i < currencyArr.length; i++) {
          currencyArrCode [i] = currencyArr[i].code;
        }
        let validate = currencyArrCode.includes(currencyCode);
        if (validate!=true&&currencyArrCode.length<10) {
          currencyArr.push(currencyValue1);
          localStorage.setItem('currency',JSON.stringify(currencyArr));
          fetchCurrency();
          printElementOnce(doc,el);
        }
        if (validate==true) {
          alert('Waluta już dodana');
        }
        if (currencyArr.length>=10) {
          alert('Zbyt dużo dodanych walut');
        }
        fetchCurrency();
      }
    }
    }

})
  .catch(error => console.error(error))
  }
}

function getCurrencyValue(data,currencyCode,tableType){
  let currency1={};

  if (currencyCode==='PLN') {
    currency1.name = "polski złoty";
    currency1.value = 1;
    currency1.code = 'PLN';
  }
  else {
    if (tableType==='A') {
      for (let i = 0; i < data[0].rates.length; i++) {
        let currency = data[0].rates[i];
        if (currencyCode===currency.code) {
            currency1.name = currency.currency;
            currency1.value = currency.mid;
            currency1.code = currency.code;
        }
      }
    }
    if (tableType==='B') {
      for (let i = 0; i < data[0].rates.length; i++) {
        let currency = data[0].rates[i];
        if (currencyCode===currency.code) {
            currency1.name = currency.currency;
            currency1.value = currency.mid;
            currency1.code = currency.code;
        }
      }
    }

  }
  return currency1;
}

// function that fetch data from local storage and print on the web page
function fetchCurrency(){
  let currencyArr = JSON.parse(localStorage.getItem('currency'));
  const output = document.getElementById('section_one_output');

  if (currencyArr===null){
    currencyArr = [];
  }
  if (currencyArr.length===0) {
    output.innerHTML = `<h1> Zapisz swoje ulubione waluty w sekcji <br> <b>dodaj walutę.</b></h1>`
  }

  else {
    output.innerHTML = '';
    for (let i = 0; i < currencyArr.length; i++) {
      output.innerHTML +=        `<div class="outputFetch">${(i+1)}.  ${currencyArr[i].name} (${currencyArr[i].code} ) ${currencyArr[i].value} zł </div>`
                                +'<div><button type="button" class="small" id="removeLocal" onclick="deleteCurrency(\''+currencyArr[i].name+'\')">Usuń</button></div>'
                                ;
                              }
  }
}

function deleteCurrency(name){
  let currencyArr = JSON.parse(localStorage.getItem('currency'));
  for(let i = 0; i < currencyArr.length; i++){
    if(currencyArr[i].name === name){
      currencyArr.splice(i, 1);
    }
  }
  localStorage.setItem('currency',JSON.stringify(currencyArr));
  fetchCurrency();
}


function calculateCurrency(){
  const currency1 = document.getElementById('currency1').value.toUpperCase();
  const currency2 = document.getElementById('currency2').value.toUpperCase();
  const currencyInput = Number(document.getElementById('currency1value').value);
  const outputCalculatedValue = document.getElementById('outputCalculatedValue');

  let currencyValue1;
  let currencyValue2;
  let error;
  let calculated;

  if (currency1===''|| currency2==='') {
    alert("Wprowadź wartość");
  }
  else {
  fetch('http://api.nbp.pl/api/exchangerates/tables/A/')
  .then(response => response.json())
  .then(data => {
    currencyValue1 =  getCurrencyValue(data,currency1,'A');
    currencyValue2 =  getCurrencyValue(data,currency2,'A');
    return fetch('http://api.nbp.pl/api/exchangerates/tables/B/')
  })
    .then(response => response.json())
    .then(data => {
      if (typeof currencyValue1.name==='undefined') {
        currencyValue1 =  getCurrencyValue(data,currency1,'A');
      }
      if (typeof currencyValue2.name==='undefined') {
        currencyValue2 =  getCurrencyValue(data,currency2,'A');
      }
      let temp1 = currencyInput * Number(currencyValue1.value);
      calculated = temp1/Number(currencyValue2.value);
      calculated = calculated.toFixed(3);
      let outputCalculated = ` ${currencyInput} ${currencyValue1.code} ${currencyValue1.name} jest warty ${calculated} ${currencyValue2.code} ${currencyValue2.name} <br> według NBP (Narodowy Bank Polski).`;
      printElementOnce(outputCalculatedValue,outputCalculated);
    })
    .then(data => {
      if (typeof currencyValue1.name==='undefined') {
        error = "Nie można znaleźć pierwszej waluty";
        printElementOnce(outputCalculatedValue,error);
      }
      if (typeof currencyValue2.name==='undefined') {
        error = "Nie można znaleźć drugiej waluty";
        printElementOnce(outputCalculatedValue,error);
      }
    })
  .catch(error => console.error(error));
  }
}
// function that gets value from data. First parameter is data from fetch api, second currency code or name


function showCodes(){
  const outputCodes = document.getElementById('outputCodes');
  const outputCodes1 = document.getElementById('currency1');
  const outputCodes2 = document.getElementById('currency2');
  let output = "";
  let currencyArr = [];
  currencyArr = JSON.parse(localStorage.getItem('currency'));
  if (currencyArr===null) {
    currencyArr = [];
  }

  fetch('http://api.nbp.pl/api/exchangerates/tables/A/')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < currencyArr.length; i++) {
        data[0].rates.map((currency)=>{
        if (currencyArr[i].code===currency.code) {
          currencyArr[i].value = currency.mid;
        }
      })
    }
    data[0].rates.map((currency)=>{
      output += `<option value = ${currency.code}> ${currency.currency} </option>`;
    })
    printElement(outputCodes,output);
    printElement(outputCodes1,output);
    printElement(outputCodes2,output);
    return fetch('http://api.nbp.pl/api/exchangerates/tables/B/')
  })
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < currencyArr.length; i++) {
          data[0].rates.map((currency)=>{
          if (currencyArr[i].code===currency.code) {
            currencyArr[i].value = currency.mid;
          }
        })
      }
      data[0].rates.map((currency)=>{
        output += `<option value = ${currency.code}> ${currency.currency} </option>`;
    });
      localStorage.setItem('currency',JSON.stringify(currencyArr));
      printElement(outputCodes,output);
      printElement(outputCodes1,output);
      printElement(outputCodes2,output);
    })
    .then(data =>{
      output ="";
      }
    )
    .catch(error => console.error(error));
}

// function that takes as a first parameter element on webpage and second parameter is element for printing
function printElement(doc,el){
  doc.innerHTML += el;
}
// function that takes as a first parameter element on webpage and second parameter is element for printing. Print only once
function printElementOnce(doc,el){
  doc.innerHTML = el;
}

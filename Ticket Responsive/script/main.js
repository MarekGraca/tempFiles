var ticketsArray=[];

document.getElementById('confirmWorker').addEventListener('click', saveWorker);

// save workers to local storage
function saveWorker(){
  var worker = document.getElementById('workerNameInp').value;
  if (worker=="") {
    alert("Empty field");
  }
  else {
  if (localStorage.getItem('workers')===null) {
    var workersArr = [];
    workersArr.push(worker);
    localStorage.setItem('workers',JSON.stringify(workersArr));
  }
  else {
    var workers = JSON.parse(localStorage.getItem('workers'));
    workers.push(worker);
    localStorage.setItem('workers',JSON.stringify(workers));
  }
  fetchWorkers();
  }
}
// delete workers from local storage
function deleteWorker(worker){
  var workers = JSON.parse(localStorage.getItem('workers'));
  for (var i = 0; i < workers.length; i++) {
    if(workers[i]==worker){
      workers.splice(i,1);
    }
  }
  localStorage.setItem('workers',JSON.stringify(workers));
  fetchWorkers();
}
//delete specific item in tickets array
function deleteTicket(){
  clearOutput(document.getElementById('outputTicket'));
  var number = document.getElementById('myNumber').value;
  ticketsArray.splice((number-1),1);
  printTickets(ticketsArray, document.getElementById('outputTicket'));
}
// modify ticket in array
function modifyTicket(){
  var number = document.getElementById('myNumber').value;
  if(ticketsArray.length===0||number>ticketsArray.length){
    alert("Error, empty list or no ticket with number.")
  }
  else {
    clearOutput(document.getElementById('outputTicket'));
    var newTicket = prompt("Please enter ticket:","");
    ticketsArray.splice((number-1),1,newTicket);
    printTickets(ticketsArray, document.getElementById('outputTicket'));
  }
}

// delete all tickets
function deleteTickets(){
  ticketsArray.splice(0,ticketsArray.length);
  clearOutput(document.getElementById('outputTicket'));
}

// fetch workers from local storage and display in workers Result
function fetchWorkers(){
  var workers = JSON.parse(localStorage.getItem('workers'));
  var workersResult = document.getElementById('workers_result');
  workersResult.innerHTML = '';
  for (var i = 0; i < workers.length; i++) {
    workersResult.innerHTML +=
                              '<div class="outputObject"><span id="span1"><p> '+(i+1) + '. ' + workers[i]+ '</span>' +
                              '<span id="span2"><button type="button" class="buttons"'+
                              'onclick="deleteWorker(\''+workers[i]+'\')">Delete</button>'+
                              '<input class="inputs" type="number" value="" min="1" placeholder="number of tickets" id="ticketValue"></span></p></div>'
                              ;
                            }
}
// first parameter is array, second objoct in HTMl
function printTickets(a,b){
  for (var i = 0; i < a.length; i++) {
      b.innerHTML += (i+1) + ". " + a[i] + "<br>";
  }
}
// add ticket to array
function addTickets(){
  var ticket = document.getElementById('ticketName').value;
  if(ticket==""){
    alert("Empty field");
  }
  else {
    clearOutput(document.getElementById('outputTicket'));
    ticketsArray.push(ticket);
    console.log(ticketsArray);
    printTickets(ticketsArray, document.getElementById('outputTicket'));
  }
}

// shuffleArray
function shuffleArray(arr) {
  for (var x = arr.length - 1; x > 0; x--) {
      var holder = Math.floor(Math.random() * (x + 1));
      var temp = arr[x];
      arr[x] = arr[holder];
      arr[holder] = temp;
  }
  return arr;
}
// clearOutput
function clearOutput(a){
  a.innerHTML = "";
}

function assignTicketSpecific(){
  var workersArray = JSON.parse(localStorage.getItem('workers'));
  var shuffledTicketsArray = shuffleArray(ticketsArray);
}

// function that assign tickets to workers with equal amount of tickets
function assignTicketToWorkers(){
  var assignedTickets = [];
  var workersArray = JSON.parse(localStorage.getItem('workers'));
  var tempAssign = "";
  var tempTicket= "";
  var tempWorker= "";
  var shuffledTicketsArray = shuffleArray(ticketsArray);
  var numberOfTickets = Number(document.getElementById('allocateNumber').value);
  console.log(numberOfTickets);

  if(workersArray.length==0||ticketsArray.length==0||numberOfTickets==0){
    alert("No tickets or workers");
  }
  else {
    for (var i=0;i<workersArray.length;i++){
        tempWorker = workersArray[i];
        console.log(tempWorker);
    for (var j = 0; j < numberOfTickets; j++) {
        if (typeof shuffledTicketsArray[j]=="undefined") {
        tempTicket = "<br>No ticket";
        }
        else {
        tempTicket += "<br>" + "-" + shuffledTicketsArray[j];
        }
      }
      assignedTickets[i] =  tempWorker + tempTicket;
      shuffledTicketsArray.splice(0,numberOfTickets);
      tempTicket = "";
    }
    document.getElementById('containerAll').style.display = "none";
    printTickets(assignedTickets,document.getElementById('outputAssigment'));
  }
}
// function that assign custom amount of tickets to each worker
function assignTicketToWorkersSpecific(){
  var assignedTickets = [];
  var tempAmountArr = []
  var tempTicket= "";
  var workersArray = JSON.parse(localStorage.getItem('workers'));
  var shuffledTicketsArray = shuffleArray(ticketsArray);
  const outputObject = document.getElementsByClassName('outputObject');
  for (var i = 0; i < outputObject.length; i++) {
    tempAmountArr.push(outputObject[i].firstElementChild.firstChild.firstElementChild.lastElementChild.value);
  }

  for (var i = 0; i < outputObject.length; i++) {
    var tempAmount = tempAmountArr[i];
    var tempWorker = workersArray[i];
    for (var j = 0; j < tempAmount; j++) {
      if (typeof shuffledTicketsArray[j]=="undefined") {
      tempTicket = "<br>No ticket";
      }
      else {
      tempTicket += "<br>" + "-" + shuffledTicketsArray[j];
      }
    }
      assignedTickets[i] =  tempWorker + tempTicket;
      shuffledTicketsArray.splice(0,tempAmount);
      tempTicket = "";
  }
  document.getElementById('containerAll').style.display = "none";
  printTickets(assignedTickets,document.getElementById('outputAssigment'));
}

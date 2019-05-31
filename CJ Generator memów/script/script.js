
let memeImg;
function createMem(){
  console.log(memeImg);
  if (typeof memeImg=='undefined') {
    alert('Wybierz obrazek');
  }
  else {
    let memText = document.getElementById('memText').value;
    document.getElementById('select').style.display = 'none';
    document.getElementById('memeImg').src = memeImg;
    document.getElementById('memeText').innerHTML = memText;
  }

}

function choose(t){
 memeImg = t.src;
}

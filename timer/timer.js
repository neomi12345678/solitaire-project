let sum=0
     



let body=document.querySelector('body');
let cloors=["red","red","green","red"];
let i;
let divs = []; 
let sumi=document.createElement('button'); 

sumi.style.width='100px';
sumi.style.height='100px'; 
  sumi.style.border='2px solid black';
  sumi.innerHTML=''+sum; 

body.appendChild(sumi); 



for( i=0;i<cloors.length;i++)
{
      let dvivon=document.createElement('div'); 
      dvivon.style.background=cloors[i];
      dvivon.style.width='300px';
      dvivon.style.height='300px';
      dvivon.style.margin='20px';
      dvivon.style.border='2px solid black';
      body.style.display='flex';
      body.appendChild(dvivon);   
      dvivon.onclick = clickme;

      divs.push(dvivon)
}
function changeColor(){
  let green;
  let div=document.createElement('div');
  let r=Math.random();
if(r<=0.25)
{
  divs[0].style.background = 'green'
  divs[1].style.background = 'red'
  divs[2].style.background = 'red'
  divs[3].style.background = 'red'

}
else{
    if(r<=0.5)
    {
      divs[1].style.background = 'green'
      divs[0].style.background = 'red'
      divs[2].style.background = 'red'
      divs[3].style.background = 'red'

    }
    else{
       if(r<=0.75)
       {
          divs[2].style.background = 'green'
          divs[1].style.background = 'red'
          divs[0].style.background = 'red'
          divs[3].style.background = 'red'

       }
       else{
          divs[3].style.background = 'green'
          divs[1].style.background = 'red'
          divs[2].style.background = 'red'
          divs[0].style.background = 'red'

       }
        }
   }
}
setInterval(() => {
  for (let j = 0; j < divs.length; j++) {
       changeColor();  

  }
}, 7000);

function clickme(e) {
if (e.target.style.background === 'green') 
{
  sum += 10;
  changeColor();  


} 
else 
{
  sum -= 5;
  changeColor();  

}

sumi.innerHTML = sum; 
clearInterval();
setInterval(() => {
  for (let j = 0; j < divs.length; j++) {
       changeColor();  

  }
}, 7000);
}



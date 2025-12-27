let level2 = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F1C40F", // Yellow
    "#8E44AD", // Purple
    "#E74C3C", // Tomato
    "#3498DB" , // Sky Blue
    "#D35400", // Pumpkin
    "brown", // Alizarin
    "#2980B9", // Bright Blue
    "#16A085"  // Strong Teal
];
let level3 = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F1C40F", // Yellow
    "#8E44AD", // Purple
    "#E74C3C", // Tomato
    "#3498DB",  // Sky Blue
    "#2ECC71", // Emerald
    "#E67E22", // Carrot
    "#1ABC9C", // Turquoise
    "#9B59B6", // Amethyst
    "#34495E", // Midnight Blue
    "#F39C12", // Orange
    "#D35400", // Pumpkin
    "#C0392B", // Alizarin
    "#2980B9", // Bright Blue
    "#16A085"  // Strong Teal
];
/*let level1 = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F1C40F", // Yellow
    "#8E44AD", // Purple
    "brown", // Tomato
    "#3498DB"  // Sky Blue
];

let colorsrandoms = [];
let arrcount = new Array(level1.length).fill(0); 
let divme = document.querySelector('div'); 

for (let i = 0; i < level1.length*2; i++) {
    let btn3 = document.createElement('button');
    let r = Math.floor(Math.random() * level1.length); 
    let color = level1[r];
    
    colorsrandoms.push(color);
    arrcount[r]++;
    
    if (arrcount[r] === 2) {
        level1.splice(r, 1); 
        arrcount.splice(r, 1); 
    }

    btn3.style.backgroundColor = color;
    btn3.style.borderRadius = '1%';
    btn3.style.height = '100px';
    btn3.style.width = '100px';
    btn3.style.margin = '12px';
    
    divme.appendChild(btn3); 
}*/

let level1 = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F1C40F", // Yellow
    "#8E44AD", // Purple
    "brown", // Tomato
    "#3498DB"  // Sky Blue
];
let count=0;
let zeto=[];

let colorsrandoms = [];
let divme = document.querySelector('div'); 
let colorsCopy = [...level1];

for (let i = 0; i < level1.length * 2; i++) {
    let btn3 = document.createElement('button');
    let r = Math.floor(Math.random() * colorsCopy.length); 
    let color = colorsCopy[r];

    colorsrandoms.push(color);
    
    if (colorsrandoms.filter(c => c === color).length === 2) {
        colorsCopy.splice(r, 1);
    }
    btn3.style.backgroundColor = 'black';
    btn3.colorShowing = false;
    /*btn3.style.backgroundColor = color;*/
    btn3.style.borderRadius = '1%';
    btn3.style.height = '100px';
    btn3.style.width = '100px';
    btn3.style.margin = '12px';
    
    divme.appendChild(btn3); 
    btn3.onclick = function() {
        if (!this.colorShowing) {
            getColor(this, colorsrandoms.indexOf(color));
            if (count === 2) {
                setTimeout(black, 500); 
            }
        }
    };
}

function getColor(btn3,index)
{
    btn3.style.backgroundColor = colorsrandoms[index];
    btn3.colorShowing = true; 
    if(count!=2)
    zeto.push(btn3);
    count++;

}

function black(){ 
if(zeto[0].style.backgroundColor===zeto[1].style.backgroundColor)
{
     zeto[0].remove();
     zeto[1].remove();
     count=0;
    zeto = []; 
    if(colorsrandoms.length===0)
    {
    let divsuccs = document.createElement('div'); 
    divsuccs.style.height = '100px';
    divsuccs.style.width = '100px';
    divsuccs.innerHTML = "yes!!!";
    divme.appendChild(divsuccs); 

    }

}
else{
for(let i=0;i<2;i++)
{
   
    zeto[i].style.backgroundColor='black';
    zeto[i].colorShowing = false;
    
}
    count=0;
    zeto = [];

}
}


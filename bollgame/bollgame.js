let colors=['red','green','pink','blue','yellow','orange','purple','brown'];
let colorsrandoms=[];
for(let i=0;i<4;i++)
{
    let r=Math.floor(Math.random()*colors.length);
    let color=colors[r];
    colorsrandoms.push(color);
    colors.splice(r, 1);
        let a = document.querySelector('.a');
        let span = document.createElement('span');
        span.textContent = color + ' ';
        //a.appendChild(span);
    
}
let dvivionbtn=document.querySelector('.colorbtn')
colors=['red','green','pink','blue','yellow','orange','purple','brown'];
for(let i=0;i<8;i++)
{
    let btn=document.createElement('button');
    btn.style.backgroundColor=colors[i];
    btn.style.borderRadius='50%';
    btn.style.height='50px'
    btn.style.width='50px'
    btn.style.margin='10px'
    dvivionbtn.appendChild(btn);
    btn.onclick = function() {
        getColor(this);
    };
}
let arrcurrnt=[];
let divchosen;
let results;
function getColor(btn)
{
    let basic; 
    basic=document.querySelector('.basic')
    if (!divchosen) { 
        divchosen = document.createElement('div');
        divchosen.style.display = 'flex';
        divchosen.style.gap = '5px'; 
        basic.appendChild(divchosen);
    }
    let btn2=document.createElement('button');
    btn2.style.backgroundColor=btn.style.backgroundColor;
    btn2.style.borderRadius='50%';
    btn2.style.height='50px'
    btn2.style.width='50px'
    btn2.style.margin='10px'
    divchosen.appendChild(btn2);
    arrcurrnt.push(btn.style.backgroundColor);
    btn.disabled = true;

    if(arrcurrnt.length===4)
    {
        let count=0;
        results= document.createElement('div');
        results.style.display = 'flex';
        basic.appendChild(results);
        for(let i=0;i<4;i++)
        {
            for(let j=0;j<4;j++)
            {
                if(colorsrandoms[j]===arrcurrnt[i])
                {
                    let btn3=document.createElement('button');
                    btn3.style.backgroundColor=colors[i];
                    btn3.style.borderRadius='50%';
                    btn3.style.height='20px'
                    btn3.style.width='20px'
                    btn3.style.margin='1px'
                    if(i===j)
                    {
                        btn3.style.backgroundColor='white';
                        btn3.style.border='1px black solid';
                        count++;
                    }
                    else{
                        btn3.style.backgroundColor='black';

                    }
                    results.appendChild(btn3);
                }
            }
        }
        if(count===4)
        {
            let title = document.querySelector('.succsees');
            title.style.display = 'block';

        }
        arrcurrnt=[];
        divchosen = null;
        let buttons = document.querySelectorAll('button'); 
        buttons.forEach(btn => {
        btn.disabled = false;
    });

    }
}

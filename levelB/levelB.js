document.addEventListener("DOMContentLoaded", function () {
    const suits = ["♥", "♦", "♠", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];
    let columns = [[], [], [], [], [], [], [], [], []]; // 9 עמודות
    let series = [[], [], [], [], [], [], [], []]; // 8 סדרות
    let countSries = [0, 0, 0, 0]; // 8 סדרות
    let countSries2 = [0, 0, 0, 0]; // 8 סדרות
    const moveSound = new Audio("/sound/button-16a.wav"); // צליל להעברת קלפים בין העמודות
    const seriesSound = new Audio("/sound/button-2.wav"); // צליל להעברת קלפים לערימות הסדרות
    const flipSound = new Audio("/sound/button-16a.wav"); // צליל להפיכת קלף בחפיסה או פסולת
    

    let gameOver = false;
    let score = 0;
    let startTime = Date.now();
    let timerInterval;
    let fromIndex = 0;
    let locationj = 0;
    class Card {
        constructor(value, suit) {
            this.value = value;
            this.suit = suit;
            this.color = this.getColor();
            this.status = "back";
        }

        getColor() {
            return (this.suit === "♥" || this.suit === "♦") ? "red" : "black";
        }

        toggleStatus() {
            this.status = (this.status === "back") ? "front" : "back";
        }

        getImageUrl() {
            return this.status === "front" ? `/image/${this.value}_${this.suit}.png` : "/image/backcard.png";

        }
    }

    function updateTimer() {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor((elapsedTime / 1000) % 60);
        let minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        document.getElementById('timer').innerText = `זמן המשחק: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    startTimer();

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push(new Card(value, suit));
            }
        }
        for (let suit of suits) {
            for (let value of values) {
                deck.push(new Card(value, suit));
            }
        }
        deck.sort(() => Math.random() - 0.5);
    }

    createDeck();

    function getCardValue(card) {
        if (card.value === "A") {
            return 1;
        } else if (card.value === "J") {
            return 11;
        } else if (card.value === "Q") {
            return 12;
        } else if (card.value === "K") {
            return 13;
        } else {
            return parseInt(card.value, 10);
        }
    }

    function insertToStageB(card, button) {
        let cardValue = getCardValue(card);
        let flag = false;
        let suitIndex = suits.indexOf(card.suit);
    
        // בדיקה אם כבר קיימת סדרה מלאה באותו suit
        let count=1;
    
        if (cardValue === 1)
         {
            if(series[suitIndex].length === 0)
            {
            countSries[suitIndex]++;
            flag = true;
            }
            else{
            if(series[suitIndex+4].length === 0)
            {
            countSries2[suitIndex]++;
            flag = true;
            count=2;
           }}
        }
         else 
         {
            if (series[suitIndex].length > 0)
             {
                let previousCardValue = getCardValue(series[suitIndex][countSries[suitIndex] - 1]);
    
                if (previousCardValue === cardValue - 1) {
                    countSries[suitIndex]++;
                    flag = true;
                }
            else
            {
            if (series[suitIndex+4].length > 0) 
            {
                let previousCardValue = getCardValue(series[suitIndex+4][countSries2[suitIndex] - 1]);
    
                if (previousCardValue === cardValue - 1)
                 {
                    countSries2[suitIndex]++;
                    flag = true;
                    count=2;

                }
            }
           }
        }
    }
    
        if (flag) {
            let columnIndex = columns.findIndex(column => column.includes(card));
            if (columnIndex !== -1) {
                let column = document.querySelector(`.column[data-index="${columnIndex}"]`);

                let cardIndex = columns[columnIndex].findIndex(c => c === card);
    
                if (cardIndex !== -1) {
                    columns[columnIndex].splice(cardIndex, 1);
                    updateColumnDisplay(columnIndex);
                }
            }
            
          if(count!==2)
           {
            let divSuit = document.getElementById((suitIndex + 1).toString());
            divSuit.appendChild(button);
            removeCardFromWastePile2(card);
            series[suitIndex].push(card);
           }
           else{
            let divSuit = document.getElementById((suitIndex + 5).toString());
            divSuit.appendChild(button);
            removeCardFromWastePile2(card);

                 series[suitIndex+4].push(card);

           }

            button.draggable = false;
            score++;
            updateScore();
            seriesSound.play();

        
        }
    }

    const gameBoard = document.querySelector("#game-board");
    for (let i = 0; i < 9; i++) {  // 9 עמודות
        let column = document.createElement("div");
        column.classList.add("column");
        column.dataset.index = i;
        gameBoard.appendChild(column);

        for (let j = 0; j <= i; j++) {
            let card = deck.pop();
            if (j === i) card.toggleStatus();
            columns[i].push(card);
        }
        updateColumnDisplay(i);
    }

    let wastePile = [];
    const deckElement = document.querySelector("#deckmain");
    const wastePileElement = document.querySelector("#waste-pile");

    function renderDeck() {
        deckElement.innerHTML = "";
        let reversebtn = document.createElement("button");
        reversebtn.classList.add("card");
        reversebtn.innerText = `🔄`;
        reversebtn.onclick = function() {
            reverse();
        };
        deckElement.appendChild(reversebtn);

        for (let i = 0; i < deck.length; i++) {
            let card = deck[i];
            let button = document.createElement("button");
            button.classList.add("card");
            let img = document.createElement("img");
            img.style.height = "130px";  
            img.style.width = "90px"; 
            img.src = card.getImageUrl();
            img.alt = `${card.value} ${card.suit}`;

            button.appendChild(img);
            button.onclick = function() {
                goToPile(card);
                flipSound.play();

            };
            deckElement.appendChild(button);
        }
    }

    function goToPile(card) {
        card.toggleStatus();
        let button = document.createElement("button");
        button.classList.add("card");

        let img = document.createElement("img");
        img.style.height = "130px";  
        img.style.width = "90px";  
        img.src = card.getImageUrl();
        img.alt = `${card.value} ${card.suit}`;

        button.appendChild(img);
        button.onclick = function() {
            insertToStageB(card, button);

        };

        wastePile.push(card);
        deck.splice(deck.indexOf(card), 1);

        wastePileElement.appendChild(button);
        button.draggable = true;
        button.addEventListener("dragstart", function (event) {
            draggedCard = card;
            event.dataTransfer.setData("text/plain", "");
            moveSound.play();

        });

        renderDeck();
    }

    function reverse() {
        while (wastePile.length > 0) {
            let cardpile = wastePile.pop();
            cardpile.toggleStatus();
            deck.push(cardpile);
        }
        wastePileElement.innerHTML = "";
        renderDeck();
    }

    renderDeck();
    let draggedCard = null;

    document.querySelectorAll(".column").forEach(column => {
        column.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        column.addEventListener("drop", function (event) {
            event.preventDefault();
            if (draggedCard) {
                let toIndex = parseInt(column.dataset.index);
                if (wastePile.includes(draggedCard)) {
                    let movingCard = draggedCard;
                    if (columns[toIndex].length === 0 && movingCard.value === "K") { 
                        removeCardFromWastePile2(draggedCard);
                        columns[toIndex].push(movingCard);
                    } else if (columns[toIndex].length > 0) {
                        let targetCard = columns[toIndex][columns[toIndex].length - 1];
                        if (isValidMove(movingCard, targetCard)) {
                            removeCardFromWastePile2(draggedCard);
                            columns[toIndex].push(movingCard);
                        }
                    }
                    updateColumnDisplay(toIndex);
                } else {
                    let movingCard = draggedCard;
                    let fromIndex = 0;
                    let locationj = 0;

                    for (let i = 0; i < 9; i++) {  // 9 עמודות
                        for (let j = 0; j < columns[i].length; j++) {
                            if (columns[i][j].value === draggedCard.value && columns[i][j].suit === draggedCard.suit&&columns[i][j].status==="front"&&columns[i][j]===draggedCard) {
                                fromIndex = i;
                                locationj = j;
                                
                            }
                        }
                    }

                    if (fromIndex !== toIndex) {
                        if (columns[toIndex].length === 0) {
                            if (movingCard.value === "K") {
                                for (let m = locationj; m < columns[fromIndex].length; m++) {
                                    columns[toIndex].push(columns[fromIndex][m]);
                                }
                                columns[fromIndex] = columns[fromIndex].slice(0, locationj);
                                updateColumnDisplay(fromIndex);
                                updateColumnDisplay(toIndex);
                            }
                        } else {
                            let targetCard = columns[toIndex][columns[toIndex].length - 1];
                            if (isValidMove(movingCard, targetCard)) {
                                for (let m = locationj; m < columns[fromIndex].length; m++) {
                                    columns[toIndex].push(columns[fromIndex][m]);
                                }
                                columns[fromIndex] = columns[fromIndex].slice(0, locationj);

                                updateColumnDisplay(fromIndex);
                                updateColumnDisplay(toIndex);
                            }
                        }
                    }
                }
                draggedCard = null;
            }
        });

        function isValidMove(movingCard, targetCard) {
            const valueOrder = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
            let movingValueIndex = valueOrder.indexOf(movingCard.value);
            let targetValueIndex = valueOrder.indexOf(targetCard.value);

            return movingValueIndex === targetValueIndex - 1 && movingCard.getColor() !== targetCard.getColor();
        }
    });

    function removeCardFromWastePile(card) {
        wastePile.splice(wastePile.indexOf(card), 1);
        let index = wastePile.indexOf(card);

        let buttons = wastePileElement.querySelectorAll("button");
        buttons.forEach(button => {
            let img = button.querySelector("img");
            if (img && img.alt === `${card.value} ${card.suit}`) {
                button.remove();
            }
        });
    }
    function removeCardFromWastePile2(card) {
        let index = wastePile.indexOf(card);
        if (index === -1) return; // אם הקלף לא קיים, לא נמשיך
    
        wastePile.splice(index, 1); // מוחק את הקלף מהמערך
    
        let buttons = wastePileElement.querySelectorAll("button"); // לוקח את כל הכפתורים
        if (buttons[index]) { // בודק אם הכפתור המתאים קיים
            buttons[index].remove(); // מוחק את הכפתור המתאים
        }
    }
    
    function updateColumnDisplay(index) {
        const column = document.querySelector(`.column[data-index="${index}"]`);
        column.innerHTML = '';

        columns[index].forEach((card, i) => {
            let cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.style.top = `${i * 30}px`;

            let button = document.createElement("button");
            button.dataset.columnIndex = index;
            button.classList.add("card");

            let img = document.createElement("img");
            img.src = card.getImageUrl();
            img.alt = `${card.value} ${card.suit}`;

            button.appendChild(img);

            if (i === columns[index].length - 1) {
                button.draggable = true;
                button.addEventListener("dragstart", function (event) {
                    draggedCard = card;
                    event.dataTransfer.setData("text/plain", "");
                    moveSound.play();

                });
                button.onclick = function() {
                    insertToStageB(card, button);
                };
            } else {
                if (card.status === "front") {
                    button.draggable = true;
                    button.addEventListener("dragstart", function (event) {
                        draggedCard = card;
                        event.dataTransfer.setData("text/plain", "");
                        moveSound.play();

                    });
                }
            }
            cardElement.appendChild(button);
            column.appendChild(cardElement);
        });

        if (columns[index].length > 0) {
            let lastCard = columns[index][columns[index].length - 1];
            if (lastCard.status === "back") {
                lastCard.toggleStatus();
                updateColumnDisplay(index);
            }
        }
    }

    function updateScore() {
        document.getElementById('score').textContent = `ניקוד: ${score}`;
        if (score === 104) {
            clearInterval(timerInterval);
            showWinModal();
        }
    }

    

    function showWinModal() {
        let modal = document.createElement("div");
        modal.id = "winModal";
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.background = "rgba(255, 255, 255, 0.9)";
        modal.style.padding = "20px";
        modal.style.border = "2px solid black";
        modal.style.borderRadius = "10px";
        modal.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
        modal.style.fontSize = "20px";
        modal.style.fontWeight = "bold";

        modal.innerText = "מזל טוב! ניצחת!";
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.remove();
        }, 3000);
    }

});
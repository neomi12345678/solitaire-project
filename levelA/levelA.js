document.addEventListener("DOMContentLoaded", function () {
    const suits = ["♥", "♦", "♠", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];
    let columns = [[], [], [], [], [], [], []];
    let series = [[], [], [], []];
    let countSries = [0, 0, 0, 0];
    const moveSound = new Audio("/sound/button-16a.wav"); // צליל להעברת קלפים בין העמודות
    const seriesSound = new Audio("/sound/button-2.wav"); // צליל להעברת קלפים לערימות הסדרות
    const flipSound = new Audio("/sound/button-16a.wav"); // צליל להפיכת קלף בחפיסה או פסולת
    

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
    // משתנים לשמירת זמן ההתחלה
let startTime = Date.now();
let timerInterval;

// פונקציה לעדכון הזמן
function updateTimer() {
    // חישוב הזמן שעבר מאז תחילת המשחק
    let elapsedTime = Date.now() - startTime;
    
    // המרת הזמן לשניות ודקות
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    
    // הצגת הזמן ב-HTML
    document.getElementById('timer').innerText = `game time : ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// הפעלת עדכון הזמן כל שנייה
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// התחלת המשחק
startTimer();


    function createDeck() {//יצירת חפיסת קלפים
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push(new Card(value, suit));
            }
        }
        deck.sort(() => Math.random() - 0.5);
    }

    createDeck();
    const gameBoard = document.querySelector("#game-board");
    for (let i = 0; i < 7; i++) {//יצירת עומודות  י
        let column = document.createElement("div");
        column.classList.add("column");
        column.dataset.index = i;
        gameBoard.appendChild(column);
        for (let j = 0; j <= i; j++) {
            let card = deck.pop();
            if (j === i) card.toggleStatus();
            columns[i].push(card);
        }
        updateColumnDisplay(i);//עדכון העמודה
    }

    function updateColumnDisplay(index) {// עדכון עמודה ספיצפית אחרי כל שינוי
        const column = document.querySelector(`.column[data-index="${index}"]`);
        column.innerHTML = '';

        columns[index].forEach((card, i) => {
            let cardElement = document.createElement("div");//יוצר div לכל כרטיס
            cardElement.classList.add("card");
            cardElement.style.top = `${i * 30}px`;
            
            let button = document.createElement("button");
            button.dataset.columnIndex = index;
            let img = document.createElement("img");
            img.src = card.getImageUrl();
            img.alt = `${card.value} ${card.suit}`;
            
            button.appendChild(img);

             button.onclick = function() {//בלחיצת הכרטיס מכניס לסריה אם עומד בתנאים
                insertToseries(card,button);
            };
            if (i === columns[index].length - 1)//שיהיה ניתן לגרור  את הכרטיס האחרון
            {
            button.draggable = true;
            button.addEventListener("dragstart", function (event) {
                draggedCard = card;
                event.dataTransfer.setData("text/plain", "");
                moveSound.play();
            });
           
            }
           
            else//גרירה של סדרה
            {
                if(card.status==="front")
                {
                    button.draggable = true;//מאפשר גרירה
                    button.addEventListener("dragstart", function (event) {
                     draggedCard = card;
                  event.dataTransfer.setData("text/plain", "");
                  moveSound.play();

                 });
                }
            }
            cardElement.appendChild(button);// מוסיפים לדיב כפתור 
            column.appendChild(cardElement);//מוסיף לעמודב דיב
        });

        if (columns[index].length > 0) {//בדיקה האם נשארו כרטיסים אם כן פותח את האחרון
            let lastCard = columns[index][columns[index].length - 1];
            if (lastCard.status === "back") {
                lastCard.toggleStatus();
                updateColumnDisplay(index);//הופך את הקלף העדכון מסתדר בגלל שבתוך איף
            }
        }
    }
    let draggedCard = null;

    document.querySelectorAll(".column").forEach(column => {//גרירה
        column.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        column.addEventListener("drop", function (event) {//השמטת הכרטיס בעמודה ובדיקת לוגיות
            event.preventDefault();
            if (draggedCard) {
                let toIndex = parseInt(column.dataset.index);

                if (wastePile.includes(draggedCard)) {
                    let movingCard = draggedCard;
                    if (columns[toIndex].length === 0 && movingCard.value === "K") {//אם מלך עמודה ריקה
                        columns[toIndex].push(movingCard);
                        removeCardFromWastePile(movingCard);
                    } else if (columns[toIndex].length > 0) {
                        let targetCard = columns[toIndex][columns[toIndex].length - 1];
                        if (isValidMove(movingCard, targetCard)) {//בדיקת תקינות האם אפשר לעבור
                            columns[toIndex].push(movingCard);
                            removeCardFromWastePile(movingCard);
                        }
                    }
                    updateColumnDisplay(toIndex);//מעדכן את העמודה אחרי הוספת הקלף
                } else {//אם הקלף יבוא מהעמודות
                    let movingCard = draggedCard;
                    let fromIndex = 0;
                    let locationj = 0;

                    for (let i = 0; i < 7; i++) {//מזהה מיקום קודם של הקלף
                        for (let j = 0; j < columns[i].length; j++) {
                            if (columns[i][j].value === draggedCard.value && columns[i][j].suit === draggedCard.suit) {
                                fromIndex = i;
                                locationj = j;
                            }
                        }
                    }

                    if (fromIndex !== toIndex) {
                        if (columns[toIndex].length === 0) {
                            if (movingCard.value === "K") {
                                for (let m = locationj; m < columns[fromIndex].length; m++) {//העברה של קבוצת קלפים
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

        function isValidMove(movingCard, targetCard) {//בדיקת אם עומד בתנאי הגרירה
            const valueOrder = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
            let movingValueIndex = valueOrder.indexOf(movingCard.value);
            let targetValueIndex = valueOrder.indexOf(targetCard.value);

            return movingValueIndex === targetValueIndex - 1 && movingCard.getColor() !== targetCard.getColor();
        }
    });

    function removeCardFromWastePile(card) {//מעיף מערימת הקלפים הפתוחה
        wastePile.splice(wastePile.indexOf(card), 1);
        let buttons = wastePileElement.querySelectorAll("button");
        buttons.forEach(button => {
            let img = button.querySelector("img");
            if (img && img.alt === `${card.value} ${card.suit}`) {
                button.remove();
            }
        });
    }

   
    function getCardValue(card) {//המרה לint
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

    function insertToseries(card, button) {
        let cardValue = getCardValue(card);
        let flag = false;
        let mikumsuit = suits.indexOf(card.suit);

        if (cardValue === 1) {//as
            countSries[mikumsuit]++;
            flag = true;
        } else {
            if (series[mikumsuit].length > 0) {
                let precardValue = getCardValue(series[mikumsuit][countSries[mikumsuit] - 1]);//הערך המספרי

                if (precardValue === cardValue - 1) {
                    countSries[mikumsuit]++;
                    flag = true;
                }
            }
        }

        if (flag) {

            let columnIndex = columns.findIndex(column => column.includes(card));

            if (columnIndex !== -1) {//מוחק את הכרטיס מהעמודה
                let column = document.querySelector(`.column[data-index="${columnIndex}"]`);
                let cardIndex = columns[columnIndex].findIndex(c => c === card);

                if (cardIndex !== -1) {
                    columns[columnIndex].splice(cardIndex, 1);
                    updateColumnDisplay(columnIndex);

                }
            }
            if (wastePile.includes(card)) {//מוחק את  הכטיס מהאשפה
                button.remove();
                removeCardFromWastePile(card);
            }
            //מכניס לסריות

            let divsuit = document.getElementById((mikumsuit + 1).toString());//מקבל דיב של סריה
            button.classList.add("card");

            divsuit.appendChild(button);
            series[mikumsuit].push(card);
            button.draggable = false;

            score++; // נוסיף נקודה כשקלף מועבר לסריה
            updateScore(); // עדכון התצוגה של הניקוד
            seriesSound.play();
    
        }
    }
    let score = 0; // משתנה הניקוד

    // פונקציה לעדכון הניקוד
    function updateScore() {
        document.getElementById('score').textContent = `ניקוד: ${score}`;
        if (score === 52) {
            clearInterval(timerInterval);
            showWinModal();
        }
    }
    
  
//יצירת החפיסה הנפתחת
    let wastePile = [];
    const deckElement = document.querySelector("#deckmain");
    const wastePileElement = document.querySelector("#waste-pile");

    function renderDeck() {//פותח
        deckElement.innerHTML = "";
        let reversebtn = document.createElement("button");//כפתור ההתחלפות
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
                gotopile(card);
                flipSound.play();
            };
            
            deckElement.appendChild(button);
        }
    }

    function gotopile(card) {
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
            insertToseries(card,button);

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
    
 
    
   
function showWinModal() {
    // יצירת אלמנטים לחלון הניצחון
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
    modal.style.textAlign = "center";
    modal.style.zIndex = "1000";

    let message = document.createElement("p");
    message.innerHTML = `great!<br> you win! <br> ${document.getElementById('timer').textContent}`;

    let restartButton = document.createElement("button");
    restartButton.textContent = "משחק חדש";
    restartButton.style.marginTop = "10px";
    restartButton.style.padding = "10px";
    restartButton.style.fontSize = "16px";
    restartButton.style.cursor = "pointer";
    restartButton.style.borderRadius = "5px";
    restartButton.onclick = function () {
        modal.remove();
        restartGame();
    };

    modal.appendChild(message);
    modal.appendChild(restartButton);
    document.body.appendChild(modal);
}

function restartGame() {
    // כאן תוסיף את הקוד שמאתחל את המשחק מחדש
    location.reload(); // אפשרות פשוטה לרענון הדף
}

// עדכון הניקוד בכל פעם שמזיזים קלף לסריה



});

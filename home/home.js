function startLevel(level) {
    if (level === 'A') {
        // העבר לדף של שלב א
        window.location.href = '/levelA/levelA.html'; // כאן תוכל לשים את כתובת הדף של שלב א
    } else if (level === 'B') {
        // העבר לדף של שלב ב
        window.location.href = '/levelB/levelB.html'; // כאן תוכל לשים את כתובת הדף של שלב ב
    }
}
// ודא שהמשתמש מחובר (האם יש currentUser ב-localStorage)
document.addEventListener("DOMContentLoaded", function () {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser) {
        // הצג את השם של המשתמש בתוך האלמנט
        document.getElementById("userName").textContent = currentUser.uname;
    } else {
        // אם לא נמצא משתמש מחובר, הפנה לדף ההתחברות
        window.location.href = "/login.html"; // שנה את הנתיב לדף ההתחברות שלך אם צריך
    }
});

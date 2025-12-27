function login(e) {

    let uname = document.querySelector("#uname").value;
    let psw = document.querySelector("#psw").value;
    let users = localStorage.getItem("users");
    users = users == undefined ? {} : JSON.parse(users);
  
    if (Object.keys(users).includes(uname) == true) {
      if (users[uname].psw == psw) {        // בדיקה האם הסיסמה תואמת לסיסמה השמורה של המשתמש

        let currentUser = users[uname];            // שמירת המשתמש הנוכחי ב- localStorage

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.location.href = window.location.origin + "/home/home.html"
      }
      else {
        alert("you had a mistake");
      }
    }
    else {
      alert("you had a mistake");
    }
  
  };
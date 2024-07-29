document.getElementById("loading").style.display = "none";
document.getElementById("userContent").style.display = "none";
document.getElementById("opponentContent").style.display = "none";
document.getElementById("valueContent").style.display = "none";
document.getElementById("whosTurn").style.display = "none";
document.getElementById("bigContainer").style.display = "none";

const socket = io();

let name;

document.getElementById("findPlayer").addEventListener("click", function () {
  name = document.getElementById("name").value;

  document.getElementById("user").innerText = name;

  if (name == null || name === "") {
    alert("Name cannot be blank, Please enter a name!");
  } else {
    socket.emit("findPlayer", { name: name });

    document.getElementById("loading").style.display = "block";
    document.getElementById("findPlayer").disabled = true;
  }
});

socket.on("findPlayer", (e) => {
  const allPlayersArray = e.allPlayers;
  console.log(allPlayersArray);

  document.getElementById("userContent").style.display = "block";
  document.getElementById("opponentContent").style.display = "block";
  document.getElementById("valueContent").style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("findPlayer").style.display = "none";
  document.getElementById("enterName").style.display = "none";
  document.getElementById("bigContainer").style.display = "block";
  document.getElementById("whosTurn").style.display = "block";
  document.getElementById("whosTurn").innerText = "X's Turn";

  let oppName;
  let value;

  const foundObj = allPlayersArray.find(
    (obj) => obj.p1.p1name == name || obj.p2.p2name == name
  );

  if (foundObj.p1.p1name == name) {
    oppName = foundObj.p2.p2name;
    value = "X";
  } else {
    oppName = foundObj.p1.p1name;
    value = "O";
  }

  document.getElementById("opponent").innerText = oppName;
  document.getElementById("value").innerText = value;
});

document.querySelectorAll(".btn").forEach((e) => {
  e.addEventListener("click", function () {
    let value = document.getElementById("value").innerText;
    let whosTurn = document.getElementById("whosTurn").innerText;

    // Check if it's the player's turn
    if (
      (value === "X" && whosTurn === "X's Turn") ||
      (value === "O" && whosTurn === "O's Turn")
    ) {
      e.innerText = value;
      e.disabled = true;

      socket.emit("playing", { value: value, id: e.id, name: name });
    }
  });
});

socket.on("playing", (e) => {
  const foundObj = e.allPlayers.find(
    (obj) => obj.p1.p1name == name || obj.p2.p2name == name
  );

  if (!foundObj) return;

  const p1id = foundObj.p1.p1move;
  const p2id = foundObj.p2.p2move;

  if (foundObj.sum % 2 === 0) {
    document.getElementById("whosTurn").innerText = "O's Turn";
  } else {
    document.getElementById("whosTurn").innerText = "X's Turn";
  }

  if (p1id) {
    const p1Element = document.getElementById(`${p1id}`);
    p1Element.innerText = "X";
    p1Element.disabled = true;
    p1Element.style.color = "black";
  }

  if (p2id) {
    const p2Element = document.getElementById(`${p2id}`);
    p2Element.innerText = "O";
    p2Element.disabled = true;
    p2Element.style.color = "black";
  }

  //Makes sure when someone clicks the button, only then it checks for the winner.
  check(name, foundObj.sum);
});

function check(name, sum) {
  //checking for the winner.
  document.getElementById("btn1").innerText == ""
    ? (b1 = "a")
    : (b1 = document.getElementById("btn1").innerText);
  document.getElementById("btn2").innerText == ""
    ? (b2 = "b")
    : (b2 = document.getElementById("btn2").innerText);
  document.getElementById("btn3").innerText == ""
    ? (b3 = "c")
    : (b3 = document.getElementById("btn3").innerText);
  document.getElementById("btn4").innerText == ""
    ? (b4 = "d")
    : (b4 = document.getElementById("btn4").innerText);
  document.getElementById("btn5").innerText == ""
    ? (b5 = "e")
    : (b5 = document.getElementById("btn5").innerText);
  document.getElementById("btn6").innerText == ""
    ? (b6 = "f")
    : (b6 = document.getElementById("btn6").innerText);
  document.getElementById("btn7").innerText == ""
    ? (b7 = "g")
    : (b7 = document.getElementById("btn7").innerText);
  document.getElementById("btn8").innerText == ""
    ? (b8 = "h")
    : (b8 = document.getElementById("btn8").innerText);
  document.getElementById("btn9").innerText == ""
    ? (b9 = "i")
    : (b9 = document.getElementById("btn9").innerText);

  // Function to add strikeout class to winning buttons
  function addStrikeout(btns) {
    btns.forEach((btn) =>
      document.getElementById(btn).classList.add("strikeout")
    );
  }

  //winning conditions
  if (b1 == b2 && b2 == b3) {
    addStrikeout(["btn1", "btn2", "btn3"]);
  } else if (b4 == b5 && b5 == b6) {
    addStrikeout(["btn4", "btn5", "btn6"]);
  } else if (b7 == b8 && b8 == b9) {
    addStrikeout(["btn7", "btn8", "btn9"]);
  } else if (b1 == b4 && b4 == b7) {
    addStrikeout(["btn1", "btn4", "btn7"]);
  } else if (b2 == b5 && b5 == b8) {
    addStrikeout(["btn2", "btn5", "btn8"]);
  } else if (b3 == b6 && b6 == b9) {
    addStrikeout(["btn3", "btn6", "btn9"]);
  } else if (b1 == b5 && b5 == b9) {
    addStrikeout(["btn1", "btn5", "btn9"]);
  } else if (b3 == b5 && b5 == b7) {
    addStrikeout(["btn3", "btn5", "btn7"]);
  }

  if (
    (b1 == b2 && b2 == b3) ||
    (b4 == b5 && b5 == b6) ||
    (b7 == b8 && b8 == b9) ||
    (b1 == b4 && b4 == b7) ||
    (b2 == b5 && b5 == b8) ||
    (b3 == b6 && b6 == b9) ||
    (b1 == b5 && b5 == b9) ||
    (b3 == b5 && b5 == b7)
  ) {
    socket.emit("gameOver", { name: name });

    setTimeout(() => {
      //If sum is even X won, else O won.
      sum % 2 == 0 ? alert("X WON, Game Over") : alert("O WON, Game Over");

      //reloading the page after winner is declared.
      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 100);
  } else if (sum == 10) {
    socket.emit("gameOver", { name: name });

    setTimeout(() => {
      //Nobody won, therefore draw.
      alert("Game Over, It is a Draw!");

      //reloading the page after draw.
      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 100);
  }
}

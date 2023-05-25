let word = "";
let input = "";
let defStatus = "Enter a word with the given letters";

let length = 7;
let score = 0;
let timer = 60;

let interval;

let shuffled = [];
let lists = [];
let found = [];
let words = [];

let languages = [
  "https://raw.githubusercontent.com/dolph/dictionary/master/popular.txt", //english
  "https://raw.githubusercontent.com/words/an-array-of-spanish-words/master/index.json", //spanish
  "https://raw.githubusercontent.com/rajkumarpal07/powertamil-dictionary/master/AllTamilWords.txt", //tamil
];

let wins;

function check(str) {
  let temp = word.valueOf();
  for (let i = 0; i < str.length; i++) {
    let ind = temp.indexOf(str.charAt(i));
    if (ind == -1) return false;
    temp = temp.substring(0, ind) + temp.substring(ind + 1);
  }
  return true;
}

function hasWord(str) {
  if (lists.includes(str)) {
    found.push(lists.splice(lists.indexOf(str), 1)[0]);
    return true;
  }
  return false;
}

async function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

var file = new XMLHttpRequest();
file.onreadystatechange = () => {
  if (file.readyState === 4 && (file.status === 200 || file.status == 0)) {
    if (file.responseURL.slice(-3) == 'txt') words = file.responseText
      .split("\n")
      .filter((n) => !n.match(/[&\/\\#,+()$~%.'":*?<>{}1234567890]/g)).map(n=>n.trim()); //i'm getting it from an outside source so i have to filter it here
    else if (file.responseURL.slice(-4) == 'json') {
      words = JSON.parse(file.responseText);
    }
  }
};

async function gen() {
  while (word.length != length)
    word = words[Math.floor(Math.random() * words.length)]; //make sure the word is `length` letters long
  lists = words.filter((n) => check(n) && n.length >= 3);
  await shuffleLetters();
  statUp(defStatus);
}

function disable() {
  document
    .querySelectorAll("#letters div, #enter, #input, #shuffle")
    .forEach((i) => (i.disabled = true));
}

function enable() {
  document
    .querySelectorAll("#letters div, #enter, #input, #shuffle")
    .forEach((i) => (i.disabled = false));
}

window.onload = async () => {
  await file.open(
    "GET",
    languages[Number(document.querySelector("#language").selectedIndex)],
    true
  );
  file.send(null);
  wins = JSON.parse(localStorage.getItem("anagram-wins")) || [];
  updateWins();
};

function updateWins() {
  document.querySelector("#wins").innerHTML = "";
  wins.forEach((i, index) => {
    let node = document.createElement("li");
    node.innerHTML =
      "Word: <b>" + i.word + "</b>, Score: <b>" + i.score + "</b>";
    let del = document.createElement("button");
    del.innerText = "delete";
    del.classList.add("material-icons", "trash");
    node.append(del);
    document.querySelector("#wins").appendChild(node);
    del.addEventListener("click", (e) => {
      wins.splice(index, 1);
      document.querySelector("#wins").removeChild(node);
      localStorage.setItem("anagram-wins", JSON.stringify(wins));
    });
  });
}

function start() {
  interval = setInterval(() => {
    if (--timer == 0) {
      disable();
      statUp("Times up! The full anagram word was: " + word + ".");
      wins.push({ word, score });
      localStorage.setItem("anagram-wins", JSON.stringify(wins));
      updateWins();
      setTimeout(() => {
        document.querySelector("#new-game-options").style.display = "block";
        document.querySelector("#found").innerHTML = "";
      }, 4000);
      clearInterval(interval);
    }
    if (timer >= 0)
      document.querySelector("#time").innerText = "Time: " + timer;
  }, 1000);
}

function clickInput(val) {
  if (check(val)) input = val;
  document.querySelector("#input").value = input;
  statUp(defStatus);
}

function enter() {
  if (
    input.length >= 3 &&
    input.length <= length &&
    check(input) &&
    hasWord(input)
  ) {
    if (input.length == length) {
      confetti(50);
      score += 10;
      statUp("Wow!");
    } else score += input.length;

    document.querySelector("#score").innerText = "Score: " + score;

    let node = document.createElement("li");
    node.innerText = input;
    document.querySelector("#found").appendChild(node);
  } else if (input.length < 3) statUp("Too short!");
  else if (input.length > 6) statUp("Too long!");
  else if (found.indexOf(input) > -1) statUp("You already entered that!");
  else statUp("Not a word!");

  document.querySelector("#input").value = "";
  input = "";
  if (lists.length == 0) {
    disable();
    statUp("You found all the words! The full anagram word was: " + word + ".");
    setTimeout(
      () =>
        (document.querySelector("#new-game-options").style.display = "block"),
      4000
    );
    clearInterval(interval);
  }
}

function statUp(str) {
  document.querySelector("#status").innerText = str;
}

async function shuffleLetters() {
  document.querySelector("#letters").innerHTML = "";
  shuffled = await shuffle(word.split(''));
  await shuffled.forEach((i) => {
    let node = document.createElement("div");
    node.innerText = i;
    node.addEventListener("click", (e) =>
      !e.target.disabled ? clickInput(input + i) : 0
    );
    document.querySelector("#letters").appendChild(node);
  });
  let backNode = document.createElement("div");
  backNode.innerHTML = `<i class="material-icons">&#xe14a;</i>`;
  backNode.addEventListener("click", (e) =>
    !e.target.disabled ? clickInput(input.substring(0, input.length - 1)) : 0
  );
  document.querySelector("#letters").appendChild(backNode);
}

async function newGame() {
  word = "";
  input = "";
  shuffled = [];
  score = 0;
  found = [];
  timer = 60;
  length = Number(document.querySelector("#length-of-word").value);
  await gen().then(() => {
    document.querySelector("#score").innerText = "Score: " + score;
    document.querySelector("#time").innerText = "Time: " + timer;
    document.querySelector("#new-game-options").style.display = "none";
    enable();
    start();
  });
}

document.querySelector("#shuffle").addEventListener("click", shuffleLetters);
document.querySelector("#new-game").addEventListener("click", newGame);
document.querySelector("#language").addEventListener("input", async () => {
  await file.open(
    "GET",
    languages[Number(document.querySelector("#language").selectedIndex)],
    true
  );
  file.send(null);
});

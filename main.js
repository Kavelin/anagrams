let word = "";
let input = "";
let shuffled = [];
let length = 6;
let score = 0;
let lists = [[], [], [], []];
let found = [];
let defStatus = "Enter a word with the given letters";

let words = [];

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
  let curList = lists[str.length - 3];
  for (let i = 0; i < curList.length; i++) {
    if (curList[i] == str) {
      found.push(curList.splice(i, 1)[0]);
      return true;
    }
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
file.onreadystatechange = async () => {
  if (file.readyState === 4 && (file.status === 200 || file.status == 0)) {
    words = file.responseText.split("\n");

    while (word.length != length)
      word = words[Math.floor(Math.random() * words.length)]; //make sure the word is `length` letters long

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < words.length; j++)
        if (words[j].length == i + 3 && check(words[j]))
          lists[i].push(words[j]);
    }
  }

  await shuffleLetters();
  statUp(defStatus);
};

window.onload = async () => {
  await file.open("GET", "java/words.txt", true);
  file.send(null);
};

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
    if (input.length == 6) score += 10;
    else score += input.length;
    document.querySelector("#score").innerText = "Score: " + score;
  } else if (input.length < 3) statUp("Too short!");
  else if (input.length > 6) statUp("Too long!");
  else if (found.indexOf(input) > -1) statUp("You already entered that!");
  else statUp("Not a word!");

  document.querySelector("#input").value = "";
  input = "";
}

function statUp(str) {
  document.querySelector("#status").innerText = str;
}

async function shuffleLetters() {
  document.querySelector("#letters").innerHTML = "";
  shuffled = await shuffle(word.split(""));
  await shuffled.forEach((i) => {
    let node = document.createElement("div");
    node.innerText = i;
    node.classList.add("letter");
    node.addEventListener("click", () => clickInput(input + i));
    document.querySelector("#letters").appendChild(node);
  });
}

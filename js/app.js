'use strict';
import { Square, Bug, Pill, score, throwingPill } from './classes.js';

const THROW_SQUARES = [];
const SQUARES = [];
const BUGS = [];
const PILLS = [];
const COLORS = ['blue', 'yellow', 'brown'];

const MAIN_BOARD = document.getElementById('squares-board');
const THROW_SQUARES_BOARD = document.getElementById('throw-squares-board');
const VIRUSES = document.getElementById('viruses');
const TOP_SCORE = document.getElementById('top-score');
const GAME_OVER_DOCTOR = document.getElementById('game-over-doctor');

let topScore = parseInt(localStorage.getItem('topScore'));
let flag = false;
let keyCode = '';
let virus_magnifier_interval_2 = undefined;

//---------------KWADRATY---------------
(() => {
  let count = 0;
  THROW_SQUARES.push([]);
  for (let i = 0; i < 8; i++) {
    const ROW = [];
    ROW.push([]);
    for (let j = 0; j < 12; j++) {
      count--;
      const square = new Square(count, false, null, undefined, 'throw-square');
      square.generateSquare(THROW_SQUARES_BOARD);
      ROW.push(square);
    }
    THROW_SQUARES.push(ROW);
  }
})();

(() => {
  let count = 0;
  let ROW = [];
  for (let i = 0; i < 10; i++) {
    const square = new Square(null, true, null);
    ROW.push(square);
  }
  SQUARES.push(ROW);
  for (let i = 0; i < 16; i++) {
    const ROW = [];
    ROW.push(new Square(null, true, null));
    for (let j = 0; j < 8; j++) {
      count++;
      const square = new Square(count, false, null, undefined, 'square');
      square.generateSquare(MAIN_BOARD);
      ROW.push(square);
    }
    ROW.push(new Square(null, true, null));
    SQUARES.push(ROW);
  }
  SQUARES.push(ROW);
})();
//--------------------------------------

//----------------WIRUSY----------------
let auxiliaryVariable = 0;
for (let i = 0; i < 4; i++) {
  const bug = new Bug(COLORS[auxiliaryVariable]);
  BUGS.push(bug);
  bug.generateBug();
  auxiliaryVariable++;
  if(auxiliaryVariable === 3) auxiliaryVariable = 0;
};
function updateVirusesCount() {
  VIRUSES.innerText = '';
  const img_1 = document.createElement('img');
  const img_2 = document.createElement('img');
  img_1.src = '../img/cyfry/0.png';
  img_2.src = `../img/cyfry/${BUGS.length}.png`;
  img_1.classList.add('digit');
  img_2.classList.add('digit');
  VIRUSES.appendChild(img_1);
  VIRUSES.appendChild(img_2);
};
function virusMagnifier(){
  const BROWN_VIRUS = document.getElementById('brown-virus');
  const YELLOW_VIRUS = document.getElementById('yellow-virus');
  const BLUE_VIRUS = document.getElementById('blue-virus')
  let count = 2;
  let increase = true;
  let count_2 = 1
  const virus_magnifier_interval = setInterval(() => {
    BROWN_VIRUS.src = `../img/lupa/br/${count}.png`
    YELLOW_VIRUS.src = `../img/lupa/yl/${count}.png`
    BLUE_VIRUS.src = `../img/lupa/bl/${count}.png`
    if(increase) count++
    else if(!increase) count--;
    if(increase && count === 4){
      count--;
      increase = false;
    } else if(!increase && count === 0){
      count++;
      increase = true;
    }
  }, 150);
  virus_magnifier_interval_2 = setInterval(() => {
    switch(count_2){
      case 1:
        BLUE_VIRUS.style.marginLeft = '115px';
        BROWN_VIRUS.style.marginTop = '278px';
        YELLOW_VIRUS.style.marginLeft = '98px';
        break;
      case 2:
        BLUE_VIRUS.style.marginLeft = '128px';
        BLUE_VIRUS.style.marginTop = '288px';
        BROWN_VIRUS.style.marginLeft = '50px';
        BROWN_VIRUS.style.marginTop = '291.5px';
        YELLOW_VIRUS.style.marginLeft = '80px';
        break;
      case 3:
        BLUE_VIRUS.style.marginTop = '271px';
        BROWN_VIRUS.style.marginTop = '305px';
        YELLOW_VIRUS.style.marginLeft = '66px';
        break;
      case 4:
        BLUE_VIRUS.style.marginTop = '256px';
        BROWN_VIRUS.style.marginLeft = '66px';
        YELLOW_VIRUS.style.marginLeft = '50px';
        YELLOW_VIRUS.style.marginTop = '242px';
        break;
      case 5:
        BLUE_VIRUS.style.marginTop = '240px';
        BROWN_VIRUS.style.marginLeft = '82px';
        YELLOW_VIRUS.style.marginLeft = '32px';
        YELLOW_VIRUS.style.marginTop = '260px';
        break;
      case 6:
        BLUE_VIRUS.style.marginTop = '228px';
        BLUE_VIRUS.style.marginLeft = '116px';
        BROWN_VIRUS.style.marginLeft = '98px'
        YELLOW_VIRUS.style.marginTop = '278px';
        break;
      case 7:
        BLUE_VIRUS.style.marginLeft = '98px';
        BROWN_VIRUS.style.marginLeft = '115px';
        YELLOW_VIRUS.style.marginLeft = '50px';
        YELLOW_VIRUS.style.marginTop = '291.5px';
        break;
      case 8:
        BLUE_VIRUS.style.marginLeft = '80px';
        BROWN_VIRUS.style.marginLeft = '128px';
        BROWN_VIRUS.style.marginTop = '288px';
        YELLOW_VIRUS.style.marginTop = '305px';
        break;
      case 9:
        BLUE_VIRUS.style.marginLeft = '66px';
        BROWN_VIRUS.style.marginTop = '271px';
        YELLOW_VIRUS.style.marginLeft = '66px';
        break;
      case 10:
        BLUE_VIRUS.style.marginLeft = '50px';
        BLUE_VIRUS.style.marginTop = '242px';
        BROWN_VIRUS.style.marginTop = '256px';
        YELLOW_VIRUS.style.marginLeft = '82px';
        break;
      case 11:
        BLUE_VIRUS.style.marginLeft = '32px';
        BLUE_VIRUS.style.marginTop = '260px';
        BROWN_VIRUS.style.marginTop = '240px';
        YELLOW_VIRUS.style.marginLeft = '98px';
        break;
      case 12:
        BLUE_VIRUS.style.marginTop = '278px';
        BROWN_VIRUS.style.marginTop = '228px';
        BROWN_VIRUS.style.marginLeft = '116px';
        YELLOW_VIRUS.style.marginLeft = '115px';
        break;
      case 13:
        BLUE_VIRUS.style.marginLeft = '50px';
        BLUE_VIRUS.style.marginTop = '291.5px';
        BROWN_VIRUS.style.marginLeft = '98px';
        YELLOW_VIRUS.style.marginLeft = '128px';
        YELLOW_VIRUS.style.marginTop = '288px';
        break;
      case 14:
        BLUE_VIRUS.style.marginTop = '305px';
        BROWN_VIRUS.style.marginLeft = '80px';
        YELLOW_VIRUS.style.marginTop = '271px';
        break;
      case 15:
        BLUE_VIRUS.style.marginLeft = '66px';
        BROWN_VIRUS.style.marginLeft = '66px';
        YELLOW_VIRUS.style.marginTop = '256px';
        break;
      case 16:
        BLUE_VIRUS.style.marginLeft = '82px';
        BROWN_VIRUS.style.marginLeft = '50px';
        BROWN_VIRUS.style.marginTop = '242px';
        YELLOW_VIRUS.style.marginTop = '240px';
        break;
      case 17:
        BLUE_VIRUS.style.marginLeft = '98px';
        BROWN_VIRUS.style.marginLeft = '32px';
        BROWN_VIRUS.style.marginTop = '260px';
        YELLOW_VIRUS.style.marginTop = '228px';
        YELLOW_VIRUS.style.marginLeft = '116px';
        break;
    }
    count_2++;
    if(count_2 === 18) count_2 = 1
  }, 1200)
};
updateVirusesCount();
virusMagnifier();
//--------------------------------------

//----------------KLOCKI----------------
let generateNewPill = true;
let pill = undefined;
let id = 1;

const interval = setInterval(() => {
  generateNewPill = true;
  if (PILLS.length > 0) {
    generateNewPill = PILLS.every(e => e.state === 'static')
    PILLS.forEach(element => {
      if(element.state === 'static') element.reactivatePill();
    });
  }
  if (!SQUARES[1][4].isOccupied && !SQUARES[1][5].isOccupied && generateNewPill) {
    let color_1 = undefined;
    let color_2 = undefined;
    if(PILLS.length === 0){
      color_1 = COLORS[Math.round(Math.random() * 2)];
      color_2 = COLORS[Math.round(Math.random() * 2)];
    } else{
      color_1 = document.getElementById('-47').dataset.color_1;
      color_2 = document.getElementById('-48').dataset.color_2;
    }
    flag = true
    pill = new Pill(color_1, color_2, 'falling', 'horizontal', 4, [11, 12], id);
    PILLS.push(pill);
    id += 1;
    pill.throwPill()
  } else if (PILLS.length !== 0 && PILLS[PILLS.length - 1].state === 'static' && (SQUARES[1][4].isOccupied || SQUARES[1][5].isOccupied)) {
    clearInterval(interval);
    clearInterval(virus_magnifier_interval_2);
    GAME_OVER_DOCTOR.style.display = 'inline';
    document.getElementById('alert').style.display = 'inline';
    document.getElementById('alert').setAttribute('src', './img/go.png');
    if(score > topScore) localStorage.setItem('topScore', score);
  }
}, 1000);
window.onkeydown = e => {
  if (
    pill &&
    (e.code.substr(0, 5) === 'Shift' ||
      e.code === 'ArrowUp' ||
      e.code === 'KeyW') && !throwingPill
  )
    pill.rotate(e.code, false, SQUARES);
  else if (pill && !throwingPill) {
    flag = true
    keyCode = e.code
  };
};
window.onkeyup = () => {
  flag = false
  keyCode = ''
}
//--------------------------------------

//----------------PUNKTY----------------
if (!topScore) {
  topScore = 0;
  localStorage.setItem('topScore', topScore);
} else {
  updateTopScore();
}
function updateTopScore() {
  for (let i = 0; i < 7; i++) {
    const score_img = document.createElement('img');
    if (i === 4) score_img.src = `../img/cyfry/${topScore / 100}.png`;
    else score_img.src = '../img/cyfry/0.png';
    score_img.classList.add('digit');
    TOP_SCORE.appendChild(score_img);
  }
}
//--------------------------------------
export { SQUARES, BUGS, PILLS, THROW_SQUARES, COLORS, interval, updateVirusesCount, flag, keyCode };

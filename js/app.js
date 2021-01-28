'use strict';
import { Square, Bug, Pill } from './classes.js';

const SQUARES = [];
const BUGS = [];
const PILLS = [];
const COLORS = ['blue', 'yellow', 'red'];

// const MAIN_BOARD = document.getElementById('main-board');

//---------------KWADRATY---------------
(() => {
  let count = 0;
  let ROW = []
  for(let i = 0; i<10; i++){
    const square = new Square(null, true, null);
      ROW.push(square);
  }
  SQUARES.push(ROW)
  for (let i = 0; i < 16; i++) {
    const ROW = [];
    ROW.push(new Square(null, true, null))
    for (let j = 0; j < 8; j++) {
      count++;
      const square = new Square(count, false, null);
      square.generateSquare();
      ROW.push(square);
    }
    ROW.push(new Square(null, true, null))
    SQUARES.push(ROW);
  }
  SQUARES.push(ROW)
})();
// console.log(SQUARES)
//--------------------------------------

//----------------ROBAKI----------------
for(let i = 0; i<4; i++){
  const color = Math.round(Math.random() * 2)
  const bug = new Bug(COLORS[color])
  BUGS.push(bug)
  bug.generateBug()
}
//--------------------------------------

//----------------KLOCKI----------------
let pill = undefined;
const interval = setInterval(() => {
  if((PILLS.length === 0 || PILLS[PILLS.length-1].state === 'static') && !SQUARES[1][4].isOccupied && !SQUARES[1][5].isOccupied){
    const color_1 = Math.round(Math.random() * 2)
    const color_2 = Math.round(Math.random() * 2)
    pill = new Pill(COLORS[color_1], COLORS[color_2], 'falling', 'horizontal', 1, [4,5])
    PILLS.push(pill)
    pill.generatePill()
  }
  else if(PILLS.length !== 0 && PILLS[PILLS.length-1].state === 'static' && (SQUARES[1][4].isOccupied || SQUARES[1][5].isOccupied)){
    clearInterval(interval)
    alert('bruh, nie można wygenerować kolejnych tabletek')
  }
}, 1000)
window.onkeydown = e => {
  if(pill && (e.code.substr(0,5) === 'Shift' || e.code === 'ArrowUp' || e.code === 'KeyW')) pill.rotate(e.code)
  else if(pill) pill.move(e.code)
}
//--------------------------------------

export { SQUARES, BUGS, PILLS, interval }
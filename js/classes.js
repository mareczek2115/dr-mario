'use strict';
import { SQUARES, BUGS, PILLS } from './app.js ';
const MAIN_BOARD = document.getElementById('main-board');

//TODO obrot przy prawej krawedzi poprawic zeby sie nie wypierdalao

//
class Square {
  constructor(id, isOccupied, typeOfEntity) {
    this.id = id;
    this.isOccupied = isOccupied;
    this.typeOfEntity = typeOfEntity;
  }
  generateSquare = () => {
    const SQUARE = document.createElement('div');
    SQUARE.id = this.id;
    SQUARE.classList.add('square');
    MAIN_BOARD.appendChild(SQUARE);
  };
}

//
class Pill {
  constructor(color_1, color_2, state, position, currentRow, currentColumn) {
    this.color_1 = color_1;
    this.color_2 = color_2;
    this.state = state;
    this.position = position;
    this.currentRow = currentRow;
    this.currentColumn = currentColumn;
    this.canMove = true;
    this.uselessShit = false
  }
  generatePill = () => {
    setTimeout(() => {
      if(!SQUARES[this.currentRow][this.currentColumn[0]].isOccupied && !SQUARES[this.currentRow][this.currentColumn[1]].isOccupied){
        this.colorizeHorizontalPill('generatePill');
        this.fallDown();
      }
    }, 500)
  }
  fallDown = () => {
      this.interval = setInterval(() => {
        if(this.position === 'horizontal' && SQUARES[this.currentRow+1][this.currentColumn[0]].isOccupied === false && SQUARES[this.currentRow+1][this.currentColumn[1]].isOccupied === false)
          this.colorizeHorizontalPill('fallDown');
        else if(this.position === 'vertical' && SQUARES[this.currentRow[0]+1][this.currentColumn].isOccupied === false)
          this.colorizeVerticalPill('fallDown');
        else{
          clearInterval(this.interval);
          this.state = 'static';
        }
      }, 1000)
  };
  rotate = (code) => {
    if(this.state !== 'static' && this.currentRow !== 1){
      if(this.position === 'horizontal' && SQUARES[this.currentRow-1][this.currentColumn[0]].isOccupied === false && this.canMove){
        document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).style.backgroundColor = 'white';
        SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = false;
        SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = null;
        this.currentRow = [this.currentRow, this.currentRow-1];
        this.currentColumn = this.currentColumn[0];
        if(code === 'ArrowUp' || code === 'KeyW'){
          if(this.uselessShit){
            let temp = this.color_1
            this.color_1 = this.color_2
            this.color_2 = temp
          }
          this.uselessShit = !this.uselessShit
        } else if(code.substr(0,5) === 'Shift'){
          this.uselessShit = !this.uselessShit
          if(this.uselessShit){
            let temp = this.color_1
            this.color_1 = this.color_2
            this.color_2 = temp
          }
        }
        this.colorizeVerticalPill();
      } else if(this.position === 'vertical' && SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied === false && this.canMove){
        document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).style.backgroundColor = 'white';
        SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
        SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
        this.currentRow = this.currentRow[0];
        this.currentColumn = [this.currentColumn, this.currentColumn+1];
        if(code === 'ArrowUp' || code === 'KeyW'){
          if(this.uselessShit){
            let temp = this.color_1
            this.color_1 = this.color_2
            this.color_2 = temp
          }
          this.uselessShit = !this.uselessShit
        } else if(code.substr(0,5) === 'Shift'){
          this.uselessShit = !this.uselessShit
          if(this.uselessShit){
            let temp = this.color_1
            this.color_1 = this.color_2
            this.color_2 = temp
          }
        }
        this.colorizeHorizontalPill();
      }
      this.position === 'horizontal' ? this.position = 'vertical' : this.position = 'horizontal';
    }
  };
  move = (code) => {
    if(this.state !== 'static'){
      if(this.position === 'horizontal'){
        if((code === 'ArrowLeft' || code === 'KeyA') && SQUARES[this.currentRow][this.currentColumn[0]-1].isOccupied === false && this.canMove)
          this.colorizeHorizontalPill('moveLeft');
        else if((code === 'ArrowRight' || code === 'KeyD') && SQUARES[this.currentRow][this.currentColumn[1]+1].isOccupied === false && this.canMove)
          this.colorizeHorizontalPill('moveRight');
        else if(code === 'ArrowDown' || code === 'KeyS'){
          this.canMove = false;
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            if(SQUARES[this.currentRow+1][this.currentColumn[0]].isOccupied === false && SQUARES[this.currentRow+1][this.currentColumn[1]].isOccupied === false)
              this.colorizeHorizontalPill('fallDown');
            else{
              clearInterval(this.interval);
              this.state = 'static';
              this.canMove = true;
            }
          }, 50);
        }
      } else if(this.position === 'vertical'){
        if((code === 'ArrowLeft' || code === 'KeyA') && SQUARES[this.currentRow[0]][this.currentColumn-1].isOccupied === false && SQUARES[this.currentRow[1]][this.currentColumn-1].isOccupied === false && this.canMove)
          this.colorizeVerticalPill('moveLeft');
        if((code === 'ArrowRight' || code === 'KeyD') && SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied === false && SQUARES[this.currentRow[1]][this.currentColumn+1].isOccupied === false && this.canMove)
          this.colorizeVerticalPill('moveRight');
        else if(code === 'ArrowDown' || code === 'KeyS'){
          this.canMove = false;
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            if(SQUARES[this.currentRow[0]+1][this.currentColumn].isOccupied === false)
              this.colorizeVerticalPill('fallDown');
            else{
              clearInterval(this.interval);
              this.state = 'static';
              this.canMove = true;
            };
          }, 50);
        }
        console.log(this)
      }
    }
  };
  colorizeHorizontalPill = (source) => {
    if(source !== 'generatePill'){
      SQUARES[this.currentRow][this.currentColumn[0]].isOccupied = false;
      SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity = null;
      SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = false;
      SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = null;
      document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).style.backgroundColor = `white`;
      document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).style.backgroundColor = `white`;
    }
    switch(source){
      case 'fallDown':
        this.currentRow += 1;
        break;
      case 'moveLeft':
        this.currentColumn = [this.currentColumn[0]-1, this.currentColumn[1]-1];
        break;
      case 'moveRight':
        this.currentColumn = [this.currentColumn[0]+1, this.currentColumn[1]+1];
        break;
      default:
        break;
    }
    SQUARES[this.currentRow][this.currentColumn[0]].isOccupied = true;
    SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity = 'pill';
    SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = true;
    SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = 'pill';
    document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).style.backgroundColor = `${this.color_1}`;
    document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).style.backgroundColor = `${this.color_2}`;
  };
  colorizeVerticalPill = (source) => {
    SQUARES[this.currentRow[0]][this.currentColumn].isOccupied = false;
    SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity = null;
    SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
    SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
    document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).style.backgroundColor = `white`;
    document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).style.backgroundColor = `white`;
    switch(source){
      case 'fallDown':
        this.currentRow = [this.currentRow[0]+1, this.currentRow[0]];
        break;
      case 'moveLeft':
        this.currentColumn -= 1;
        break;
      case 'moveRight':
        this.currentColumn += 1;
        break;
      default:
        break;
    }
    SQUARES[this.currentRow[0]][this.currentColumn].isOccupied = true;
    SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity = 'pill';
    SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = true;
    SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = 'pill';
    document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).style.backgroundColor = `${this.color_1}`;
    document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).style.backgroundColor = `${this.color_2}`;
  }
}

//
class Bug {
  constructor(color) {
    this.color = color;
  }
  generateBug = () => {
    const [ ROW, COLUMN ] = drawRandomSquare();
    SQUARES[ROW][COLUMN].isOccupied = true
    SQUARES[ROW][COLUMN].typeOfEntity = 'bug'
    document.getElementById(`${SQUARES[ROW][COLUMN].id}`).style.backgroundColor = `${this.color}`
  }
}

//
const drawRandomSquare = () => {
  const ROW = Math.round(Math.random() * 12) + 4;
  const COLUMN = Math.round(Math.random() * 7) + 1;
  return [ROW, COLUMN]
}

export { Square, Bug, Pill };

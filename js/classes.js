"use strict";
import { SQUARES, BUGS, PILLS, THROW_SQUARES, COLORS, interval, updateVirusesCount, flag, keyCode } from './app.js ';

const SCORE_BOARD = document.getElementById('score');

let topScore = localStorage.getItem('topScore')
if(!topScore) topScore = 0

let score = 0;
let throwingPill = true

//
function updateScore(){
  for(let i = 0; i<7; i++){
    const score_img = document.createElement('img');
    if(i === 4) score_img.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/cyfry/${score/100}.png`;
    else score_img.src = 'https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/cyfry/0.png';
    score_img.classList.add('digit');
    SCORE_BOARD.appendChild(score_img);
  }
};
updateScore()

//
class Square {
  constructor(id, isOccupied, typeOfEntity, color, className) {
    this.id = id;
    this.isOccupied = isOccupied;
    this.typeOfEntity = typeOfEntity;
    this.color = color
    this.pillId = undefined
    this.className = className
    this.state = undefined
  }
  generateSquare = MAIN_BOARD => {
    const SQUARE = document.createElement('div');
    SQUARE.id = this.id;
    SQUARE.classList.add(this.className);
    MAIN_BOARD.appendChild(SQUARE);
  };
}

//
class Pill {
  constructor(color_1, color_2, state, position, currentRow, currentColumn, id) {
    this.color_1 = color_1;
    this.color_2 = color_2;
    this.state = state;
    this.position = position;
    this.currentRow = currentRow;
    this.currentColumn = currentColumn;
    this.canMove = false;
    this.changeColor = false
    this.id = id
  };
  throwPill = () => {
    this.canMove = true
    let count = 0
    this.colorizeHorizontalPill('fallDown', false, false, THROW_SQUARES);
    document.getElementById('-60').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/up_1.png" class="hand" />`
    document.getElementById('-72').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/up_2.png" class="hand" />`
    document.getElementById('-84').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/up_3.png" class="hand" />`
    const throw_pill_interval = setInterval(() => {
      if(count === 23){
        document.getElementById('-96').innerHTML = ''
        document.getElementById('-60').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/up_1.png" class="hand" />`
        document.getElementById('-72').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/up_2.png" class="hand" />`
        document.getElementById('-84').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/up_3.png" class="hand" />`
        let colorNumeroUno = COLORS[Math.round(Math.random() * 2)]
        let colorNumeroDuo = COLORS[Math.round(Math.random() * 2)]
        document.getElementById('-47').dataset.color_1 = colorNumeroUno
        document.getElementById('-48').dataset.color_2 = colorNumeroDuo
        document.getElementById('-47').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${colorNumeroUno.substr(0,2)}_left.png" />`
        document.getElementById('-48').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${colorNumeroDuo.substr(0,2)}_right.png" />`
        clearInterval(throw_pill_interval);
        this.changeBoard()
        throwingPill = false
      }
      if(count === 0 || count === 2 || count === 4 || count === 6 || count === 8 || count === 10 || count === 12 || count === 14 || count === 16 || count === 18) this.rotate('ArrowUp', false, THROW_SQUARES);
      else if(count === 1 || count === 3 || count === 5 || count === 7 || count === 9 || count === 11 || count === 13 || count === 15 || count === 17 || count === 19) this.rotate('ArrowUp', true, THROW_SQUARES);
      if(count === 1 || count === 3) this.colorizeHorizontalPill('moveUpward', false, true, THROW_SQUARES);
      else if(count === 17 || count === 20 || count === 21 || count === 22) this.colorizeHorizontalPill('fallDown', false, true, THROW_SQUARES);
      if(count === 3){
        document.getElementById('-60').innerHTML = ''
        document.getElementById('-71').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/middle_11.png" class="hand" />`
        document.getElementById('-72').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/middle_12.png" class="hand" />`
        document.getElementById('-83').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/middle_21.png" class="hand" />`
        document.getElementById('-84').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/middle_22.png" class="hand" />`
      }
      if(count === 6){
        document.getElementById('-71').innerHTML = ''
        document.getElementById('-72').innerHTML = ''
        document.getElementById('-83').innerHTML = ''
        document.getElementById('-84').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/down_1.png" class="hand" />`
        document.getElementById('-96').innerHTML = `<img src="https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/hands/down_2.png" class="hand" />`
      }
      count++;
    }, 20)
  };
  changeBoard = () => {
    this.currentRow = 1
    this.currentColumn = [4, 5]
    setTimeout(() => {
      if(!SQUARES[this.currentRow][this.currentColumn[0]].isOccupied && !SQUARES[this.currentRow][this.currentColumn[1]].isOccupied){
        this.colorizeHorizontalPill('generatePill', false, true, SQUARES);
        document.getElementById('-61').removeChild(document.getElementById('-61').lastChild);
        document.getElementById('-62').removeChild(document.getElementById('-62').lastChild);
        THROW_SQUARES[6][1].isOccupied = false
        THROW_SQUARES[6][1].typeOfEntity = null
        THROW_SQUARES[6][1].color = undefined
        THROW_SQUARES[6][1].pillId = undefined
        THROW_SQUARES[6][2].isOccupied = false
        THROW_SQUARES[6][2].typeOfEntity = null
        THROW_SQUARES[6][2].color = undefined
        THROW_SQUARES[6][2].pillId = undefined
        this.canMove = true
        this.fallDown();
        this.move_interval = setInterval(() => this.move(keyCode, SQUARES), 100)
      }
    }, 500)
  };
  fallDown = () => {
      this.interval = setInterval(() => {
        if(this.position === 'horizontal' && !SQUARES[this.currentRow+1][this.currentColumn[0]].isOccupied && !SQUARES[this.currentRow+1][this.currentColumn[1]].isOccupied){
          this.colorizeHorizontalPill('fallDown', false, true, SQUARES);
        }
        else if(this.position === 'vertical' && !SQUARES[this.currentRow[0]+1][this.currentColumn].isOccupied){
          this.colorizeVerticalPill('fallDown', false, true, SQUARES);
        }
        else{
          clearInterval(this.interval);
          this.state = 'static';
          if(this.position === 'horizontal'){
            SQUARES[this.currentRow][this.currentColumn[0]].state = 'static'
            SQUARES[this.currentRow][this.currentColumn[1]].state = 'static'
          } else{
            SQUARES[this.currentRow[0]][this.currentColumn].state = 'static'
            SQUARES[this.currentRow[1]][this.currentColumn].state = 'static'
          }
          this.checkIfCanRemove()
        }
      }, 800)
  };
  rotate = (code, throwingPill, SQUARES) => {
    if(this.state !== 'static' && this.currentRow !== 1){
      let wasPositionChanged = false
      if(this.position === 'horizontal' && !SQUARES[this.currentRow-1][this.currentColumn[0]].isOccupied && this.canMove){
        document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).removeChild(document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).lastChild)
        SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = false;
        SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = null;
        SQUARES[this.currentRow][this.currentColumn[1]].color = undefined;
        SQUARES[this.currentRow][this.currentColumn[1]].pillId = undefined;
        this.currentRow = [this.currentRow, this.currentRow-1];
        this.currentColumn = this.currentColumn[0];
        if(code === 'ArrowUp' || code === 'KeyW'){
          if(this.changeColor){
            let temp = this.color_1;
            this.color_1 = this.color_2;
            this.color_2 = temp;
          }
          this.changeColor = !this.changeColor;
        } else if(code.substr(0,5) === 'Shift'){
            this.changeColor = !this.changeColor;
            if(this.changeColor){
              let temp = this.color_1;
              this.color_1 = this.color_2;
              this.color_2 = temp;
            }
        }
        wasPositionChanged = !wasPositionChanged
      } else if(this.position === 'vertical' && !SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied && this.canMove && !throwingPill){
        document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).removeChild(document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).lastChild)
        SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
        SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
        SQUARES[this.currentRow[1]][this.currentColumn].color = undefined;
        SQUARES[this.currentRow[1]][this.currentColumn].pillId = undefined;
        this.currentRow = this.currentRow[0];
        this.currentColumn = [this.currentColumn, this.currentColumn + 1];
        if(code === 'ArrowUp' || code === 'KeyW'){
            if(this.changeColor){
              let temp = this.color_1;
              this.color_1 = this.color_2;
              this.color_2 = temp;
            }
            this.changeColor = !this.changeColor;
        } else if(code.substr(0,5) === 'Shift'){
            this.changeColor = !this.changeColor;
            if(this.changeColor){
              let temp = this.color_1;
              this.color_1 = this.color_2;
              this.color_2 = temp;
            }
        }
        wasPositionChanged = !wasPositionChanged
      } else if(this.position === 'vertical' && SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied && !SQUARES[this.currentRow[0]][this.currentColumn-1].isOccupied && this.canMove && !wasPositionChanged || (!wasPositionChanged && throwingPill)){
        document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).removeChild(document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).lastChild);
        SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
        SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
        SQUARES[this.currentRow[1]][this.currentColumn].color = undefined;
        SQUARES[this.currentRow[1]][this.currentColumn].pillId = undefined;
        this.currentRow = this.currentRow[0];
        this.currentColumn = [this.currentColumn - 1, this.currentColumn];
        if(code === 'ArrowUp' || code === 'KeyW'){
          if(this.changeColor){
            let temp = this.color_1;
            this.color_1 = this.color_2;
            this.color_2 = temp;
          }
          this.changeColor = !this.changeColor;
        } else if(code.substr(0,5) === 'Shift'){
          this.changeColor = !this.changeColor;
          if(this.changeColor){
            let temp = this.color_1;
            this.color_1 = this.color_2;
            this.color_2 = temp;
          }
        }
        wasPositionChanged = !wasPositionChanged
      }
      if(wasPositionChanged) this.position === 'horizontal' ? this.position = 'vertical' : this.position = 'horizontal';
      this.position === 'horizontal' ? this.colorizeHorizontalPill(undefined, false, true, SQUARES) : this.colorizeVerticalPill(undefined, false, true, SQUARES);
    }
  };
  move = (code, SQUARES) => {
    if(flag){
      if(this.state != 'static'){
        if(this.position === 'horizontal'){
          if((code === 'ArrowLeft' || code === 'KeyA') && !SQUARES[this.currentRow][this.currentColumn[0]-1].isOccupied && this.canMove)
            this.colorizeHorizontalPill('moveLeft', false, true, SQUARES);
          else if((code === 'ArrowRight' || code === 'KeyD') && !SQUARES[this.currentRow][this.currentColumn[1]+1].isOccupied && this.canMove)
            this.colorizeHorizontalPill('moveRight', false, true, SQUARES);
          else if((code === 'ArrowDown' || code === 'KeyS') && this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[0]].state !== 'static' && SQUARES[this.currentRow+1][this.currentColumn[1]].state !== 'static'){
            this.canMove = false;
            clearInterval(this.interval);
            this.interval = setInterval(() => {
              if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[0]].state !== 'static' && SQUARES[this.currentRow+1][this.currentColumn[1]].state !== 'static'){
                this.colorizeHorizontalPill('fallDown', false, true, SQUARES);
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove();
              } else {
                clearInterval(this.interval);
                this.state = 'static';
                SQUARES[this.currentRow][this.currentColumn[0]].state = 'static';
                SQUARES[this.currentRow][this.currentColumn[1]].state = 'static';
                PILLS.forEach(element => element.reactivatePill());
                this.checkIfCanRemove();
              }
            }, 50)
          }
        } else if(this.position === 'vertical'){
          if((code === 'ArrowLeft' || code === 'KeyA') && !SQUARES[this.currentRow[0]][this.currentColumn-1].isOccupied && !SQUARES[this.currentRow[1]][this.currentColumn-1].isOccupied && this.canMove)
            this.colorizeVerticalPill('moveLeft', false, true, SQUARES);
          if((code === 'ArrowRight' || code === 'KeyD') && !SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied && !SQUARES[this.currentRow[1]][this.currentColumn+1].isOccupied && this.canMove){
            this.colorizeVerticalPill('moveRight', false, true, SQUARES);
          } else if((code === 'ArrowDown' || code === 'KeyS') && this.currentRow[0] !== 16 && SQUARES[this.currentRow[0]+1][this.currentColumn].state !== 'static'){
            this.canMove = false;
            clearInterval(this.interval);
            this.interval = setInterval(() => {
              if(this.currentRow[0] !== 16 && SQUARES[this.currentRow[0]+1][this.currentColumn].state !== 'static'){
                this.colorizeVerticalPill('fallDown', false, true, SQUARES);
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove();
              } else {
                clearInterval(this.interval);
                this.state = 'static';
                SQUARES[this.currentRow[0]][this.currentColumn].state = 'static';
                SQUARES[this.currentRow[1]][this.currentColumn].state = 'static';
                PILLS.forEach(element => element.reactivatePill());
                this.checkIfCanRemove();
              }
            }, 50)
          }
        }
      }
    }
  };
  colorizeHorizontalPill = (source, singleCube, useChangeSquaresInside, SQUARES) => {
    let whiteBlock = undefined
    if(singleCube){
      if(!SQUARES[this.currentRow][this.currentColumn[0]].color || (SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity !== undefined && SQUARES[this.currentRow][this.currentColumn[0]].pillId !== this.id)) whiteBlock = 'left'
      else if(!SQUARES[this.currentRow][this.currentColumn[1]].color || (SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity && SQUARES[this.currentRow][this.currentColumn[1]].pillId !== this.id)) whiteBlock = 'right'
    }
    if(source !== 'generatePill'){
      if(whiteBlock !== 'left'){
        SQUARES[this.currentRow][this.currentColumn[0]].isOccupied = false;
        SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity = null;
        SQUARES[this.currentRow][this.currentColumn[0]].color = undefined;
        SQUARES[this.currentRow][this.currentColumn[0]].pillId = undefined;
        SQUARES[this.currentRow][this.currentColumn[0]].state = undefined;
        const img = document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).lastChild
        if(img) document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).removeChild(img);
      }
      if(whiteBlock !== 'right'){
        SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = false;
        SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = null;
        SQUARES[this.currentRow][this.currentColumn[1]].color = undefined;
        SQUARES[this.currentRow][this.currentColumn[1]].pillId = undefined;
        SQUARES[this.currentRow][this.currentColumn[1]].state = undefined;
        const img = document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).lastChild;
        if(img) document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).removeChild(img);
      }

    }
    if(useChangeSquaresInside) this.changeSquares(source, 'horizontal');
    if(whiteBlock === 'left'){
      SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = true;
      SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = 'pill';
      SQUARES[this.currentRow][this.currentColumn[1]].color = this.color_2;
      SQUARES[this.currentRow][this.currentColumn[1]].pillId = this.id;
      SQUARES[this.currentRow][this.currentColumn[1]].state = 'falling';
      const img = document.createElement('img')
      img.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_2.substr(0,2)}_dot.png`;
      document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).appendChild(img)
    } else if(whiteBlock === 'right'){
      SQUARES[this.currentRow][this.currentColumn[0]].isOccupied = true;
      SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity = 'pill';
      SQUARES[this.currentRow][this.currentColumn[0]].color = this.color_1;
      SQUARES[this.currentRow][this.currentColumn[0]].pillId = this.id;
      SQUARES[this.currentRow][this.currentColumn[0]].state = 'falling';
      const img = document.createElement('img')
      img.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_1.substr(0,2)}_dot.png`;
      document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).appendChild(img)
    } else{
      SQUARES[this.currentRow][this.currentColumn[0]].isOccupied = true;
      SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity = 'pill';
      SQUARES[this.currentRow][this.currentColumn[0]].color = this.color_1;
      SQUARES[this.currentRow][this.currentColumn[0]].pillId = this.id;
      SQUARES[this.currentRow][this.currentColumn[0]].state = 'falling';
      SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = true;
      SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = 'pill';
      SQUARES[this.currentRow][this.currentColumn[1]].color = this.color_2;
      SQUARES[this.currentRow][this.currentColumn[1]].pillId = this.id;
      SQUARES[this.currentRow][this.currentColumn[1]].state = 'falling';
      const img_1 = document.createElement('img')
      const img_2 = document.createElement('img')
      img_1.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_1.substr(0,2)}_left.png`;
      img_2.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_2.substr(0,2)}_right.png`;
      document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).appendChild(img_1)
      document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).appendChild(img_2)
    }
    PILLS.forEach(element => element.reactivatePill())
  };
  colorizeVerticalPill = (source, singleCube, useChangeSquaresInside, SQUARES) => {
    let whiteBlock = undefined
    if(singleCube){
      if(!SQUARES[this.currentRow[0]][this.currentColumn].color) whiteBlock = 'lower'
      else if(!SQUARES[this.currentRow[1]][this.currentColumn].color) whiteBlock = 'upper'
    }
    if(whiteBlock !== 'lower'){
      SQUARES[this.currentRow[0]][this.currentColumn].isOccupied = false;
      SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity = null;
      SQUARES[this.currentRow[0]][this.currentColumn].color = undefined;
      SQUARES[this.currentRow[0]][this.currentColumn].pillId = undefined;
      SQUARES[this.currentRow[0]][this.currentColumn].state = undefined;
      document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).removeChild(document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).lastChild);
    }
    SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
    SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
    SQUARES[this.currentRow[1]][this.currentColumn].color = undefined;
    SQUARES[this.currentRow[1]][this.currentColumn].pillId = undefined;
    SQUARES[this.currentRow[1]][this.currentColumn].state = undefined;
    const img = document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).lastChild
    if(img) document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).removeChild(img);
    if(useChangeSquaresInside) this.changeSquares(source, 'vertical');
    if(whiteBlock === 'lower'){
      SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = true;
      SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = 'pill';
      SQUARES[this.currentRow[1]][this.currentColumn].color = this.color_2;
      SQUARES[this.currentRow[1]][this.currentColumn].pillId = this.id;
      SQUARES[this.currentRow[1]][this.currentColumn].state = 'falling';
      const img = document.createElement('img');
      img.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_2.substr(0,2)}_dot.png`;
      document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).appendChild(img);
    } else if(whiteBlock === 'upper'){
      SQUARES[this.currentRow[0]][this.currentColumn].isOccupied = true;
      SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity = 'pill';
      SQUARES[this.currentRow[0]][this.currentColumn].color = this.color_1;
      SQUARES[this.currentRow[0]][this.currentColumn].pillId = this.id;
      SQUARES[this.currentRow[0]][this.currentColumn].state = 'falling';
      const img = document.createElement('img');
      img.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_1.substr(0,2)}_dot.png`;
      document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).appendChild(img);
    } else {
      SQUARES[this.currentRow[0]][this.currentColumn].isOccupied = true;
      SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity = 'pill';
      SQUARES[this.currentRow[0]][this.currentColumn].color = this.color_1;
      SQUARES[this.currentRow[0]][this.currentColumn].pillId = this.id;
      SQUARES[this.currentRow[0]][this.currentColumn].state = 'falling';
      SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = true;
      SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = 'pill';
      SQUARES[this.currentRow[1]][this.currentColumn].color = this.color_2;
      SQUARES[this.currentRow[1]][this.currentColumn].pillId = this.id;
      SQUARES[this.currentRow[1]][this.currentColumn].state = 'falling';
      const img_1 = document.createElement('img');
      const img_2 = document.createElement('img');
      img_1.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_1.substr(0,2)}_down.png`;
      img_2.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${this.color_2.substr(0,2)}_up.png`;
      document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).appendChild(img_1);
      document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).appendChild(img_2);
    }
    PILLS.forEach(element => element.reactivatePill())
  };
  changeSquares = (source, position) => {
    if(position === 'horizontal'){
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
        case 'moveUpward':
          this.currentRow -= 1;
          break;
        default:
          break;
      }
    } else{
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
        case 'moveUpward':
          this.currentRow = [this.currentRow[1], this.currentRow[1]-1];
          break;
        default:
          break;
      }
    }
  }
  checkIfCanRemove = () => {
    const idOfSquaresToClear = {
      horizontally: [],
      vertically: [],
    }
    if(this.position === 'horizontal'){
      if(this.color_1 === this.color_2){
        idOfSquaresToClear.vertically.push(...compareColors(this.currentRow, [...this.currentColumn], 0, this.currentRow,'down', false, 0, this.color_1, 'horizontal' ))
        idOfSquaresToClear.vertically.push(...compareColors(this.currentRow, [...this.currentColumn], 1, this.currentRow,'down', false, 0, this.color_1, 'horizontal' ))
        idOfSquaresToClear.horizontally.push(...compareColors(this.currentRow, [...this.currentColumn], 0, this.currentRow,'left', false, 0, this.color_1, 'horizontal' ))
      } else if(this.color_1 !== this.color_2){
        idOfSquaresToClear.horizontally.push(...compareColors(this.currentRow, [...this.currentColumn], 0, this.currentRow,'left', true, 0, this.color_1, 'horizontal' ))
        idOfSquaresToClear.horizontally.push(...compareColors(this.currentRow, [...this.currentColumn], 1, this.currentRow,'right', true, 0, this.color_2, 'horizontal' ))
        idOfSquaresToClear.vertically.push(...compareColors(this.currentRow, [...this.currentColumn], 0, this.currentRow,'down', true, 0, this.color_1, 'horizontal' ))
        idOfSquaresToClear.vertically.push(...compareColors(this.currentRow, [...this.currentColumn], 1, this.currentRow,'down', true, 0, this.color_2, 'horizontal' ))
      }
    } else if(this.position === 'vertical'){
      if(this.color_1 === this.color_2){
        idOfSquaresToClear.vertically.push(...compareColors([...this.currentRow], this.currentColumn, 0, [...this.currentRow], 'down', false, 0, this.color_1, 'vertical'))
        idOfSquaresToClear.horizontally.push(...compareColors([...this.currentRow], this.currentColumn, 0, [...this.currentRow], 'left', false, 0, this.color_1, 'vertical'))
        idOfSquaresToClear.horizontally.push(...compareColors([...this.currentRow], this.currentColumn, 1, [...this.currentRow], 'left', false, 0, this.color_1, 'vertical'))
      } else if(this.color_1 !== this.color_2){
        idOfSquaresToClear.vertically.push(...compareColors([...this.currentRow], this.currentColumn, 0, [...this.currentRow], 'down', true, 0, this.color_1, 'vertical'))
        idOfSquaresToClear.vertically.push(...compareColors([...this.currentRow], this.currentColumn, 1, [...this.currentRow], 'up', true, 0, this.color_2, 'vertical'))
        idOfSquaresToClear.horizontally.push(...compareColors([...this.currentRow], this.currentColumn, 0, [...this.currentRow], 'left', true, 0, this.color_1, 'vertical'))
        idOfSquaresToClear.horizontally.push(...compareColors([...this.currentRow], this.currentColumn, 1, [...this.currentRow], 'left', true, 0, this.color_2, 'vertical'))
      }
    }
    idOfSquaresToClear.horizontally.sort((a,b) => a.id - b.id);
    idOfSquaresToClear.vertically.sort((a,b) => a.id - b.id);
    idOfSquaresToClear.horizontally.forEach((element, index) => {
      if(idOfSquaresToClear.horizontally[index+1]){
        if(element.id === idOfSquaresToClear.horizontally[index+1].id) idOfSquaresToClear.horizontally.splice(index+1, 1);
      }
    })
    idOfSquaresToClear.vertically.forEach((element, index) => {
      if(idOfSquaresToClear.vertically[index+1]){
        if(element.id === idOfSquaresToClear.vertically[index+1].id) idOfSquaresToClear.vertically.splice(index+1, 1);
      }
    })
    idOfSquaresToClear.horizontally.forEach(element => {
      if(SQUARES[element.row][element.column].typeOfEntity === 'bug'){
        BUGS.forEach((bug, index) => {
          if(bug.id === element.id){
            BUGS.splice(index, 1);
            score = score + 100;
            SCORE_BOARD.innerText = '';
            if(!BUGS.some(e => e.color === 'yellow')) document.getElementById('yellow-virus').style.display = 'none';
            if(!BUGS.some(e => e.color === 'blue')) document.getElementById('blue-virus').style.display = 'none';
            if(!BUGS.some(e => e.color === 'brown')) document.getElementById('brown-virus').style.display = 'none';
            updateScore();
            updateVirusesCount();
          }
        })
      }
      const child = document.getElementById(`${element.id}`).lastChild;
      if(child) child.src.split('/')[7].split('_')[0] === 'covid' ? child.src = `../img/${child.src.split('/')[7].split('_')[1].substr(0,2)}_x.png` : child.src = `../img/${child.src.split('/')[7].split('_')[0]}_o.png`;
      SQUARES[element.row][element.column].isOccupied = false;
      SQUARES[element.row][element.column].typeOfEntity = null;
      SQUARES[element.row][element.column].color = undefined;
      SQUARES[element.row][element.column].pillId = undefined;
      SQUARES[element.row][element.column].state = undefined;
    })
    idOfSquaresToClear.vertically.forEach(element => {
      if(SQUARES[element.row][element.column].typeOfEntity === 'bug'){
        BUGS.forEach((bug, index) => {
          if(bug.id === element.id){
            BUGS.splice(index, 1);
            score = score + 100;
            SCORE_BOARD.innerText = '';
            if(!BUGS.some(e => e.color === 'yellow')) document.getElementById('yellow-virus').style.display = 'none';
            if(!BUGS.some(e => e.color === 'blue')) document.getElementById('blue-virus').style.display = 'none';
            if(!BUGS.some(e => e.color === 'brown')) document.getElementById('brown-virus').style.display = 'none';
            updateScore();
            updateVirusesCount();
          }
        })
      }
      const child = document.getElementById(`${element.id}`).lastChild;
      if(child) child.src.split('/')[7].split('_')[0] === 'covid' ? child.src = `../img/${child.src.split('/')[7].split('_')[1].substr(0,2)}_x.png` : child.src = `../img/${child.src.split('/')[7].split('_')[0]}_o.png`;
      SQUARES[element.row][element.column].isOccupied = false;
      SQUARES[element.row][element.column].typeOfEntity = null;
      SQUARES[element.row][element.column].color = undefined;
      SQUARES[element.row][element.column].pillId = undefined;
      SQUARES[element.row][element.column].state = undefined;
    });
    PILLS.forEach((element, index) => {
      if(element.position === 'horizontal'){
        if(!SQUARES[element.currentRow][element.currentColumn[0]].isOccupied && !SQUARES[element.currentRow][element.currentColumn[1]].isOccupied) PILLS.splice(index, 1)
      } else if(element.position === 'vertical'){
        if(!SQUARES[element.currentRow[0]][element.currentColumn].isOccupied && !SQUARES[element.currentRow[1]][element.currentColumn].isOccupied) PILLS.splice(index, 1)
      }
    })
    PILLS.forEach(element => {
      if(element.position === 'horizontal' && (SQUARES[element.currentRow][element.currentColumn[0]].isOccupied || SQUARES[element.currentRow][element.currentColumn[1]].isOccupied)){
        if(!SQUARES[element.currentRow][element.currentColumn[0]].color){
          document.getElementById(`${SQUARES[element.currentRow][element.currentColumn[1]].id}`).lastChild.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${element.color_2.substr(0,2)}_dot.png`;
        } else if(!SQUARES[element.currentRow][element.currentColumn[1]].color){
          document.getElementById(`${SQUARES[element.currentRow][element.currentColumn[0]].id}`).lastChild.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${element.color_1.substr(0,2)}_dot.png`;
        }
      } else if(element.position === 'vertical' && (SQUARES[element.currentRow[0]][element.currentColumn].isOccupied || SQUARES[element.currentRow[1]][element.currentColumn].isOccupied)){
        if(!SQUARES[element.currentRow[0]][element.currentColumn].color){
          document.getElementById(`${SQUARES[element.currentRow[1]][element.currentColumn].id}`).lastChild.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${element.color_2.substr(0,2)}_dot.png`;
        } else if(!SQUARES[element.currentRow[1]][element.currentColumn].color){
          document.getElementById(`${SQUARES[element.currentRow[0]][element.currentColumn].id}`).lastChild.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/${element.color_1.substr(0,2)}_dot.png`;
        }
      }
    })
    setTimeout(() => {
      SQUARES.forEach(a => {
        a.forEach(b => {
          if(!b.isOccupied) document.getElementById(`${b.id}`).innerHTML = ''
        })
      })
    }, 100)
    sortPills()
    PILLS.forEach(element => element.reactivatePill())
    if(BUGS.length === 0){
      clearInterval(interval)
      PILLS.forEach(element => element.reactivatePill())
      document.getElementById('alert').style.display = 'inline'
      document.getElementById('alert').setAttribute('src', 'https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/sc.png');
      if(score > topScore) localStorage.setItem('topScore', score);
    }
  };
  reactivatePill = () => {
    if(this.state !== 'falling'){
      if(this.position === 'vertical'){
        if(SQUARES[this.currentRow[0]][this.currentColumn].color && SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity !== 'bug' && SQUARES[this.currentRow[1]][this.currentColumn].color){
          if(this.currentRow[0] !== 16 && SQUARES[this.currentRow[0]+1][this.currentColumn].state !== 'static'){
            SQUARES[this.currentRow[0]][this.currentColumn].state = 'falling'
            SQUARES[this.currentRow[1]][this.currentColumn].state = 'falling'
            this.canMove = false
            this.state = 'falling'
            const reactivatedInterval = setInterval(() => {
              if(this.currentRow[0] !== 16 && SQUARES[this.currentRow[0]+1][this.currentColumn].state !== 'static'){
                this.colorizeVerticalPill('fallDown', false, true, SQUARES)
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
              } else {
                clearInterval(reactivatedInterval)
                this.state = 'static'
                SQUARES[this.currentRow[0]][this.currentColumn].state = 'static'
                SQUARES[this.currentRow[1]][this.currentColumn].state = 'static'
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
                this.canMove = true
              }
            }, 100)
          }
        } else if(SQUARES[this.currentRow[0]][this.currentColumn].color && !SQUARES[this.currentRow[1]][this.currentColumn].color){
          if(this.currentRow[0] !== 16 && SQUARES[this.currentRow[0]+1][this.currentColumn].state !== 'falling'){
            SQUARES[this.currentRow[0]][this.currentColumn].state = 'falling'
            this.canMove = false
            this.state = 'falling'
            const reactivatedInterval = setInterval(() => {
              if(this.currentColumn[0] !== 16 && SQUARES[this.currentRow[0]+1][this.currentColumn].state !== 'falling'){
                this.colorizeVerticalPill('fallDown', true, true, SQUARES)
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
              } else {
                clearInterval(reactivatedInterval)
                this.state = 'static'
                SQUARES[this.currentRow[0]][this.currentColumn].state = 'static'
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
                this.canMove = true
              }
            }, 100)
          }
        } else if(!SQUARES[this.currentRow[0]][this.currentColumn].color && SQUARES[this.currentRow[1]][this.currentColumn].color){
          if(this.currentRow[1] !== 16 && SQUARES[this.currentRow[1]+1][this.currentColumn].state !== 'static'){
            SQUARES[this.currentRow[1]][this.currentColumn].state = 'falling'
            this.canMove = false
            this.state = 'falling'
            const reactivatedInterval = setInterval(() => {
              if(this.currentRow[1] !== 16 && SQUARES[this.currentRow[1]+1][this.currentColumn].state !== 'static'){
                this.colorizeVerticalPill('fallDown', true, true, SQUARES)
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
              } else {
                clearInterval(reactivatedInterval)
                this.state = 'static'
                SQUARES[this.currentRow[1]][this.currentColumn].state = 'static'
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
                this.canMove = true
              }
            }, 100)
          }
        }
      } else if(this.position === 'horizontal'){
        if(SQUARES[this.currentRow][this.currentColumn[0]].color && SQUARES[this.currentRow][this.currentColumn[1]].color && SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity !== 'bug' && SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity !== 'bug'){
          if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[0]].state !== 'static' && SQUARES[this.currentRow+1][this.currentColumn[1]].state !== 'static'){
            SQUARES[this.currentRow][this.currentColumn[0]].state = 'falling'
            SQUARES[this.currentRow][this.currentColumn[1]].state = 'falling'
            this.canMove = false
            this.state = 'falling'
            const reactivatedInterval = setInterval(() => {
              if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[0]].state !== 'static' && SQUARES[this.currentRow+1][this.currentColumn[1]].state !== 'static'){
                this.colorizeHorizontalPill('fallDown', false, true, SQUARES)
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
              } else {
                clearInterval(reactivatedInterval)
                this.state = 'static'
                SQUARES[this.currentRow][this.currentColumn[0]].state = 'static'
                SQUARES[this.currentRow][this.currentColumn[1]].state = 'static'
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
                this.canMove = true
              }
            }, 100)
          }
        } else if(SQUARES[this.currentRow][this.currentColumn[0]].color && !SQUARES[this.currentRow][this.currentColumn[1]].color && SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity !== 'bug'){
          if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[0]].state !== 'static'){
            SQUARES[this.currentRow][this.currentColumn[0]].state = 'falling'
            this.canMove = false
            this.state = 'falling'
            const reactivatedInterval = setInterval(() => {
              if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[0]].state !== 'static'){
                this.colorizeHorizontalPill('fallDown', true, true, SQUARES)
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
              } else {
                clearInterval(reactivatedInterval)
                this.state = 'static'
                SQUARES[this.currentRow][this.currentColumn[0]].state = 'static'
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
                this.canMove = true
              }
            }, 100)
          }
        } else if(!SQUARES[this.currentRow][this.currentColumn[0]].color && SQUARES[this.currentRow][this.currentColumn[1]].color && SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity !== 'bug'){
          if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[1]].state !== 'static'){
            SQUARES[this.currentRow][this.currentColumn[1]].state = 'falling'
            this.canMove = false
            this.state = 'falling'
            const reactivatedInterval = setInterval(() => {
              if(this.currentRow !== 16 && SQUARES[this.currentRow+1][this.currentColumn[1]].state !== 'static'){
                this.colorizeHorizontalPill('fallDown', true, true, SQUARES)
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
              } else {
                clearInterval(reactivatedInterval)
                this.state = 'static'
                SQUARES[this.currentRow][this.currentColumn[1]].state = 'static'
                if(PILLS.every(element => element.state === 'static')) this.checkIfCanRemove()
                this.canMove = true
              }
            }, 100)
          }
        }
      }
    }
  };
}

//
class Bug {
  constructor(color) {
    this.color = color;
  }
  generateBug = () => {
    let [ ROW, COLUMN ] = drawRandomSquare();
    while(SQUARES[ROW][COLUMN].isOccupied){
      [ ROW, COLUMN ] = drawRandomSquare();
    }
    this.id = SQUARES[ROW][COLUMN].id
    SQUARES[ROW][COLUMN].isOccupied = true
    SQUARES[ROW][COLUMN].typeOfEntity = 'bug'
    SQUARES[ROW][COLUMN].color = this.color
    SQUARES[ROW][COLUMN].state = 'static'
    const virus = document.createElement('img')
    virus.src = `https://raw.githubusercontent.com/mareczek2115/dr-mario/main/img/covid_${this.color}.png`;
    document.getElementById(`${SQUARES[ROW][COLUMN].id}`).appendChild(virus)
  }
}

//
const drawRandomSquare = () => {
  const ROW = Math.round(Math.random() * 12) + 4;
  const COLUMN = Math.round(Math.random() * 7) + 1;
  return [ROW, COLUMN]
}

//
const compareColors = (row, column, index, pattern, direction, multiColor, level, color, position) => {
  let dataToReturn = []
  let originalRow = row
  let originalColumn = column
  if(position === 'vertical'){
    while(SQUARES[row[index]][column].isOccupied && SQUARES[row[index]][column].typeOfEntity !== null){
      if(color === SQUARES[row[index]][column].color){
        dataToReturn.push({
          id: SQUARES[row[index]][column].id,
          row: row[index],
          column: column,
          color: color
        });
      } else if(color !== SQUARES[row[index]][column].color) break;
      switch(direction){
        case 'down':
          row[index] += 1;
          break;
        case 'up':
          row[index] -= 1;
          break;
        case 'left':
          column = column - 1;
          break;
        case 'right':
          column = column + 1;
          break;
      }
    };
    if(multiColor && direction === 'down'){
        if(dataToReturn.length >= 4) return [...dataToReturn]
        else return []
    } else if(multiColor && direction === 'up' && level === 0){
        if(dataToReturn.length >= 4) return [...dataToReturn]
        else return []
    } else if(direction === 'left' && level === 0){
        dataToReturn.push(...compareColors([...pattern], originalColumn, index, [...pattern], 'right', true, 1, color, 'vertical'))
        dataToReturn.sort((a, b) => a.id - b.id)
        dataToReturn.forEach((element, index) => {
          if(dataToReturn[index+1])
            if(element.id === dataToReturn[index+1].id) dataToReturn.splice(index+1, 1)
        })
        if(dataToReturn.length >= 4) return [...dataToReturn]
        else return []
    } else if(!multiColor && direction === 'down'){
        dataToReturn.push(...compareColors([...pattern], originalColumn, 1, [...pattern], 'up', false, 0, color, 'vertical'))
        if(dataToReturn.length >= 4) return[...dataToReturn.sort((a, b) => a.id - b.id)]
        else return []
    }
  } else if(position === 'horizontal'){
      while(SQUARES[row][column[index]].isOccupied && SQUARES[row][column[index]].typeOfEntity !== null){
        if(color === SQUARES[row][column[index]].color){
          dataToReturn.push({
            id: SQUARES[row][column[index]].id,
            row: row,
            column: column[index],
            color: color
          });
        } else if(color !== SQUARES[row][column[index]].color) break;
        switch(direction){
          case 'down':
            row += 1;
            break;
          case 'up':
            row -= 1;
            break;
          case 'left':
            column[index] -= 1;
            break;
          case 'right':
            column[index] += 1;
            break;
        }
      };
      if(multiColor && direction ==='left'){
          if(dataToReturn.length >= 4) return [...dataToReturn.sort((a,b) => a.id - b.id)]
          else return []
      } else if(multiColor && direction === 'right'){
          if(dataToReturn.length >= 4) return [...dataToReturn]
          else return []
      } else if(direction === 'down'){
          dataToReturn.push(...compareColors(originalRow, [...column], index, originalRow, 'up', true, 0, color, 'horizontal'))
          dataToReturn.sort((a, b) => a.id - b.id)
          dataToReturn.forEach((element, index) => {
            if(dataToReturn[index+1])
              if(element.id === dataToReturn[index+1].id) dataToReturn.splice(index+1, 1)
          })
          if(dataToReturn.length >= 4) return [...dataToReturn]
          else return []
      } else if(!multiColor && direction === 'left'){
          dataToReturn.push(...compareColors(originalRow, [...originalColumn], 1, originalRow, 'right', false, 0, color, 'horizontal'))
          if(dataToReturn.length >= 4) return [...dataToReturn.sort((a,b) => a.id - b.id)]
          else return []
      }
  }
  return [...dataToReturn]
}

//
const sortPills = () => {
  PILLS.sort((a,b) => {
    let row_1 = undefined
    let row_2 = undefined
    let column_1 = undefined
    let column_2 = undefined
    a.position === 'horizontal' ? row_1 = a.currentRow : row_1 = a.currentRow[0]
    b.position === 'horizontal' ? row_2 = b.currentRow : row_2 = b.currentRow[0]
    a.position === 'horizontal' ? column_1 = a.currentColumn[0] : column_1 = a.currentColumn
    b.position === 'horizontal' ? column_2 = b.currentColumn[0] : column_2 = b.currentColumn
    if(row_1 > row_2) return -1
    else if(row_1 < row_2) return 1
    else {
      if(column_1 > column_2) return -1
      else if(column_1 < column_2) return 1
    }
  })
}

export { Square, Bug, Pill, score, throwingPill };

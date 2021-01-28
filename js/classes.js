'use strict';
import { SQUARES, BUGS, PILLS, interval } from './app.js ';
const MAIN_BOARD = document.getElementById('main-board');

//
class Square {
  constructor(id, isOccupied, typeOfEntity, color) {
    this.id = id;
    this.isOccupied = isOccupied;
    this.typeOfEntity = typeOfEntity;
    this.color = color
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
    this.changeColor = false
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
        if(this.position === 'horizontal' && !SQUARES[this.currentRow+1][this.currentColumn[0]].isOccupied && !SQUARES[this.currentRow+1][this.currentColumn[1]].isOccupied)
          this.colorizeHorizontalPill('fallDown');
        else if(this.position === 'vertical' && !SQUARES[this.currentRow[0]+1][this.currentColumn].isOccupied)
          this.colorizeVerticalPill('fallDown');
        else{
          clearInterval(this.interval);
          this.state = 'static';
          this.checkIfCanRemove()
        }
      }, 1000)
  };
  rotate = code => {
    if(this.state !== 'static' && this.currentRow !== 1){
      let wasPositionChanged = false
      if(this.position === 'horizontal' && !SQUARES[this.currentRow-1][this.currentColumn[0]].isOccupied && this.canMove){
        document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).style.backgroundColor = 'white';
        SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = false;
        SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = null;
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
      } else if(this.position === 'vertical' && !SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied && this.canMove){
        document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).style.backgroundColor = 'white';
        SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
        SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
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
      } else if(this.position === 'vertical' && SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied && !SQUARES[this.currentRow[0]][this.currentColumn-1].isOccupied && this.canMove && !wasPositionChanged){
        document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).style.backgroundColor = 'white';
        SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
        SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
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
      this.position === 'horizontal' ? this.colorizeHorizontalPill() : this.colorizeVerticalPill();
    }
  };
  move = code => {
    if(this.state != 'static'){
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
              this.checkIfCanRemove()
              this.canMove = true;
            }
          }, 50);
        }
      } else if(this.position === 'vertical'){
        if((code === 'ArrowLeft' || code === 'KeyA') && SQUARES[this.currentRow[0]][this.currentColumn-1].isOccupied === false && SQUARES[this.currentRow[1]][this.currentColumn-1].isOccupied === false && this.canMove)
          this.colorizeVerticalPill('moveLeft');
        if((code === 'ArrowRight' || code === 'KeyD') && SQUARES[this.currentRow[0]][this.currentColumn+1].isOccupied === false && SQUARES[this.currentRow[1]][this.currentColumn+1].isOccupied === false && this.canMove){
          this.colorizeVerticalPill('moveRight');
        }

        else if(code === 'ArrowDown' || code === 'KeyS'){
          this.canMove = false;
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            if(SQUARES[this.currentRow[0]+1][this.currentColumn].isOccupied === false)
              this.colorizeVerticalPill('fallDown');
            else{
              clearInterval(this.interval);
              this.state = 'static';
              this.checkIfCanRemove()
              this.canMove = true;
            };
          }, 50);
        }
      }
    }
  };
  colorizeHorizontalPill = source => {
    if(source !== 'generatePill'){
      SQUARES[this.currentRow][this.currentColumn[0]].isOccupied = false;
      SQUARES[this.currentRow][this.currentColumn[0]].typeOfEntity = null;
      SQUARES[this.currentRow][this.currentColumn[0]].color = undefined;
      SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = false;
      SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = null;
      SQUARES[this.currentRow][this.currentColumn[1]].color = undefined;
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
    SQUARES[this.currentRow][this.currentColumn[0]].color = this.color_1;
    SQUARES[this.currentRow][this.currentColumn[1]].isOccupied = true;
    SQUARES[this.currentRow][this.currentColumn[1]].typeOfEntity = 'pill';
    SQUARES[this.currentRow][this.currentColumn[1]].color = this.color_2;
    document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[0]].id}`).style.backgroundColor = `${this.color_1}`;
    document.getElementById(`${SQUARES[this.currentRow][this.currentColumn[1]].id}`).style.backgroundColor = `${this.color_2}`;
  };
  colorizeVerticalPill = source => {
    SQUARES[this.currentRow[0]][this.currentColumn].isOccupied = false;
    SQUARES[this.currentRow[0]][this.currentColumn].typeOfEntity = null;
    SQUARES[this.currentRow[0]][this.currentColumn].color = undefined;
    SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = false;
    SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = null;
    SQUARES[this.currentRow[1]][this.currentColumn].color = undefined;
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
    SQUARES[this.currentRow[0]][this.currentColumn].color = this.color_1;
    SQUARES[this.currentRow[1]][this.currentColumn].isOccupied = true;
    SQUARES[this.currentRow[1]][this.currentColumn].typeOfEntity = 'pill';
    SQUARES[this.currentRow[1]][this.currentColumn].color = this.color_2;
    document.getElementById(`${SQUARES[this.currentRow[0]][this.currentColumn].id}`).style.backgroundColor = `${this.color_1}`;
    document.getElementById(`${SQUARES[this.currentRow[1]][this.currentColumn].id}`).style.backgroundColor = `${this.color_2}`;
  };
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
    idOfSquaresToClear.horizontally.sort((a,b) => a.id - b.id)
    idOfSquaresToClear.vertically.sort((a,b) => a.id - b.id)
    idOfSquaresToClear.horizontally.forEach((element, index) => {
      if(idOfSquaresToClear.horizontally[index+1]){
        if(element.id === idOfSquaresToClear.horizontally[index+1].id) idOfSquaresToClear.horizontally.splice(index+1, 1)
      }
    })
    idOfSquaresToClear.vertically.forEach((element, index) => {
      if(idOfSquaresToClear.vertically[index+1]){
        if(element.id === idOfSquaresToClear.vertically[index+1].id) idOfSquaresToClear.vertically.splice(index+1, 1)
      }
    })
    idOfSquaresToClear.horizontally.forEach(element => {
      if(SQUARES[element.row][element.column].typeOfEntity === 'bug'){
        BUGS.forEach((bug, index) => {
          if(bug.id === element.id) BUGS.splice(index, 1)
        })
      }
      document.getElementById(`${element.id}`).style.backgroundColor = 'white'
      SQUARES[element.row][element.column].isOccupied = false
      SQUARES[element.row][element.column].typeOfEntity = null
      SQUARES[element.row][element.column].color = undefined
    })
    idOfSquaresToClear.vertically.forEach(element => {
      if(SQUARES[element.row][element.column].typeOfEntity === 'bug'){
        BUGS.forEach((bug, index) => {
          if(bug.id === element.id) BUGS.splice(index, 1)
        })
      }
      document.getElementById(`${element.id}`).style.backgroundColor = 'white'
      SQUARES[element.row][element.column].isOccupied = false
      SQUARES[element.row][element.column].typeOfEntity = null
      SQUARES[element.row][element.column].color = undefined
    })
    if(BUGS.length === 0){
      clearInterval(interval)
      alert('koniec, nie ma juz robaków na planszy')
    }
  };
  reactivatePill = () => {
    if(this.position === 'horizontal' && !SQUARES[this.currentRow][this.currentColumn[0]].isOccupied && !SQUARES[this.currentRow][this.currentColumn[1]].isOccupied){
      this.state = 'falling';
      this.fallDown()
    } else if(this.position === 'vertical' && !SQUARES[this.currentRow[0]][this.currentColumn].isOccupied){
      this.state = 'falling';
      this.fallDown()
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
    document.getElementById(`${SQUARES[ROW][COLUMN].id}`).style.backgroundColor = `${this.color}`
  }
}

//
const drawRandomSquare = () => {
  const ROW = Math.round(Math.random() * 12) + 4;
  const COLUMN = Math.round(Math.random() * 7) + 1;
  return [ROW, COLUMN]
}

const compareColors = (row, column, index, pattern, direction, multiColor, level, color, position) => {
  let tempArr = []
  let kupa = row
  let dupa = column
  if(position === 'vertical'){
    while(SQUARES[row[index]][column].isOccupied && SQUARES[row[index]][column].typeOfEntity !== null){
      if(color === SQUARES[row[index]][column].color){
        tempArr.push({
          id: SQUARES[row[index]][column].id,
          row: row[index],
          column: column,
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
        if(tempArr.length >= 4) return [...tempArr]
        else return []
    } else if(multiColor && direction === 'up' && level === 0){
        if(tempArr.length >= 4) return [...tempArr]
        else return []
    } else if(direction === 'left' && level === 0){
        tempArr.push(...compareColors([...pattern], dupa, index, [...pattern], 'right', true, 1, color, 'vertical'))
        tempArr.sort((a, b) => a.id - b.id)
        tempArr.forEach((element, index) => {
          if(tempArr[index+1])
            if(element.id === tempArr[index+1].id) tempArr.splice(index+1, 1)
        })
        if(tempArr.length >= 4) return [...tempArr]
        else return []
    } else if(!multiColor && direction === 'down'){
        tempArr.push(...compareColors([...pattern], dupa, 1, [...pattern], 'up', false, 0, color, 'vertical'))
        if(tempArr.length >= 4) return[...tempArr.sort((a, b) => a.id - b.id)]
        else return []
    }
  } else if(position === 'horizontal'){
      while(SQUARES[row][column[index]].isOccupied && SQUARES[row][column[index]].typeOfEntity !== null){
        if(color === SQUARES[row][column[index]].color){
          tempArr.push({
            id: SQUARES[row][column[index]].id,
            row: row,
            column: column[index],
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
          if(tempArr.length >= 4) return [...tempArr.sort((a,b) => a.id - b.id)]
          else return []
      } else if(multiColor && direction === 'right'){
          if(tempArr.length >= 4) return [...tempArr]
          else return []
      } else if(direction === 'down'){
          tempArr.push(...compareColors(kupa, [...column], index, kupa, 'up', true, 0, color, 'horizontal'))
          tempArr.sort((a, b) => a.id - b.id)
          tempArr.forEach((element, index) => {
            if(tempArr[index+1])
              if(element.id === tempArr[index+1].id) tempArr.splice(index+1, 1)
          })
          if(tempArr.length >= 4) return [...tempArr]
          else return []
      } else if(!multiColor && direction === 'left'){
          tempArr.push(...compareColors(kupa, [...dupa], 1, kupa, 'right', false, 0, color, 'horizontal'))
          if(tempArr.length >= 4) return [...tempArr.sort((a,b) => a.id - b.id)]
          else return []
      }
  }
  return [...tempArr]
}

export { Square, Bug, Pill };

/* global
    createCanvas, background, height, fill, ellipse, RIGHT_ARROW
    keyCode, UP_ARROW, colorMode, RGB, color, rect, width, height, noStroke, get
    collideCircleCircle, mouseX, mouseY, noFill, stroke, strokeWeight, text
    textSize, LEFT_ARROW, DOWN_ARROW, collideRectRect, collideRectCircle,
    HALF_PI, QUARTER_PI, arc, PI
*/

//we need array with pellets, powerup to eat ghost

let backColor;
let pacman, inky, blinky;
let dot, foodX, foodY, moving, direction, score;
let barriers, pacCollide, pacTurn, ghostCollide;
//let pacX, pacY, pacSize;

function setup() {
  createCanvas(450, 300);
  colorMode(RGB, 255, 255, 255, 255);
  backColor = color(0, 0, 0);
  foodX = 20;
  foodY = 20;
  moving = true;
  score = 0;

  pacman = new Pacman();

  // inky = new Ghost(170, 100, "cyan");
  blinky = new Ghost(200, 55, "red");

  dot = [];

  for (let i = 0; i < 162; i++) {
    dot.push(new Food(foodX, foodY));

    if (foodX < 390) {
      foodX += 22;
    } else if (foodX > 390) {
      foodX = 20;
      foodY += 22;
    }
  }
}

function draw() {
  if (score < 100) {
    background(backColor);
    handleFood();
    drawMap();

    pacman.show();
    pacman.move();

    // inky.show();
    // inky.move(pacman);

    blinky.show();
    blinky.move(pacman);
    //Fake PacMan for testing
    // fill('gold')
    // ellipse(mouseX, mouseY, 20)

    // console.log(255 != get(96, 0)[2])
    showText();
  }
}

function drawMap() {
  //array holding all rectangles on map to check collisions with later on
  barriers = [];
  noFill();
  stroke(0, 0, 255);
  strokeWeight(10);

  //Outline of box
  rect(5, 4, 405, 211);
  barriers.push([5, 8, 405, 0]);
  barriers.push([8, 5, 0, 211]);
  barriers.push([407, 5, 0, 211]);
  barriers.push([5, 211, 405, 0]);

  //barriers.push([5, 5, 405, 211]);

  fill(0, 0, 255, 255);
  noStroke();

  //4 Pillars
  rect(101, 5, 14, 44, 0, 0, 90, 90);
  rect(101, 167, 14, 44, 90, 90, 0, 0);
  rect(299, 5, 14, 44, 0, 0, 90, 90);
  rect(299, 167, 14, 44, 90, 90, 0, 0);

  barriers.push([101, 5, 14, 44]);
  barriers.push([101, 167, 14, 44]);
  barriers.push([299, 5, 14, 44]);
  barriers.push([299, 167, 14, 44]);

  //L Shape Pieces
  rect(35, 35, 38, 14, 0, 90, 90, 0);
  rect(35, 35, 14, 57, 0, 0, 90, 90);
  rect(35, 167, 38, 14, 0, 90, 90, 0);
  rect(35, 123, 14, 56, 90, 90, 0, 0);
  rect(341, 35, 38, 14, 90, 0, 0, 90);
  rect(365, 35, 14, 57, 0, 0, 90, 90);
  rect(341, 167, 38, 14, 90, 0, 0, 90);
  rect(365, 123, 14, 56, 90, 90, 0, 0);

  barriers.push([35, 35, 38, 14]);
  barriers.push([35, 35, 14, 57]);
  barriers.push([35, 167, 38, 14]);
  barriers.push([35, 123, 14, 56]);
  barriers.push([341, 35, 38, 14]);
  barriers.push([365, 35, 14, 57]);
  barriers.push([341, 167, 38, 14]);
  barriers.push([365, 123, 14, 56]);

  //Long Middle Lines
  rect(145, 35, 122, 14, 90, 90, 90, 90);
  rect(145, 167, 122, 14, 90, 90, 90, 90);

  barriers.push([145, 35, 122, 14]);
  barriers.push([145, 167, 122, 14]);

  //Little Lines
  rect(77, 78, 38, 14, 90, 90, 90, 90);
  rect(77, 123, 38, 14, 90, 90, 90, 90);
  rect(299, 78, 38, 14, 90, 90, 90, 90);
  rect(299, 123, 38, 14, 90, 90, 90, 90);

  barriers.push([77, 78, 38, 14]);
  barriers.push([77, 123, 38, 14]);
  barriers.push([299, 78, 38, 14]);
  barriers.push([299, 123, 38, 14]);

  //Ghost Box
  rect(145, 78, 14, 58);
  rect(255, 78, 14, 58);
  rect(145, 78, 38, 14);
  rect(231, 78, 38, 14);
  rect(145, 123, 122, 14);

  barriers.push([145, 78, 14, 58]);
  barriers.push([255, 78, 14, 58]);
  barriers.push([145, 78, 38, 14]);
  barriers.push([231, 78, 38, 14]);
  barriers.push([145, 123, 122, 14]);

  fill(backColor);
  rect(183, 78, 48, 14);
  rect(160, 100, 94, 14);
}

function handleFood() {
  for (let i = 0; i < 162; i++) {
    dot[i].checkHit();
    dot[i].show();
  }
}

function showText() {
  textSize(25);
  fill(255, 255, 255);
  text("Score: " + score, 20, 250);
  textSize(10);
  text("PacX: " + pacman.x, 20, 280);
  text("PacY: " + pacman.y, 20, 295);
}

class Pacman {
  constructor() {
    this.x = 168;
    this.y = 152;
    this.size = 20;
    this.direction = 0;
    this.lastDir = 0;
    this.speed = 1;
    this.col = color('yellow')
    this.power = false
  }

  show() {
    fill(this.col);
    ellipse(this.x, this.y, this.size);
  }

  move() {
    //Pacman moves by himself in the direction designated by the last arrow press
    if (!this.touchWalls()) {
      //This if makes it so Pacman won't be able to move until he turns
      if (this.direction == 0) {
        this.x += this.speed;
        this.lastDir = 0;
      }
      if (this.direction == 90) {
        this.y -= this.speed;
        this.lastDir = 90;
      }
      if (this.direction == 180) {
        this.x -= this.speed;
        this.lastDir = 180;
      }
      if (this.direction == 270) {
        this.y += this.speed;
        this.lastDir = 270;
      }
    } else if (pacTurn) {
      if (this.lastDir == 0) this.x--;
      if (this.lastDir == 90) this.y++;
      if (this.lastDir == 180) this.x++;
      if (this.lastDir == 270) this.y--;
      pacCollide = false;
      pacTurn = false;
    }
    
    this.fixTurn();

    fill("black");
    if (this.lastDir == 0) {
      arc(this.x, this.y, 20, 20, QUARTER_PI - HALF_PI, QUARTER_PI);
    }
    if (this.lastDir == 90) {
      arc(this.x, this.y, 20, 20, QUARTER_PI - PI, QUARTER_PI - HALF_PI);
    }
    if (this.lastDir == 180) {
      arc(this.x, this.y, 20, 20, HALF_PI + QUARTER_PI, QUARTER_PI - PI);
    }
    if (this.lastDir == 270) {
      arc(this.x, this.y, 20, 20, QUARTER_PI, PI - QUARTER_PI);
    }
  }

  touchWalls() {
    for (let i = 0; i < barriers.length; i++) {
      let hit1 = collideRectRect(
        barriers[i][0],
        barriers[i][1],
        barriers[i][2],
        barriers[i][3],
        this.x - 12,
        this.y - 3,
        1,
        6
      );
      let hit2 = collideRectRect(
        barriers[i][0],
        barriers[i][1],
        barriers[i][2],
        barriers[i][3],
        this.x + 12,
        this.y - 3,
        1,
        6
      );
      let hit3 = collideRectRect(
        barriers[i][0],
        barriers[i][1],
        barriers[i][2],
        barriers[i][3],
        this.x - 3,
        this.y - 12,
        6,
        1
      );
      let hit4 = collideRectRect(
        barriers[i][0],
        barriers[i][1],
        barriers[i][2],
        barriers[i][3],
        this.x - 3,
        this.y + 12,
        6,
        1
      );
      pacCollide = pacCollide || hit1 || hit2 || hit3 || hit4;
    }

    return pacCollide;
  }
  
  fixTurn(){
    //Ensures Pacman doesn't get stuck turning left or right
    if(this.y < 26 && (this.direction == 0 || this.direction == 180))
      this.y = 21
    if(this.y < 70 && this.y > 56 && (this.direction == 0 || this.direction == 180))
      this.y = 63; 
    if(this.y < 114 && this.y > 100 && (this.direction == 0 || this.direction == 180))
      this.y = 107;
    if(this.y < 159 && this.y > 145 && (this.direction == 0 || this.direction == 180))
      this.y = 152;   
    if(this.y > 189 && (this.direction == 0 || this.direction == 180))
      this.y = 195
    
    //Ensures Pacman doesn't get stuck turning up or down
    if(this.x < 26 && (this.direction == 90 || this.direction == 270))
      this.x = 21
    if(this.x < 70 && this.x > 56 && (this.direction == 90 || this.direction == 270))
      this.x = 63; 
    if(this.x < 93 && this.x > 79 && (this.direction == 90 || this.direction == 270))
      this.x = 86; 
    if(this.x < 136 && this.x > 122 && (this.direction == 90 || this.direction == 270))
      this.x = 129; 
    if(this.x < 290 && this.x > 274 && (this.direction == 90 || this.direction == 270))
      this.x = 283; 
    if(this.x < 357 && this.x > 343 && (this.direction == 90 || this.direction == 270))
      this.x = 350;
    if(this.x < 333 && this.x > 319 && (this.direction == 90 || this.direction == 270))
      this.x = 326;   
    if(this.x > 387 && (this.direction == 90 || this.direction == 270))
      this.x = 393
  }
  
  touchGhost(){
    
  }
}

class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.v = .5;
    this.color = color;
    this.lastDirections = new Set(); //using sets so that the difference function can be invoked

  }
  
  show() {
    fill(this.color);
    rect(this.x, this.y, 20, 20, 90, 90, 0, 0);
  }

  move(pacman) {
    let movesTaken = 0; //variable to check if the ghost has moved yet this turn
    let totalDirections = new Set(["L", "R", "U", "D"]);

    ghostCollide = false;
    //if pacman is to the left of the ghost, and there is no wall in the way, move left
    if (pacman.x < this.x) {
      this.lastDirections.add("L");
      if (!this.touchWalls("L", 5)) {
        //checks if it would move into a wall
        this.x -= this.v;
        movesTaken += 1;
        
        console.log("left1");
      }
    }

    //if pacman is to the right of the ghost, and there is no wall in the way, move right
    else if (pacman.x > this.x) {
      this.lastDirections.add("R");
      if (!this.touchWalls("R", 5)) {
        this.x += this.v;
        movesTaken += 1;
        
        console.log("right1");
      }
    }

    //if pacman is to below the ghost, and there is no wall in the way, move down
    if (pacman.y > this.y) {
      this.lastDirections.add("D");
      if (!this.touchWalls("D", 5)) {
        this.y += this.v;
        movesTaken += 1;
        
        console.log("down1");
      }
    }

    //if pacman is above the ghost, and there is no wall in the way, move up
    else if (pacman.y < this.y) {
      this.lastDirections.add("U");
      if (!this.touchWalls("U", 5)) {
        this.y -= this.v;
        movesTaken += 1;
        
        console.log("up1");
      }
    }
    
    console.log(movesTaken);
    // console.log(this.lastDirections);
    //if no moves have been taken that can directly move it in the direction of pacman,
    //then try the other two moves at random so that the ghost keeps moving
    if (movesTaken == 0) {
      console.log("entered random")
      let movesToTry = difference(totalDirections, this.lastDirections);
      console.log(movesToTry)
      
      for(let move of movesToTry){
        console.log("in for loop")
        if (move === "L" && !this.touchWalls("L", 10)) {
          this.x -= 10 * this.v;
          console.log("left2");
        }
        if (move === "R" && !this.touchWalls("R", 10)) {
          this.x += 10 * this.v;
          console.log("right2");
        }
        if (move === "U" && !this.touchWalls("U", 10)) {
          this.y -= 10 * this.v;
          console.log("up2");
        }
        if (move === "D" && !this.touchWalls("D", 10)) {
          this.y += 10 * this.v;
          console.log("down2");
        }
      }
    }
    this.lastDirections.clear();
  }

  touchWalls(direction, multiple = 1) {
    if (direction === "L") {
      for (let i = 0; i < barriers.length; i++) {
        ghostCollide = collideRectRect(barriers[i][0], barriers[i][1], barriers[i][2], barriers[i][3], this.x - (multiple * this.v), this.y, 20, 20);
        if (ghostCollide == true){
          // console.log("left blocked")
          return true;
        }
      }
    }
    else if (direction === "R") {
      for (let i = 0; i < barriers.length; i++) {
        ghostCollide = collideRectRect(barriers[i][0], barriers[i][1], barriers[i][2], barriers[i][3], this.x + (multiple * this.v), this.y, 20, 20);
        if (ghostCollide == true){
          // console.log("right blocked")
          return true;
        }
      }
    }
    else if (direction === "U") {
      for (let i = 0; i < barriers.length; i++) {
        ghostCollide = collideRectRect(barriers[i][0], barriers[i][1], barriers[i][2], barriers[i][3], this.x, this.y - (multiple * this.v), 20, 20);
        if (ghostCollide == true){
          // console.log("up blocked")
          return true;
         }
      }
    }
    else if (direction === "D") {
      for (let i = 0; i < barriers.length; i++) {
        ghostCollide = collideRectRect(barriers[i][0], barriers[i][1], barriers[i][2], barriers[i][3], this.x, this.y + (multiple * this.v), 20, 20);
        if (ghostCollide == true){
          // console.log("down blocked")
          return true;
        }
      }
    }
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(255, 255, 255);
    this.eat = false;
  }

  show() {
    fill(this.col);
    ellipse(this.x, this.y, 7);
  }

  checkHit() {
    let hit = collideCircleCircle(
      this.x,
      this.y,
      7,
      pacman.x,
      pacman.y,
      pacman.size
    );

    if (hit && !this.eat) {
      this.col = backColor;
      this.eat = true;
      score++;
    }
  }
}

function keyPressed() {
  //change Pacman's direction
  if (keyCode === RIGHT_ARROW) {
    pacman.direction = 0;
  } else if (keyCode === DOWN_ARROW) {
    pacman.direction = 270;
  } else if (keyCode === LEFT_ARROW) {
    pacman.direction = 180;
  } else if (keyCode === UP_ARROW) {
    pacman.direction = 90;
  }

  if (
    keyCode === RIGHT_ARROW ||
    keyCode === DOWN_ARROW ||
    keyCode === LEFT_ARROW ||
    keyCode === UP_ARROW
  )
    pacTurn = true;
}

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}


// class PacmanGame{
//   constructor(){

//   }

//   render(){

//   }

//   playGame(){

//   }
// }

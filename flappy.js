/*
Inspired by http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
This is a re-implementation of the tutorial above using Phaser 3
 */

// Constants
const style = { font: '30px Arial', fill: '#ffffff' };
const widthMid = 400 / 2;
const heightMid = 490 / 2;
const gameState = {
  score: 0
};

// This function preloads the images used in the game
function preload() {
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
  this.load.image('edge', 'assets/edge.png');

}

// This funciton defines the GameObjects that are necessary at the start of our game
function create() {
  gameState.cursors = this.input.keyboard.createCursorKeys();
  gameState.bird = this.physics.add.sprite(100, 245, 'bird');

  gameState.scoreText = this.add.text(20, 20, "0", style);

  // Adding pipes
  const pipes = this.physics.add.group({
    allowGravity: false
  });

  // This function creates a single pipe which moves left at the given x and y location 
  function addOnePipe(x, y) {
    pipes.create(x, y, 'pipe');
    pipes.setVelocityX(-200);

  }

  // This function creates a row of pipes with a hole in a random location
  function addRowOfPipes() {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        addOnePipe(400, i * 60 + 35);
      }
    }
    gameState.score += 1
    gameState.scoreText.setText(gameState.score);
  }

  // Loops the generation of pipes
  gameState.pipeGenLoop = this.time.addEvent({
    delay: 1500,
    callback: addRowOfPipes,
    callbackScope: this,
    loop: true
  });

  // Game over condition where bird hits pipes
  this.physics.add.collider(gameState.bird, pipes, () => {
    gameState.pipeGenLoop.destroy();
    this.physics.pause();
    this.add.text(widthMid, heightMid - 50, 'Game Over', style).setOrigin(0.5);

    this.add.text(widthMid, heightMid + 50, 'Click to Restart', style).setOrigin(0.5);

    this.input.on('pointerup', () => {
      gameState.score = 0;
      this.scene.restart()
    });
  });

  // Pipes are destroyed when out of bounds
  const edge = this.physics.add.staticGroup();
  edge.create(-100, heightMid, 'edge');
  this.physics.add.collider(pipes, edge, (pipe) => {
    pipe.destroy();

  });
}

// This function defines animation and interaction in our game
function update() {
  // Bird jumps when space is pressed
  if (gameState.cursors.space.isDown) {
    gameState.bird.setVelocityY(-350);
  }

  // Game over condition where bird is out of bounds
  if (gameState.bird.y < 0 || gameState.bird.y > 490) {
    gameState.pipeGenLoop.getElapsedSeconds();
    gameState.pipeGenLoop.paused = true;

    this.physics.pause();
    this.add.text(widthMid, heightMid - 50, 'Game Over', style).setOrigin(0.5);

    this.add.text(widthMid, heightMid + 50, 'Click to Restart', style).setOrigin(0.5);

    this.input.on('pointerup', () => {
      gameState.score = 0;
      this.scene.restart()
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 490,
  backgroundColor: "#71c5cf",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      enableBody: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
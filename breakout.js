// Constants
const widthMid = 400 / 2;
const heightMid = 490 / 2;
const style = { font: '30px Arial', fill: '#ffffff' };
const speed = 100;
const gameState = {
  score: 0
};

// This function preloads the images used in the game
function preload() {
  this.load.image('ball', 'assets/ball.png');
  this.load.image('block', 'assets/block.png');
  this.load.image('paddle', 'assets/paddle.png');

}

// This funciton defines the GameObjects that are necessary at the start of our game
function create() {
  gameState.scoreText = this.add.text(20, 450, "0", style);

  gameState.ball = this.physics.add.sprite(200, 300, 'ball').setScale(0.35);
  gameState.ball.body.collideWorldBounds = true;
  gameState.ball.setVelocity(speed, speed);
  gameState.ball.setBounce(1, 1);

  // Creates starting arrangement of blocks 
  const blocks = this.physics.add.group();
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 5; j++) {
      newBlock = this.physics.add.sprite(i * 60 + 50, j * 35 + 35, 'block');
      newBlock.body.immovable = true;
      blocks.add(newBlock);
    }
  }
  
  // Input from player
  gameState.cursors = this.input.keyboard.createCursorKeys();

  gameState.paddle = this.physics.add.sprite(widthMid, 425, 'paddle');
  gameState.paddle.body.immovable = true;
  gameState.paddle.body.moves = true;
  gameState.paddle.body.collideWorldBounds = true;

  this.physics.world.checkCollision.down = false;
  this.physics.add.collider(gameState.ball, gameState.paddle);
  this.physics.add.collider(blocks, gameState.ball, hitBlock, null, this);

  /*
  This function makes the given ball bounce off a given block
  */
  function hitBlock(ball, block) {
    block.disableBody(true, true);

    gameState.score += 10
    gameState.scoreText.setText(gameState.score);

    if (ball.body.y < block.body.y - block.displayHeight / 2) {
      // bounces on top
      ball.body.setVelocityY(-speed);
    } else if (ball.body.y > block.body.y + block.displayHeight / 2) {
      // bounces on bottom
      ball.body.setVelocityY(speed);
    } else if (ball.body.x < block.body.x - block.displayWidth / 2) {
      // bounces on left
      ball.body.setVelocityX(-speed);
    } else if (ball.body.x > block.body.x + block.displayWidth / 2) {
      // bounces on right
      ball.body.setVelocityY(speed);
    }

    randNum = Math.random();

    // Gives ball a random x or y velocity when 0
    // Credit to  –  https://stackabuse.com/introduction-to-phaser-3-building-breakout/
    if (ball.body.velocity.x === 0) {
      if (randNum >= 0.5) {
        ball.body.setVelocityX(speed);
      } else {
        ball.body.setVelocityX(-speed);
      }
    }
    if (ball.body.velocity.y === 0) {
      if (randNum >= 0.5) {
        ball.body.setVelocityY(speed);
      } else {
        ball.body.setVelocityY(-speed);
      }
    }
  }
}

// This function defines animation and interaction in our game
function update() {
  // Paddle is controlled by the left and right arrow buttons
  if (gameState.cursors.left.isDown) {
    gameState.paddle.setVelocityX(-160);
  } else if (gameState.cursors.right.isDown) {
    gameState.paddle.setVelocityX(160);
  } else {
    gameState.paddle.setVelocityX(0);
  }

  // Ball is out of bounds
  if (gameState.ball.body.y > 490) {
    this.physics.pause();
    this.add.text(widthMid, heightMid - 50, 'Game Over', style).setOrigin(0.5);

    this.add.text(widthMid, heightMid + 50, 'Click to Restart', style).setOrigin(0.5);

    this.input.on('pointerup', () => {
      gameState.score = 0;
      this.scene.restart()
    });
  }

  // All the blocks have been hit and game is won
  if (gameState.score === 300) {
    this.physics.pause();
    this.add.text(widthMid, heightMid - 50, 'You Won!', style).setOrigin(0.5);

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
      enableBody: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
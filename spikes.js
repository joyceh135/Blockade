// Constants
const widthMid = 400 / 2;
const heightMid = 490 / 2;
const style = { font: '30px Arial', fill: '#ffffff' };
const speed = 150;
const gameState = {
  score: 0,
  left: true
};

// This function preloads the images used in the game
function preload() {
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

// This function creates a row of spikes with a hole at a random location
function addRowOfSpikes(x) {
  var hole = Math.floor(Math.random() * 5);

  for (var i = 0; i < 6; i++) {
    if (i != hole && i != hole + 1) {
      gameState.spikes.create(x, i * 70 + 70, 'pipe').setAngle(45);
    }
  }
}

// This funciton defines the GameObjects that are necessary at the start of our game
function create() {
  const border = this.physics.add.group({
    allowGravity: false
  });

  gameState.scoreText = this.add.text(20, 20, "0", style);

  // top border
  for (let i = 0; i < 5; i++) {
    newSpike = this.physics.add.sprite(i * 70 + 60, 0, 'pipe').setAngle(45);
    newSpike.body.immovable = true;
    border.add(newSpike);
  }

  // bottom border
  for (let i = 0; i < 5; i++) {
    newSpike = this.physics.add.sprite(i * 70 + 60, 490, 'pipe').setAngle(45);
    newSpike.body.immovable = true;
    border.add(newSpike);
  }

  gameState.cursors = this.input.keyboard.createCursorKeys();
  gameState.bird = this.physics.add.sprite(100, 245, 'bird');

  gameState.bird.body.setVelocityX(speed);
  gameState.bird.body.collideWorldBounds = true;

  gameState.spikes = this.physics.add.group({
    allowGravity: false
  });

  addRowOfSpikes(400);

  // This function performs the end sequence when the bird hits a given group in a given game
  function gameEnd(game, group) {
    game.physics.add.collider(gameState.bird, group, () => {
      game.physics.pause();
      game.add.text(widthMid, heightMid - 50, 'Game Over', style).setOrigin(0.5);

      game.add.text(widthMid, heightMid + 50, 'Click to Restart', style).setOrigin(0.5);

      game.input.on('pointerup', () => {
        gameState.score = 0;
        gameState.left = true;
        game.scene.restart()
      });
    });
  }

  gameEnd(this, border);
  gameEnd(this, gameState.spikes);
}

// This function defines animation and interaction in our game
function update() {
  // Bird jumps when space is pressed
  if (gameState.cursors.space.isDown) {
    gameState.bird.setVelocityY(-300);
  }

  // Bird goes right/left when it touches left/right border and spikes on the right/left are reset
  if (gameState.bird.body.x <= 0) {
    // bounces on left
    gameState.bird.body.setVelocityX(speed);
    swapTo(gameState.left);
    gameState.left = true;
    gameState.score += 1
    gameState.scoreText.setText(gameState.score);

  } else if (gameState.bird.body.x >= 400 - gameState.bird.displayWidth) {
    // bounces on right
    gameState.bird.body.setVelocityX(-speed);
    swapTo(gameState.left);
    gameState.left = false;
    gameState.score += 1
    gameState.scoreText.setText(gameState.score);

  }

  // Adds spikes to the left given that 'left' is true and right otherwise
  function swapTo(left) {
    if (left) {
      gameState.spikes.clear(true);
      addRowOfSpikes(0);
    } else {
      gameState.spikes.clear(true);
      addRowOfSpikes(400);
    }
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
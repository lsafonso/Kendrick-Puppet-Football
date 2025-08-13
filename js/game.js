// Kendrick Puppet Football Game
// Built with Phaser.js

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Game variables
let game;
let player1, player2, ball;
let goals, platforms;
let cursors, wasdKeys, fKey;
let score1 = 0, score2 = 0;
let timeLeft = 120; // 2 minutes
let gameTimer;
let gameStarted = false;
let gameOver = false;
let scoreText1, scoreText2, timerText, gameStateText;
let crowd;

// Initialize the game
game = new Phaser.Game(config);

function preload() {
    // Create placeholder graphics for game objects
    this.add.graphics();
    
    // Create ball texture
    const ballGraphics = this.add.graphics();
    ballGraphics.fillStyle(0xffffff);
    ballGraphics.fillCircle(8, 8, 8);
    ballGraphics.generateTexture('ball', 16, 16);
    ballGraphics.destroy();
    
    // Create player 1 texture (blue)
    const player1Graphics = this.add.graphics();
    player1Graphics.fillStyle(0x0066cc);
    player1Graphics.fillCircle(12, 12, 12); // Head
    player1Graphics.fillStyle(0x0066cc);
    player1Graphics.fillRect(8, 24, 8, 16); // Body
    player1Graphics.fillRect(4, 40, 4, 8); // Left leg
    player1Graphics.fillRect(16, 40, 4, 8); // Right leg
    player1Graphics.fillRect(2, 28, 4, 8); // Left arm
    player1Graphics.fillRect(18, 28, 4, 8); // Right arm
    player1Graphics.generateTexture('player1', 24, 48);
    player1Graphics.destroy();
    
    // Create player 2 texture (red)
    const player2Graphics = this.add.graphics();
    player2Graphics.fillStyle(0xcc0000);
    player2Graphics.fillCircle(12, 12, 12); // Head
    player2Graphics.fillStyle(0xcc0000);
    player2Graphics.fillRect(8, 24, 8, 16); // Body
    player2Graphics.fillRect(4, 40, 4, 8); // Left leg
    player2Graphics.fillRect(16, 40, 4, 8); // Right leg
    player2Graphics.fillRect(2, 28, 4, 8); // Left arm
    player2Graphics.fillRect(18, 28, 4, 8); // Right arm
    player2Graphics.generateTexture('player2', 24, 48);
    player2Graphics.destroy();
    
    // Create goal textures
    const goalGraphics = this.add.graphics();
    goalGraphics.fillStyle(0x00ff00);
    goalGraphics.fillRect(0, 0, 60, 100);
    goalGraphics.lineStyle(4, 0xffffff);
    goalGraphics.strokeRect(0, 0, 60, 100);
    goalGraphics.generateTexture('goal', 60, 100);
    goalGraphics.destroy();
    
    // Create platform texture
    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x8B4513);
    platformGraphics.fillRect(0, 0, 100, 20);
    platformGraphics.generateTexture('platform', 100, 20);
    platformGraphics.destroy();
    
    // Create background texture
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0x228B22);
    bgGraphics.fillRect(0, 0, 800, 600);
    // Add field lines
    bgGraphics.lineStyle(2, 0xffffff);
    bgGraphics.strokeRect(100, 50, 600, 400);
    bgGraphics.moveTo(400, 50);
    bgGraphics.lineTo(400, 450);
    bgGraphics.moveTo(100, 250);
    bgGraphics.lineTo(700, 250);
    // Center circle
    bgGraphics.strokeCircle(400, 250, 50);
    bgGraphics.generateTexture('background', 800, 600);
    bgGraphics.destroy();
}

function create() {
    // Add background
    this.add.image(400, 300, 'background');
    
    // Create platforms
    platforms = this.physics.add.staticGroup();
    
    // Ground
    platforms.create(400, 580, 'platform').setScale(8, 1).refreshBody();
    
    // Side platforms
    platforms.create(150, 450, 'platform').setScale(1.5, 1).refreshBody();
    platforms.create(650, 450, 'platform').setScale(1.5, 1).refreshBody();
    
    // Center platform
    platforms.create(400, 350, 'platform').setScale(2, 1).refreshBody();
    
    // Create goals
    goals = this.physics.add.staticGroup();
    goals.create(50, 250, 'goal'); // Left goal
    goals.create(750, 250, 'goal'); // Right goal
    
    // Create players
    player1 = this.physics.add.sprite(200, 300, 'player1');
    player1.setCollideWorldBounds(true);
    player1.setBounce(0.2);
    player1.setGravityY(800);
    
    player2 = this.physics.add.sprite(600, 300, 'player2');
    player2.setCollideWorldBounds(true);
    player2.setBounce(0.2);
    player2.setGravityY(800);
    
    // Create ball
    ball = this.physics.add.sprite(400, 250, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(0.8);
    ball.setGravityY(800);
    ball.setDrag(50);
    
    // Add collisions
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(ball, platforms);
    this.physics.add.collider(player1, player2);
    
    // Ball-player collisions
    this.physics.add.overlap(ball, player1, kickBall, null, this);
    this.physics.add.overlap(ball, player2, kickBall, null, this);
    
    // Goal collisions
    this.physics.add.overlap(ball, goals, checkGoal, null, this);
    
    // Setup input
    cursors = this.input.keyboard.createCursorKeys();
    wasdKeys = this.input.keyboard.addKeys('W,A,S,D');
    fKey = this.input.keyboard.addKey('F');
    spaceKey = this.input.keyboard.addKey('SPACE');
    
    // UI elements
    scoreText1 = this.add.text(50, 20, 'Player 1: 0', { 
        fontSize: '24px', 
        fill: '#0066cc',
        stroke: '#ffffff',
        strokeThickness: 3
    });
    
    scoreText2 = this.add.text(650, 20, 'Player 2: 0', { 
        fontSize: '24px', 
        fill: '#cc0000',
        stroke: '#ffffff',
        strokeThickness: 3
    });
    
    timerText = this.add.text(350, 20, 'Time: 2:00', { 
        fontSize: '24px', 
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 3
    });
    
    gameStateText = this.add.text(400, 280, 'Press SPACE to Start!', { 
        fontSize: '32px', 
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    // Add crowd animation (simple animated dots)
    createCrowd(this);
    
    // Start game timer
    startGameTimer();
}

function update() {
    if (!gameStarted || gameOver) return;
    
    // Player 1 controls (Arrow keys + Spacebar)
    if (cursors.left.isDown) {
        player1.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player1.setVelocityX(200);
    } else {
        player1.setVelocityX(0);
    }
    
    if (cursors.up.isDown && player1.body.touching.down) {
        player1.setVelocityY(-400);
    }
    
    if (spaceKey.isDown && player1.body.touching.down) {
        kickBallTowardsGoal(player1, 1);
    }
    
    // Player 2 controls (WASD + F)
    if (wasdKeys.A.isDown) {
        player2.setVelocityX(-200);
    } else if (wasdKeys.D.isDown) {
        player2.setVelocityX(200);
    } else {
        player2.setVelocityX(0);
    }
    
    if (wasdKeys.W.isDown && player2.body.touching.down) {
        player2.setVelocityY(-400);
    }
    
    if (fKey.isDown && player2.body.touching.down) {
        kickBallTowardsGoal(player2, 2);
    }
    
    // Update crowd animation
    updateCrowd();
}

function kickBall(player, playerNum) {
    // Simple ball physics when player touches ball
    const direction = playerNum === 1 ? 1 : -1;
    ball.setVelocityX(direction * 300);
    ball.setVelocityY(-200);
}

function kickBallTowardsGoal(player, playerNum) {
    // Kick ball towards opponent's goal
    const direction = playerNum === 1 ? 1 : -1;
    const goalX = playerNum === 1 ? 750 : 50;
    const goalY = 250;
    
    const angle = Phaser.Math.Angle.Between(player.x, player.y, goalX, goalY);
    const velocity = 400;
    
    ball.setVelocityX(Math.cos(angle) * velocity);
    ball.setVelocityY(Math.sin(angle) * velocity);
}

function checkGoal(ball, goal) {
    // Determine which goal was scored
    if (goal.x < 400) {
        // Left goal - Player 2 scores
        score2++;
        scoreText2.setText('Player 2: ' + score2);
        playGoalSound();
    } else {
        // Right goal - Player 1 scores
        score1++;
        scoreText1.setText('Player 1: ' + score1);
        playGoalSound();
    }
    
    // Reset ball position
    ball.setPosition(400, 250);
    ball.setVelocity(0, 0);
    
    // Check for game end
    if (score1 >= 5 || score2 >= 5) {
        endGame();
    }
}

function playGoalSound() {
    // Simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function startGameTimer() {
    gameTimer = setInterval(() => {
        if (gameStarted && !gameOver) {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
            
            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameStateText.setText('');
        
        // Add start button
        const startButton = this.add.text(400, 320, 'START GAME', {
            fontSize: '24px',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        startButton.on('pointerdown', () => {
            startButton.destroy();
            gameStateText.setText('GO!');
            setTimeout(() => {
                gameStateText.setText('');
            }, 1000);
        });
    }
}

function endGame() {
    gameOver = true;
    clearInterval(gameTimer);
    
    let winner = '';
    if (score1 > score2) {
        winner = 'Player 1 Wins!';
    } else if (score2 > score1) {
        winner = 'Player 2 Wins!';
    } else {
        winner = 'It\'s a Tie!';
    }
    
    gameStateText.setText(winner);
    
    // Add restart button
    const restartButton = this.add.text(400, 350, 'RESTART', {
        fontSize: '24px',
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 3,
        backgroundColor: '#ffffff',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    restartButton.on('pointerdown', () => {
        location.reload();
    });
}

function createCrowd(scene) {
    crowd = [];
    for (let i = 0; i < 50; i++) {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 100);
        const dot = scene.add.circle(x, y, 2, 0xffff00);
        dot.velocity = Phaser.Math.Between(1, 3);
        dot.direction = Math.random() > 0.5 ? 1 : -1;
        crowd.push(dot);
    }
}

function updateCrowd() {
    crowd.forEach(dot => {
        dot.x += dot.velocity * dot.direction * 0.1;
        if (dot.x > 750 || dot.x < 50) {
            dot.direction *= -1;
        }
    });
}

// Handle spacebar to start game
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        event.preventDefault();
        startGame();
    }
});

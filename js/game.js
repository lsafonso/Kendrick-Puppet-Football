// Kendrick Puppet Football Game
// Built with Phaser.js - Exact visual match to Puppet Soccer style

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
let timeLeft = 60; // 60 seconds as shown in image
let gameTimer;
let gameStarted = false;
let gameOver = false;
let scoreText1, scoreText2, timerText, gameStateText;
let crowd, sponsors;

// Initialize the game
game = new Phaser.Game(config);

function preload() {
    // Create placeholder graphics for game objects
    this.add.graphics();
    
    // Create ball texture (black and white football)
    const ballGraphics = this.add.graphics();
    ballGraphics.fillStyle(0x000000);
    ballGraphics.fillCircle(8, 8, 8);
    ballGraphics.fillStyle(0xffffff);
    ballGraphics.fillCircle(8, 8, 6);
    ballGraphics.fillStyle(0x000000);
    ballGraphics.fillCircle(8, 8, 4);
    ballGraphics.fillStyle(0xffffff);
    ballGraphics.fillCircle(8, 8, 2);
    ballGraphics.generateTexture('ball', 16, 16);
    ballGraphics.destroy();
    
    // Create Modrić texture (Real Madrid - white kit with Fly Emirates)
    const player1Graphics = this.add.graphics();
    // Head (light brown hair, serious expression)
    player1Graphics.fillStyle(0xD2B48C);
    player1Graphics.fillCircle(12, 12, 12);
    player1Graphics.fillStyle(0x8B4513);
    player1Graphics.fillCircle(10, 10, 8); // Hair
    player1Graphics.fillStyle(0x000000);
    player1Graphics.fillCircle(9, 11, 1); // Left eye
    player1Graphics.fillCircle(15, 11, 1); // Right eye
    player1Graphics.fillStyle(0x8B0000);
    player1Graphics.fillCircle(12, 14, 1); // Mouth
    
    // Body (white kit)
    player1Graphics.fillStyle(0xFFFFFF);
    player1Graphics.fillRect(8, 24, 8, 16);
    // Sponsor text "Fly Emirates"
    player1Graphics.fillStyle(0x000000);
    player1Graphics.fillRect(7, 30, 10, 2);
    player1Graphics.fillRect(7, 33, 10, 2);
    
    // Arms
    player1Graphics.fillStyle(0xFFFFFF);
    player1Graphics.fillRect(2, 28, 4, 8);
    player1Graphics.fillRect(18, 28, 4, 8);
    
    // Legs
    player1Graphics.fillStyle(0xFFFFFF);
    player1Graphics.fillRect(4, 40, 4, 8);
    player1Graphics.fillRect(16, 40, 4, 8);
    
    player1Graphics.generateTexture('player1', 24, 48);
    player1Graphics.destroy();
    
    // Create Piqué texture (FC Barcelona - light blue kit with Rakuten)
    const player2Graphics = this.add.graphics();
    // Head (dark hair, beard, determined expression)
    player2Graphics.fillStyle(0x8B4513);
    player2Graphics.fillCircle(12, 12, 12);
    player2Graphics.fillStyle(0x654321);
    player2Graphics.fillCircle(10, 10, 8); // Hair
    player2Graphics.fillStyle(0x8B4513);
    player2Graphics.fillCircle(8, 14, 3); // Beard
    player2Graphics.fillStyle(0x000000);
    player2Graphics.fillCircle(9, 11, 1); // Left eye
    player2Graphics.fillCircle(15, 11, 1); // Right eye
    player2Graphics.fillStyle(0x8B0000);
    player2Graphics.fillCircle(12, 14, 1); // Mouth
    
    // Body (light blue kit)
    player2Graphics.fillStyle(0x87CEEB);
    player2Graphics.fillRect(8, 24, 8, 16);
    // Sponsor text "Rakuten"
    player2Graphics.fillStyle(0x000000);
    player2Graphics.fillRect(7, 30, 10, 2);
    player2Graphics.fillRect(7, 33, 10, 2);
    
    // Arms
    player2Graphics.fillStyle(0x87CEEB);
    player2Graphics.fillRect(2, 28, 4, 8);
    player2Graphics.fillRect(18, 28, 4, 8);
    
    // Legs
    player2Graphics.fillStyle(0x87CEEB);
    player2Graphics.fillRect(4, 40, 4, 8);
    player2Graphics.fillRect(16, 40, 4, 8);
    
    player2Graphics.generateTexture('player2', 24, 48);
    player2Graphics.destroy();
    
    // Create goal textures (white goalposts with nets)
    const goalGraphics = this.add.graphics();
    goalGraphics.fillStyle(0xFFFFFF);
    goalGraphics.fillRect(0, 0, 60, 100);
    goalGraphics.lineStyle(4, 0xFFFFFF);
    goalGraphics.strokeRect(0, 0, 60, 100);
    // Net pattern
    goalGraphics.lineStyle(1, 0xCCCCCC);
    for (let i = 0; i < 60; i += 5) {
        goalGraphics.moveTo(i, 0);
        goalGraphics.lineTo(i, 100);
    }
    for (let i = 0; i < 100; i += 5) {
        goalGraphics.moveTo(0, i);
        goalGraphics.lineTo(60, i);
    }
    goalGraphics.generateTexture('goal', 60, 100);
    goalGraphics.destroy();
    
    // Create platform texture (brown)
    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x8B4513);
    platformGraphics.fillRect(0, 0, 100, 20);
    platformGraphics.generateTexture('platform', 100, 20);
    platformGraphics.destroy();
    
    // Create background texture (bright green football pitch)
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0x228B22);
    bgGraphics.fillRect(0, 0, 800, 600);
    
    // Field lines (white)
    bgGraphics.lineStyle(2, 0xFFFFFF);
    // Main field boundary
    bgGraphics.strokeRect(100, 50, 600, 400);
    // Center line
    bgGraphics.moveTo(400, 50);
    bgGraphics.lineTo(400, 450);
    // Halfway line
    bgGraphics.moveTo(100, 250);
    bgGraphics.lineTo(700, 250);
    // Center circle
    bgGraphics.strokeCircle(400, 250, 50);
    // Penalty areas
    bgGraphics.strokeRect(50, 150, 100, 200);
    bgGraphics.strokeRect(650, 150, 100, 200);
    // Goal areas
    bgGraphics.strokeRect(50, 200, 50, 100);
    bgGraphics.strokeRect(700, 200, 50, 100);
    
    bgGraphics.generateTexture('background', 800, 600);
    bgGraphics.destroy();
}

function create() {
    // Add background
    this.add.image(400, 300, 'background');
    
    // Create stadium background with crowd
    createStadium(this);
    
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
    
    // Create UI exactly as shown in image
    createGameUI(this);
    
    // Start game timer
    startGameTimer();
}

function createStadium(scene) {
    // Create stadium tiers with blue and white crowd
    const colors = [0x0066CC, 0xFFFFFF, 0x0066CC, 0xFFFFFF];
    
    for (let tier = 0; tier < 4; tier++) {
        const y = 50 + tier * 25;
        const height = 20;
        const crowdDensity = 50 - tier * 10;
        
        for (let i = 0; i < crowdDensity; i++) {
            const x = Phaser.Math.Between(50, 750);
            const color = colors[tier % colors.length];
            const dot = scene.add.circle(x, y, 1.5, color);
            dot.velocity = Phaser.Math.Between(1, 3);
            dot.direction = Math.random() > 0.5 ? 1 : -1;
            if (!crowd) crowd = [];
            crowd.push(dot);
        }
    }
    
    // Create sponsor hoardings
    sponsors = scene.add.graphics();
    sponsors.fillStyle(0xFFFFFF);
    sponsors.fillRect(0, 520, 800, 30);
    
    // Add sponsor logos
    const sponsorTexts = ['SAMSUNG', 'NIKE', 'DAYONE', 'TAGHeuer', 'Mazda', 'Santander', 'Mal', 'SPORTIUM'];
    const spacing = 800 / sponsorTexts.length;
    
    sponsorTexts.forEach((sponsor, index) => {
        scene.add.text(spacing * index + spacing/2, 535, sponsor, {
            fontSize: '12px',
            fill: '#000000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    });
    
    // Add team banners
    scene.add.text(150, 100, '¡HALA MADRID!', {
        fontSize: '16px',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    scene.add.text(650, 100, 'VAMOS REAL.', {
        fontSize: '16px',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        fontFamily: 'Arial'
    }).setOrigin(0.5);
}

function createGameUI(scene) {
    // Top bar UI exactly as shown in image
    
    // Real Madrid section (left)
    const realMadridBox = scene.add.graphics();
    realMadridBox.fillStyle(0xFFFFFF);
    realMadridBox.fillRect(20, 20, 120, 80);
    realMadridBox.lineStyle(2, 0x000000);
    realMadridBox.strokeRect(20, 20, 120, 80);
    
    // Real Madrid crest (simplified)
    realMadridBox.fillStyle(0x0066CC);
    realMadridBox.fillCircle(80, 50, 20);
    realMadridBox.fillStyle(0xFFFFFF);
    realMadridBox.fillCircle(80, 50, 15);
    realMadridBox.fillStyle(0x0066CC);
    realMadridBox.fillCircle(80, 50, 10);
    
    // Team name
    scene.add.text(80, 70, 'REAL MADRID', {
        fontSize: '10px',
        fill: '#000000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Player name
    scene.add.text(80, 85, 'MODRIĆ', {
        fontSize: '12px',
        fill: '#000000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // FC Barcelona section (right)
    const barcelonaBox = scene.add.graphics();
    barcelonaBox.fillStyle(0xFFFFFF);
    barcelonaBox.fillRect(660, 20, 120, 80);
    barcelonaBox.lineStyle(2, 0x000000);
    barcelonaBox.strokeRect(660, 20, 120, 80);
    
    // FC Barcelona crest (simplified)
    barcelonaBox.fillStyle(0x87CEEB);
    barcelonaBox.fillCircle(720, 50, 20);
    barcelonaBox.fillStyle(0x0066CC);
    barcelonaBox.fillCircle(720, 50, 15);
    barcelonaBox.fillStyle(0x87CEEB);
    barcelonaBox.fillCircle(720, 50, 10);
    
    // Team name
    scene.add.text(720, 70, 'FC BARCELONA', {
        fontSize: '10px',
        fill: '#000000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Player name
    scene.add.text(720, 85, 'PIQUÉ', {
        fontSize: '12px',
        fill: '#000000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Score display (center)
    scoreText1 = scene.add.text(380, 50, '0', {
        fontSize: '48px',
        fill: '#000000',
        stroke: '#FFFFFF',
        strokeThickness: 4,
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    scene.add.text(420, 50, '0', {
        fontSize: '48px',
        fill: '#000000',
        stroke: '#FFFFFF',
        strokeThickness: 4,
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Timer (circular icon with 60)
    const timerCircle = scene.add.graphics();
    timerCircle.fillStyle(0xFFFFFF);
    timerCircle.fillCircle(400, 100, 25);
    timerCircle.lineStyle(2, 0x000000);
    timerCircle.strokeCircle(400, 100, 25);
    
    timerText = scene.add.text(400, 100, '60', {
        fontSize: '16px',
        fill: '#000000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Pause button (top right)
    const pauseButton = scene.add.graphics();
    pauseButton.fillStyle(0xFFFFFF);
    pauseButton.fillRect(750, 20, 30, 30);
    pauseButton.lineStyle(2, 0x000000);
    pauseButton.strokeRect(750, 20, 30, 30);
    
    // Pause icon (two vertical bars)
    pauseButton.fillStyle(0x000000);
    pauseButton.fillRect(755, 25, 4, 20);
    pauseButton.fillRect(761, 25, 4, 20);
    
    // Bottom control bar
    const controlBar = scene.add.graphics();
    controlBar.fillStyle(0x333333);
    controlBar.fillRect(0, 550, 800, 50);
    
    // Movement controls (left side)
    const leftArrow = scene.add.graphics();
    leftArrow.fillStyle(0x666666);
    leftArrow.fillTriangle(50, 575, 70, 555, 70, 595);
    leftArrow.lineStyle(2, 0x000000);
    leftArrow.strokeTriangle(50, 575, 70, 555, 70, 595);
    
    const rightArrow = scene.add.graphics();
    rightArrow.fillStyle(0x666666);
    rightArrow.fillTriangle(90, 575, 70, 555, 70, 595);
    rightArrow.lineStyle(2, 0x000000);
    rightArrow.strokeTriangle(90, 575, 70, 555, 70, 595);
    
    // Action controls (right side)
    // Orange flame button
    const flameButton = scene.add.graphics();
    flameButton.fillStyle(0xFF8C00);
    flameButton.fillCircle(650, 575, 15);
    flameButton.lineStyle(2, 0x000000);
    flameButton.strokeCircle(650, 575, 15);
    
    // Blue football button
    const footballButton = scene.add.graphics();
    footballButton.fillStyle(0x0066CC);
    footballButton.fillCircle(690, 575, 15);
    footballButton.lineStyle(2, 0x000000);
    footballButton.strokeCircle(690, 575, 15);
    
    // Green jump button
    const jumpButton = scene.add.graphics();
    jumpButton.fillStyle(0x00FF00);
    jumpButton.fillCircle(730, 575, 15);
    jumpButton.lineStyle(2, 0x000000);
    jumpButton.strokeCircle(730, 575, 15);
    
    // Add icons to buttons
    scene.add.text(650, 575, '🔥', { fontSize: '12px' }).setOrigin(0.5);
    scene.add.text(690, 575, '⚽', { fontSize: '12px' }).setOrigin(0.5);
    scene.add.text(730, 575, '↑', { fontSize: '12px', fill: '#000000' }).setOrigin(0.5);
    
    // Game state text
    gameStateText = scene.add.text(400, 280, 'Press SPACE to Start!', {
        fontSize: '32px',
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4,
        fontFamily: 'Arial'
    }).setOrigin(0.5);
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
        // Left goal - Player 2 (FC Barcelona) scores
        score2++;
        playGoalSound();
    } else {
        // Right goal - Player 1 (Real Madrid) scores
        score1++;
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
            timerText.setText(timeLeft.toString());
            
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
        const startButton = scene.add.text(400, 320, 'START GAME', {
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
        winner = 'Real Madrid Wins!';
    } else if (score2 > score1) {
        winner = 'FC Barcelona Wins!';
    } else {
        winner = 'It\'s a Tie!';
    }
    
    gameStateText.setText(winner);
    
    // Add restart button
    const restartButton = scene.add.text(400, 350, 'RESTART', {
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

function updateCrowd() {
    if (crowd) {
        crowd.forEach(dot => {
            dot.x += dot.velocity * dot.direction * 0.1;
            if (dot.x > 750 || dot.x < 50) {
                dot.direction *= -1;
            }
        });
    }
}

// Handle spacebar to start game
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        event.preventDefault();
        startGame();
    }
});

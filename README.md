# ⚽ Kendrick Puppet Football ⚽

A fun 2D web-based football game built with Phaser.js where two players control cartoon-style puppet footballers in an exciting 1v1 match!

## 🎮 Game Features

- **1v1 Player vs Player** gameplay
- **Cartoon-style puppets** with oversized heads and fun animations
- **Realistic physics** including gravity, collision detection, and ball physics
- **Football stadium background** with animated crowd
- **Score tracking** and countdown timer
- **Sound effects** when goals are scored
- **Responsive controls** for both players
- **No installation required** - runs directly in any modern web browser

## 🎯 How to Play

### Objective
Score goals by kicking the ball into your opponent's goal! The first player to score 5 goals wins, or the player with the most goals when time runs out.

### Controls

#### Player 1 (Blue Team)
- **← →** Move left/right
- **↑** Jump
- **Spacebar** Shoot/Kick ball

#### Player 2 (Red Team)
- **A D** Move left/right
- **W** Jump
- **F** Shoot/Kick ball

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Running the Game

1. **Download/Clone** the repository to your local machine
2. **Open** `index.html` in your web browser
   - Double-click the file, or
   - Drag and drop into your browser window, or
   - Right-click and select "Open with" your preferred browser
3. **Press SPACE** to start the game
4. **Enjoy** playing Kendrick Puppet Football!

### Alternative: Local Server (Recommended)
For the best experience, run a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have it installed)
npx http-server

# Using PHP (if you have it installed)
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🛠️ Technical Details

- **Framework**: Phaser.js 3.60.0
- **Physics Engine**: Arcade Physics
- **Graphics**: Programmatically generated using Phaser Graphics API
- **Audio**: Web Audio API for goal celebration sounds
- **Responsive Design**: Optimized for 800x600 game area

## 🎨 Game Elements

- **Players**: Blue (Player 1) and Red (Player 2) puppet characters
- **Ball**: White football with realistic bouncing physics
- **Field**: Green football pitch with white lines and center circle
- **Goals**: Green goalposts on left and right sides
- **Platforms**: Brown platforms for strategic positioning
- **Crowd**: Animated yellow dots representing stadium spectators

## 🏆 Game Rules

1. **Scoring**: Ball must enter the opponent's goal to score
2. **Time Limit**: 2-minute match timer
3. **Win Condition**: First to 5 goals OR highest score when time expires
4. **Physics**: Realistic gravity and ball bouncing
5. **Movement**: Players can move, jump, and kick the ball
6. **Collisions**: Players can't pass through each other or platforms

## 🔧 Customization

The game is built with modular code that makes it easy to customize:

- **Colors**: Modify the hex color codes in the `preload()` function
- **Physics**: Adjust gravity, bounce, and velocity values
- **Timing**: Change the game duration in the `timeLeft` variable
- **Scoring**: Modify the win condition in the `checkGoal()` function
- **Controls**: Update key bindings in the `update()` function

## 🌟 Future Enhancements

Potential features for future versions:
- Power-ups and special abilities
- Multiple ball types
- Tournament mode
- Custom character skins
- Enhanced sound effects and music
- Mobile touch controls
- Multiplayer over network

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

## 🐛 Troubleshooting

**Game won't start?**
- Make sure you're using a modern browser
- Check that JavaScript is enabled
- Try refreshing the page

**Controls not responding?**
- Ensure the game window is focused
- Check that no other applications are using the same keys
- Try pressing SPACE first to start the game

**Performance issues?**
- Close other browser tabs
- Reduce browser zoom level
- Update your graphics drivers

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

---

**Enjoy playing Kendrick Puppet Football!** ⚽🎮

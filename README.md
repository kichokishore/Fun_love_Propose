# 💕 Romantic Proposal Website

A stunning, high-end romantic proposal website with premium UI/UX design, interactive animations, and emotional engagement.

## ✨ Features

### 🎨 **Premium Design**
- Ultra-modern glassmorphism and soft neumorphism effects
- Smooth romantic gradients (blush pink, rose, lavender, peach)
- Floating heart animations in the background
- Elegant typography with Google Fonts (Poppins & Playfair Display)
- Soft shadows and glowing buttons
- Fully responsive mobile-first design

### 🎯 **Interactive Elements**
- **YES Button**: Triggers confetti explosion + heart burst animation with success screen
- **NO Button**: Evasive mechanics with progressive text changes (6 attempts before allowing click)
- **Personalization**: Customize the name for a personal touch
- **Dark Mode**: Toggle between light and dark themes
- **Background Music**: Romantic instrumental with mute toggle

### 🎭 **Animations**
- Butter-smooth 60fps animations
- Floating hearts using optimized canvas rendering
- Confetti burst effects
- Heart explosion animations
- Entrance animations with fade-in and scale effects
- Spring animations for button interactions

### 📱 **Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance across devices

## 🚀 Quick Start

### Option 1: Direct Launch
Simply open `index.html` in your web browser - no setup required!

### Option 2: Local Server (Recommended)
For the best experience, especially with music:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
Love-proposal/
├── index.html          # Main HTML file
├── style.css           # Complete styling with animations
├── script.js           # Interactive functionality
├── README.md           # This file
└── assets/             # (Optional) Add your music file here
    └── romantic-music.mp3
```

## 🎵 Adding Music

1. Create an `assets` folder in the project root
2. Add your romantic music file as `romantic-music.mp3`
3. The website will automatically detect and play it

*Note: Due to browser policies, music may require user interaction to start.*

## 🎨 Customization

### Personalize the Name
Click the ✏️ button or edit line 35 in `index.html`:
```html
<h1 class="hero-name" id="heroName">Your Love's Name,</h1>
```

### Change Colors
Modify the CSS variables in `style.css` (lines 13-25):
```css
:root {
    --primary-pink: #ff6b9d;
    --primary-rose: #ee5a6f;
    /* ... more colors */
}
```

### Customize Messages
Edit the `noButtonMessages` array in `script.js` (line 12):
```javascript
const noButtonMessages = [
    'No',
    'Are you sure?',
    'Your custom messages here...'
];
```

## 🎮 Keyboard Shortcuts

- `Ctrl/Cmd + D`: Toggle dark mode
- `Ctrl/Cmd + M`: Toggle music
- `Escape`: Close modal
- `Space/Enter`: Restart experience (on success screen)

## 🌟 Special Features

### NO Button Behavior
The NO button has 6 evasion attempts with progressive messages:
1. "No" → "Are you sure?"
2. "Are you sure?" → "Really sure?"
3. "Really sure?" → "Think again 🥺"
4. "Think again 🥺" → "Last chance 😭"
5. "Last chance 😭" → "Please say yes 💕"
6. "Please say yes 💕" → "I'll be sad 😢"

After 6 attempts, it becomes clickable and shows a funny modal.

### Success Screen
When YES is clicked:
- Confetti explosion animation
- Heart burst effect
- Success message with love letter
- Share and restart options

### Performance Optimizations
- Canvas-based heart animations for smooth performance
- Debounced resize events
- Optimized animation loops
- Reduced motion support for accessibility

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android 8+)

## 🎯 Tips for Best Experience

1. **Use a local server** for music functionality
2. **Test on mobile** for responsive design verification
3. **Add personal photos** to the success screen if desired
4. **Customize colors** to match your relationship theme
5. **Test the NO button** - it's surprisingly fun!

## 💝 Making It Personal

### Add Photos
1. Create a `photos` folder
2. Add your favorite couple photos
3. Modify the success screen to include a photo gallery

### Custom Love Letter
Edit the love letter text in `index.html` (lines 78-84):
```html
<p class="letter-text">
    Your personalized love letter here...
</p>
```

### Date & Location
Add your proposal date and location to make it memorable:
```html
<p class="proposal-date">Proposed on [Date] at [Location]</p>
```

## 🐛 Troubleshooting

### Music Not Playing
- Browser security requires user interaction first
- Try clicking anywhere on the page first
- Use a local server instead of opening file directly

### Animations Lagging
- Close other browser tabs
- Ensure hardware acceleration is enabled
- Check if your device supports CSS animations

### Mobile Issues
- Ensure you're using a modern mobile browser
- Try refreshing the page
- Check if JavaScript is enabled

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💌 Share Your Story

If you use this for your proposal, I'd love to hear your story! Feel free to share screenshots or feedback.

---

**Made with ❤️ for unforgettable moments**

*Created for that special someone who deserves the world.*

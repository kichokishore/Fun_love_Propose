// ===== GLOBAL VARIABLES =====
let noButtonAttempts = 0;
let isMusicPlaying = false;
let isDarkMode = false;
let heartsAnimation = null;
let confettiAnimation = null;

// DOM Elements
const elements = {
    mainContainer: document.getElementById('mainContainer'),
    startScreen: document.getElementById('startScreen'),
    heroContent: document.getElementById('heroContent'),
    heroSection: document.querySelector('.hero-section'),
    successScreen: document.getElementById('successScreen'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    startBtn: document.getElementById('startBtn'),
    modalOverlay: document.getElementById('modalOverlay'),
    noModal: document.getElementById('noModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    personalizeBtn: document.getElementById('personalizeBtn'),
    testAudioBtn: document.getElementById('testAudioBtn'),
    heroName: document.getElementById('heroName'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    shareBtn: document.getElementById('shareBtn'), // May be null if commented out
    restartBtn: document.getElementById('restartBtn'), // May be null if commented out
    heartsCanvas: document.getElementById('heartsCanvas'),
    loveMessage: document.getElementById('loveMessage')
};

// No button messages
const noButtonMessages = [
    'No',
    'Are you sure?',
    'Really sure?',
    'Think again 🥺',
    'Last chance 😭',
    'Please say yes 💕',
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize other features (no auto music start)
    initializeEventListeners();
    startFloatingHearts();
    checkDarkModePreference();
    
    console.log('🎵 Proposal website loaded - waiting for user to click Start button');
});

// ===== START BUTTON HANDLER =====
function handleStartClick() {
    console.log('🚀 Start button clicked - beginning romantic experience!');
    
    // Hide start screen
    elements.startScreen.style.display = 'none';
    
    // Show main content
    elements.heroContent.style.display = 'block';
    
    // Start Anjaan.wav music
    startBackgroundMusic();
    
    // Add entrance animation
    elements.heroContent.style.animation = 'heroEntrance 1.5s ease-out';
}

// Enable audio on first user interaction
function enableAudio(event) {
    console.log('🎵 User interaction detected!', event.type);
    console.log('🎵 Enabling Anjaan.wav audio...');
    
    const music = elements.backgroundMusic;
    if (music) {
        console.log('🎵 Anjaan.wav audio element found, attempting to play...');
        
        // Try unmuted first (WAV format usually works better)
        music.play().then(() => {
            console.log('✅ Anjaan.wav started successfully after user interaction! 🎵');
            music.isPlaying = true;
        }).catch(error => {
            console.log('🔄 Trying muted Anjaan.wav playback...', error);
            music.muted = true;
            music.play().then(() => {
                console.log('✅ Anjaan.wav playing muted, attempting to unmute...');
                music.isPlaying = true;
                
                // Try to unmute after a short delay
                setTimeout(() => {
                    music.muted = false;
                    console.log('🔊 Attempting to unmute Anjaan.wav...');
                }, 1000);
            }).catch(mutedError => {
                console.log('❌ Even muted Anjaan.wav playback failed:', mutedError);
            });
        });
    } else {
        console.log('❌ Anjaan.wav audio element not found!');
    }
}

function initializeEventListeners() {
    // Start button event listener
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', handleStartClick);
    }
    
    // Button event listeners
    elements.yesBtn.addEventListener('click', handleYesClick);
    elements.noBtn.addEventListener('click', handleNoClick);
    elements.noBtn.addEventListener('mouseenter', handleNoHover);
    
    // Modal event listeners
    elements.modalCloseBtn.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            closeModal();
        }
    });
    
    // Control panel event listeners
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    elements.personalizeBtn.addEventListener('click', openPersonalizeModal);
    if (elements.testAudioBtn) {
        elements.testAudioBtn.addEventListener('click', testAudioPlay);
    }
    
    // Success screen event listeners (only if elements exist)
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', shareProposal);
    }
    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', restartExperience);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Prevent context menu on success screen
    elements.successScreen.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// ===== YES BUTTON HANDLER =====
function handleYesClick() {
    // Hide the No button immediately
    elements.noBtn.style.display = 'none';
    
    // Remove any existing No button clone
    const clone = document.getElementById('noBtnClone');
    if (clone) {
        clone.remove();
    }
    
    // Stop the background music when YES is clicked
    stopBackgroundMusic();
    
    // Create confetti and heart burst
    createConfetti();
    createHeartBurst();
    
    // Play your custom audio instead of notification sound
    playCustomAudio();
    
    // Show success screen after a short delay
    setTimeout(() => {
        showSuccessScreen();
    }, 800);
}

function showSuccessScreen() {
    elements.heroSection.style.display = 'none';
    elements.successScreen.style.display = 'flex';
    
    // Create additional sparkles on success screen
    createSuccessSparkles();
    
    // Continue playing the audio that started when YES was clicked
    // The audio is already playing from playCustomAudio()
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CUSTOM AUDIO PLAYBACK =====
function playCustomAudio() {
    // Create audio element for your custom song
    const audio = new Audio('./assets/Sollitaley song.mp4');
    audio.loop = true;
    
    audio.play().then(() => {
        console.log('Custom audio playing on YES button click 🎵');
    }).catch(error => {
        console.log('Audio autoplay blocked, trying muted first:', error);
        
        // Try muted first, then unmute
        audio.muted = true;
        audio.play().then(() => {
            console.log('Audio playing muted, attempting to unmute...');
            
            setTimeout(() => {
                audio.muted = false;
                audio.play().then(() => {
                    console.log('Audio now playing with sound! 🎵');
                }).catch(unmuteError => {
                    console.log('Could not unmute audio, continuing muted:', unmuteError);
                });
            }, 1000);
        }).catch(mutedError => {
            console.log('Audio playback failed:', mutedError);
        });
    });
    
    // Store audio reference for cleanup
    window.proposalAudio = audio;
}

// ===== NO BUTTON HANDLERS =====
function handleNoHover() {
    if (noButtonAttempts < 6) {
        moveNoButton();
        updateNoButtonText();
        noButtonAttempts++;
    }
}

function handleNoClick() {
    if (noButtonAttempts >= 6) {
        showModal();
    } else {
        // Prevent click if attempts < 6
        event.preventDefault();
        handleNoHover();
    }
}

function moveNoButton() {
    const button = elements.noBtn;
    const container = elements.mainContainer;
    
    // Get the actual container bounds (which is constrained to 16:10)
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    // Calculate safe bounds within the 16:10 container
    const maxX = containerRect.width - buttonRect.width - 40;
    const maxY = containerRect.height - buttonRect.height - 40;
    
    // Ensure minimum bounds to prevent negative values
    const safeMaxX = Math.max(maxX, 100);
    const safeMaxY = Math.max(maxY, 100);
    
    // Generate random position within container bounds
    const randomX = Math.random() * safeMaxX + 20;
    const randomY = Math.random() * safeMaxY + 20;
    
    // Calculate absolute position relative to viewport
    const absoluteX = containerRect.left + randomX;
    const absoluteY = containerRect.top + randomY;
    
    // Remove any existing clone first
    const existingClone = document.getElementById('noBtnClone');
    if (existingClone) {
        existingClone.removeEventListener('mouseenter', handleCloneHover);
        existingClone.removeEventListener('click', handleCloneClick);
        existingClone.remove();
    }
    
    // Clone the button to prevent layout shifts
    const buttonClone = button.cloneNode(true);
    buttonClone.style.position = 'fixed';
    buttonClone.style.left = `${absoluteX}px`;
    buttonClone.style.top = `${absoluteY}px`;
    buttonClone.style.zIndex = '1000';
    buttonClone.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    buttonClone.id = 'noBtnClone';
    buttonClone.style.visibility = 'visible'; // Ensure it's visible
    
    // Hide original button
    button.style.visibility = 'hidden';
    
    // Add clone to body
    document.body.appendChild(buttonClone);
    
    // Define event handlers for the clone
    function handleCloneHover(e) {
        e.stopPropagation();
        console.log('Clone hover detected, attempts:', noButtonAttempts);
        if (noButtonAttempts < 6) {
            moveNoButton();
            updateNoButtonText();
            noButtonAttempts++;
        }
    }
    
    function handleCloneClick(e) {
        e.stopPropagation();
        console.log('Clone click detected, attempts:', noButtonAttempts);
        if (noButtonAttempts >= 6) {
            showModal();
        } else {
            e.preventDefault();
            moveNoButton();
            updateNoButtonText();
            noButtonAttempts++;
        }
    }
    
    // Add event listeners immediately
    buttonClone.addEventListener('mouseenter', handleCloneHover);
    buttonClone.addEventListener('click', handleCloneClick);
    
    // Add a little bounce effect
    setTimeout(() => {
        if (document.getElementById('noBtnClone') === buttonClone) {
            buttonClone.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (document.getElementById('noBtnClone') === buttonClone) {
                    buttonClone.style.transform = 'scale(1)';
                }
            }, 200);
        }
    }, 500);
    
    console.log('New clone created at position:', absoluteX, absoluteY);
}

function updateNoButtonText() {
    const messageIndex = Math.min(noButtonAttempts, noButtonMessages.length - 1);
    const newText = noButtonMessages[messageIndex];
    
    // Update original button
    elements.noBtn.querySelector('.btn-text').textContent = newText;
    
    // Update clone if it exists
    const clone = document.getElementById('noBtnClone');
    if (clone) {
        clone.querySelector('.btn-text').textContent = newText;
    }
}

// ===== MODAL FUNCTIONS =====
function showModal() {
    elements.modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset no button
    setTimeout(() => {
        resetNoButton();
    }, 300);
}

function resetNoButton() {
    noButtonAttempts = 0;
    
    // Remove any existing clone
    const clone = document.getElementById('noBtnClone');
    if (clone) {
        clone.remove();
    }
    
    // Reset original button
    elements.noBtn.classList.remove('moving');
    elements.noBtn.style.display = 'block'; // Ensure it's visible
    elements.noBtn.style.visibility = 'visible';
    elements.noBtn.style.position = 'static';
    elements.noBtn.style.left = 'auto';
    elements.noBtn.style.top = 'auto';
    elements.noBtn.style.transition = 'all 0.3s ease';
    elements.noBtn.querySelector('.btn-text').textContent = 'No';
}

// ===== FLOATING HEARTS ANIMATION =====
function startFloatingHearts() {
    const canvas = elements.heartsCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Heart particles array
    const hearts = [];
    
    // Heart class
    class Heart {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = Math.random() * 20 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            // Fade out as it rises
            if (this.y < canvas.height * 0.3) {
                this.opacity *= 0.98;
            }
            
            // Reset if out of bounds or too faded
            if (this.y < -50 || this.opacity < 0.01) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', 0, 0);
            ctx.restore();
        }
    }
    
    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        hearts.push(new Heart());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        
        heartsAnimation = requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
    const colors = ['#ff6b9d', '#ee5a6f', '#c44569', '#ffd3b6', '#ff8fab', '#ffd700'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 10);
    }
}

function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
        transition: all 2s ease-out;
        z-index: 9999;
        pointer-events: none;
    `;
    
    document.body.appendChild(confetti);
    
    // Animate fall
    setTimeout(() => {
        confetti.style.top = '100%';
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 200}px)`;
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

// ===== HEART BURST ANIMATION =====
function createHeartBurst() {
    const heartCount = 30;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createBurstHeart(centerX, centerY, i);
        }, i * 50);
    }
}

function createBurstHeart(centerX, centerY, index) {
    const heart = document.createElement('div');
    const angle = (index / 30) * Math.PI * 2;
    const velocity = 200 + Math.random() * 200;
    const size = 20 + Math.random() * 30;
    
    heart.textContent = '❤️';
    heart.style.cssText = `
        position: fixed;
        font-size: ${size}px;
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%);
        z-index: 9999;
        pointer-events: none;
        transition: all 1.5s ease-out;
    `;
    
    document.body.appendChild(heart);
    
    // Animate burst
    setTimeout(() => {
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`;
        heart.style.opacity = '0';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// ===== SPARKLES =====
function createSparkles() {
    const sparklesContainer = document.querySelector('.sparkles');
    if (!sparklesContainer) return;
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
        sparkle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparklesContainer.appendChild(sparkle);
    }
}

function createSuccessSparkles() {
    const successContent = document.querySelector('.success-content');
    if (!successContent) return;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkle 2s linear;
                z-index: 1;
            `;
            successContent.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 2000);
        }, i * 100);
    }
}

// ===== DARK MODE =====
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const icon = elements.darkModeToggle.querySelector('.control-icon');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
}

function checkDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        elements.darkModeToggle.querySelector('.control-icon').textContent = '☀️';
    }
}

// ===== TEST AUDIO FUNCTION =====
function testAudioPlay() {
    console.log('🎵 Test audio button clicked!');
    const music = elements.backgroundMusic;
    
    if (music) {
        console.log('🎵 Audio element found:', music);
        console.log('🎵 Current time:', music.currentTime);
        console.log('🎵 Duration:', music.duration);
        console.log('🎵 Paused:', music.paused);
        console.log('🎵 Muted:', music.muted);
        console.log('🎵 Ready state:', music.readyState);
        
        // Force play
        music.play().then(() => {
            console.log('✅ Test audio playing successfully! 🎵');
            music.isPlaying = true;
        }).catch(error => {
            console.log('❌ Test audio failed:', error);
            console.log('🔄 Trying muted...');
            music.muted = true;
            music.play().then(() => {
                console.log('✅ Test audio playing muted!');
                music.isPlaying = true;
            }).catch(mutedError => {
                console.log('❌ Even muted test failed:', mutedError);
            });
        });
    } else {
        console.log('❌ Audio element not found!');
    }
}

// ===== MUSIC CONTROLS =====
function startBackgroundMusic() {
    const music = elements.backgroundMusic;
    
    console.log('🎵 Starting Anjaan.wav background music...');
    console.log('Audio element:', music);
    console.log('Audio source:', music.querySelector('source').src);
    
    // Set initial state
    music.isPlaying = false;
    
    // Try to play the WAV audio (WAV usually has better autoplay support)
    music.play().then(() => {
        console.log('✅ Anjaan.wav background music started successfully! 🎵');
        music.isPlaying = true;
    }).catch(error => {
        console.log('❌ Anjaan.wav autoplay blocked:', error);
        console.log('🔄 Trying muted playback first...');
        
        // Try muted first
        music.muted = true;
        music.play().then(() => {
            console.log('✅ Anjaan.wav playing muted, attempting to unmute...');
            music.isPlaying = true;
            
            // Try to unmute after a short delay
            setTimeout(() => {
                music.muted = false;
                console.log('🔊 Attempting to unmute Anjaan.wav...');
            }, 1000);
        }).catch(mutedError => {
            console.log('❌ Even muted playback failed:', mutedError);
            music.isPlaying = false;
        });
    });
}

function stopBackgroundMusic() {
    const music = elements.backgroundMusic;
    
    if (music && music.isPlaying) {
        music.pause();
        music.currentTime = 0;
        music.isPlaying = false;
        console.log('⏹️ Anjaan.wav background music stopped successfully!');
    } else {
        console.log('🔇 Anjaan.wav was not playing or already stopped');
    }
}

function toggleMusic() {
    const music = elements.backgroundMusic;
    
    if (music.isPlaying) {
        stopBackgroundMusic();
    } else {
        startBackgroundMusic();
    }
}

// ===== PERSONALIZATION =====
function openPersonalizeModal() {
    const modal = document.createElement('div');
    modal.className = 'personalize-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Personalize Your Proposal 💕</h3>
            <input type="text" id="nameInput" placeholder="Enter their name..." maxlength="30">
            <div class="modal-buttons">
                <button class="btn btn-primary" id="saveNameBtn">Save</button>
                <button class="btn btn-secondary" id="cancelNameBtn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('nameInput').focus();
    }, 100);
    
    // Add event listeners
    document.getElementById('saveNameBtn').addEventListener('click', savePersonalizedName);
    document.getElementById('cancelNameBtn').addEventListener('click', closePersonalizeModal);
    document.getElementById('nameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') savePersonalizedName();
    });
}

function showMusicMissingMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: #333;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: fadeInUp 0.5s ease-out;
    `;
    message.textContent = '🎵 Music file not found. Add romantic-music.mp3 to assets folder';
    
    document.body.appendChild(message);
    
    // Remove message after 4 seconds
    setTimeout(() => {
        message.style.animation = 'fadeIn 0.5s ease-out reverse';
        setTimeout(() => message.remove(), 500);
    }, 4000);
}

function showMusicMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: #333;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: fadeInUp 0.5s ease-out;
    `;
    message.textContent = '🎵 Click anywhere to enable background music';
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'fadeIn 0.5s ease-out reverse';
        setTimeout(() => message.remove(), 500);
    }, 3000);
    
    // Enable music on first user interaction
    document.addEventListener('click', enableMusicOnce, { once: true });
}

function enableMusicOnce() {
    elements.backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        elements.musicToggle.querySelector('.control-icon').textContent = '🔇';
    }).catch(error => {
        console.log('Music still failed:', error);
    });
}

function playSuccessSound() {
    // Create a simple success sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ===== PERSONALIZATION =====
function personalizeName() {
    const currentName = elements.heroName.textContent.replace(',', '').trim();
    const newName = prompt('Enter the name you want to personalize:', currentName);
    
    if (newName && newName.trim()) {
        elements.heroName.textContent = `${newName.trim()},`;
        localStorage.setItem('personalizedName', newName.trim());
    }
}

// Load saved name
function loadPersonalizedName() {
    const savedName = localStorage.getItem('personalizedName');
    if (savedName) {
        elements.heroName.textContent = `${savedName},`;
    }
}

// ===== SHARE FUNCTIONALITY =====
function shareMoment() {
    const shareData = {
        title: 'She said YES! 💍',
        text: 'I just got engaged! The love of my life said YES to my proposal! ❤️',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(error => {
            console.log('Share failed:', error);
            copyToClipboard();
        });
    } else {
        copyToClipboard();
    }
}

function copyToClipboard() {
    const text = 'I just got engaged! The love of my life said YES to my proposal! ❤️';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyMessage();
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyMessage();
    }
}

function showCopyMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: fadeInUp 0.5s ease-out;
    `;
    message.textContent = '📋 Copied to clipboard!';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeIn 0.5s ease-out reverse';
        setTimeout(() => message.remove(), 500);
    }, 2000);
}

// ===== RESTART EXPERIENCE =====
function restartExperience() {
    // Hide success screen
    elements.successScreen.style.display = 'none';
    
    // Stop background audio
    if (window.proposalAudio) {
        window.proposalAudio.pause();
        window.proposalAudio = null;
    }
    
    // Show start screen again
    elements.startScreen.style.display = 'block';
    elements.heroContent.style.display = 'none';
    
    // Reset no button
    resetNoButton();
    
    // Reset love message animation
    resetLoveMessage();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('🔄 Experience reset - showing start screen again');
}

// ===== LOVE MESSAGE RESET =====
function resetLoveMessage() {
    const loveTexts = document.querySelectorAll('.love-text');
    loveTexts.forEach(text => {
        text.style.animation = 'none';
        text.style.opacity = '0';
    });
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyPress(event) {
    switch(event.key) {
        case 'Enter':
        case ' ':
            // If on success screen, restart on space/enter
            if (elements.successScreen.style.display === 'flex') {
                event.preventDefault();
                restartExperience();
            }
            break;
        case 'Escape':
            // Close modal if open
            if (elements.modalOverlay.style.display === 'flex') {
                closeModal();
            }
            break;
        case 'd':
        case 'D':
            // Toggle dark mode with 'D' key
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                toggleDarkMode();
            }
            break;
        case 'm':
        case 'M':
            // Toggle music with 'M' key
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                toggleMusic();
            }
            break;
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize resize events
window.addEventListener('resize', debounce(() => {
    // Canvas will auto-resize in the animation loop
}, 250));

// ===== INITIALIZATION COMPLETE =====
// Load saved preferences
loadPersonalizedName();

// Add loading complete class for CSS transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Prevent context menu on certain elements for better UX
elements.yesBtn.addEventListener('contextmenu', (e) => e.preventDefault());
elements.noBtn.addEventListener('contextmenu', (e) => e.preventDefault());

// Enhanced Exotic Jungle Adventure UI with Keyboard Synchronization
const images = [
    { src: './images/bat.jpeg', word: 'BAT' },
    { src: './images/cat.jpeg', word: 'CAT' },
    { src: './images/dog.jpeg', word: 'DOG' },
    { src: './images/goat.jpeg', word: 'GOAT' },
    { src: './images/hen.jpeg', word: 'HEN' },
    { src: './images/horse.jpeg', word: 'HORSE' },
    { src: './images/lion.jpeg', word: 'LION' },
    { src: './images/duck.jpeg', word: 'DUCK' },
    { src: './images/lizard.jpeg', word: 'LIZARD' },
    { src: './images/monkey.jpeg', word: 'MONKEY' }
];

const MAX_WORDS = 5;

let currentImageIndex = 0;
let currentWord = '';
let userSpelling = '';
let correctAnswers = [];
let incorrectAnswers = [];
let timer;

const imageElement = document.getElementById('current-image');
const spellingBoxes = document.getElementById('spelling-boxes');
const alphabetContainer = document.getElementById('alphabet-container');
const timerElement = document.getElementById('timer');
const feedbackSection = document.getElementById('feedback-section');
const nextButton = document.getElementById('next-button');
const reportSection = document.getElementById('report-section');
const reportList = document.getElementById('report-list');
const endGameSection = document.getElementById('end-game-section');
const restartButton = document.getElementById('restart-button');
const quitButton = document.getElementById('quit-button');
const cancelButton = document.getElementById('cancel-button');
const clearButton = document.getElementById('clear-button');
const submitButton = document.getElementById('submit-button');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const gameElements = [imageElement, spellingBoxes, alphabetContainer, timerElement, feedbackSection, nextButton, cancelButton, clearButton, submitButton];

// Create letter buttons and add to the alphabet container
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
alphabet.split('').forEach(letter => {
    const button = document.createElement('button');
    button.className = 'alphabet-btn button-jungle py-3 px-4 rounded shadow-md text-lg jungle-text hover:scale-105 transition-transform';
    button.innerText = letter;
    button.id = `btn-${letter}`; // Assign an ID for easy access
    button.addEventListener('click', () => handleLetterClick(letter));
    alphabetContainer.appendChild(button);
});

// Listen for keydown events to sync with the keyboard
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    if (alphabet.includes(key)) {
        const button = document.getElementById(`btn-${key}`);
        if (button) {
            button.classList.add('bg-yellow-300'); // Visual feedback for key press
            setTimeout(() => button.classList.remove('bg-yellow-300'), 200); // Remove feedback after a brief delay
            handleLetterClick(key);
        }
    }
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    shuffle(images);
    currentImageIndex = 0;
    correctAnswers = [];
    incorrectAnswers = [];
    reportList.innerHTML = '';
    loadNextImage();
}

function loadNextImage() {
    if (currentImageIndex >= MAX_WORDS) {
        displayReport();
        return;
    }

    const currentImage = images[currentImageIndex];
    imageElement.src = currentImage.src;
    currentWord = currentImage.word;
    userSpelling = '';
    spellingBoxes.innerHTML = '';
    feedbackSection.classList.add('hidden');
    nextButton.classList.add('hidden');
    alphabetContainer.classList.remove('hidden');
    submitButton.classList.add('hidden');
    timerElement.innerText = '60';

    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
        handleSpellingResult(false);
    }, 60000);

    startCountdown();
}

function handleLetterClick(letter) {
    if (userSpelling.length < currentWord.length) {
        userSpelling += letter;
        updateSpellingBoxes();
    }

    if (userSpelling.length === currentWord.length) {
        submitButton.classList.remove('hidden');
    }
}

function updateSpellingBoxes() {
    spellingBoxes.innerHTML = '';
    for (let i = 0; i < userSpelling.length; i++) {
        const box = document.createElement('span');
        box.innerText = userSpelling[i];
        box.className = 'jungle-text';
        spellingBoxes.appendChild(box);
    }
}

cancelButton.addEventListener('click', () => {
    if (userSpelling.length > 0) {
        userSpelling = userSpelling.slice(0, -1);
        updateSpellingBoxes();
        submitButton.classList.add('hidden');
    }
});

clearButton.addEventListener('click', () => {
    userSpelling = '';
    updateSpellingBoxes();
    submitButton.classList.add('hidden');
});

submitButton.addEventListener('click', () => {
    clearTimeout(timer);
    handleSpellingResult(userSpelling === currentWord);
});

function startCountdown() {
    let timeLeft = 60;
    timerElement.innerText = timeLeft;
    window.countdownInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(window.countdownInterval);
            handleSpellingResult(false);
        }
    }, 1000);
}

function handleSpellingResult(isCorrect) {
    alphabetContainer.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    submitButton.classList.add('hidden');

    if (isCorrect) {
        correctAnswers.push(currentWord);
        correctSound.play();
        feedbackSection.innerText = 'Correct! 🦜';
        feedbackSection.classList.add('animated-item');
    } else {
        incorrectAnswers.push(currentWord);
        incorrectSound.play();
        feedbackSection.innerText = `Incorrect! The correct spelling is ${currentWord} 🐒`;
    }

    // Move to next image after a short delay (2 seconds)
    setTimeout(() => {
        currentImageIndex++;
        if (currentImageIndex < MAX_WORDS) {
            loadNextImage();
        } else {
            displayReport();
        }
    }, 2000); // 2-second delay

    clearInterval(window.countdownInterval);
}

function displayReport() {
    // Hide all game elements
    gameElements.forEach(element => element.classList.add('hidden'));

    reportSection.classList.remove('hidden');
    endGameSection.classList.remove('hidden');
    reportList.innerHTML = ''; // Clear previous report

    const correctHeading = document.createElement('h3');
    correctHeading.innerText = "Correct Answers 🏆";
    correctHeading.className = 'text-green-400 text-2xl font-bold';
    reportList.appendChild(correctHeading);

    correctAnswers.forEach(word => {
        const correctItem = document.createElement('li');
        correctItem.innerText = word;
        correctItem.className = 'text-green-300 text-xl';
        reportList.appendChild(correctItem);
    });

    const incorrectHeading = document.createElement('h3');
    incorrectHeading.innerText = "Incorrect Answers ❌";
    incorrectHeading.className = 'text-red-400 text-2xl font-bold mt-4';
    reportList.appendChild(incorrectHeading);

    incorrectAnswers.forEach(word => {
        const incorrectItem = document.createElement('li');
        incorrectItem.innerText = word;
        incorrectItem.className = 'text-red-300 text-xl';
        reportList.appendChild(incorrectItem);
    });

    restartButton.onclick = () => {
        // Reset visibility of game elements
        gameElements.forEach(element => element.classList.remove('hidden'));

        reportList.innerHTML = ''; // Clear previous report
        reportSection.classList.add('hidden');
        endGameSection.classList.add('hidden');
        startGame();
    };

    quitButton.onclick = () => {
        if (confirm('Are you sure you want to quit?')) {
            alert('Thanks for playing the Jungle Adventure!');
        }
    };
}

window.onload = startGame;

//Game block
const gameContainer = document.getElementById("game");
//Mask to block the cards/game before game start and during SetTimeout
const mask = document.getElementById("mask");
//Start button for the game
const startButton = document.getElementById('start');

const resetGame = document.querySelector('.reset-game');
//Shows score
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');

//Set High Score in local Storage
if (localStorage.highScore === undefined) {
    localStorage.setItem("highScore", "--");
} else {
    highScoreDisplay.innerText = localStorage.highScore;
}

//How many images will be in there be to match in the game
//How many matches determine a WIN
const numberOfMatches = 6;

// GIFS Array requires a naming convention on images 'img-' followed by incrementor (example: img-1.gif);
const GIFS = [];
//Loop that populates immage objects into GIFS array
for (let i = 1; i < (numberOfMatches + 1); i++) {
    GIFS.push({img:`<img src="images/img-${i}.gif" class="image" data-img="${i}">`, id:`${i}`});
    GIFS.push({img:`<img src="images/img-${i}.gif" class="image" data-img="${i}">`, id:`${i}`});
} 


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}


//Shuffle the images
let shuffledGifs = shuffle(GIFS);


//Create the flip card elments
function createDivsThatFlip(gifArray) {
  for (let gif of gifArray) {
    // Create a new div - Card Container
    const newCard = document.createElement("div");
    // Create new div - Inner Card
    const newCardInner = document.createElement("div");
    // Create new div - Front of Card
    const newCardFront = document.createElement("div");
    // Create new div - Back of Card
    const newCardBack = document.createElement("div");

    // give container flip-card class
    newCard.classList.add('flip-card');
    // Set data-id attribute to image number
    newCard.setAttribute('data-id', gif['id'])
    // give class to inner, front, and back
    newCardInner.classList.add('flip-card-inner');
    newCardFront.classList.add('flip-card-front');
    newCardBack.classList.add('flip-card-back');

    // add image tag to each card back
    newCardBack.innerHTML = gif['img'];
    // Append front and back to inner then append inner to container
    newCardInner.append(newCardFront);
    newCardInner.append(newCardBack);
    newCard.append(newCardInner)

    // call a function handleCardClick when a div is clicked on
    newCard.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newCard);
  }
}


//Cards array to store clicked cards
let cards = [];
//Keep count of matches to know when game is won
let matches = 0;
//Keep score with incrementor
let score = 0;


// TODO: Implement this function!
function handleCardClick(event) {

    //Check if target is image, if so don't use Listener, entire function sits in this condition
    if(event.target.classList.contains('flip-card-front') && !event.target.classList.contains('match-shadow')) {

        //Add to the score on every click listened and display
        score++;
        scoreDisplay.innerText = score;

        //Move up the DOM to capture the card container 
        //We toggle the 'flip-card-over' class on the container
        const cardInner = event.target.parentElement;
        const cardContainer = cardInner.parentElement;
        //On click we add the flip-card-over class which flips card
        cardContainer.classList.add('flip-card-over');

        //Capture the data-id of card
        let cardID = parseInt(cardContainer.getAttribute('data-id'));
        //Push card element and cardID to card array
        cards.push({card: cardContainer, cardId: cardID});


        //Only check if there's more than one card in the array
        if(cards.length > 1) {

            //Check for match
            if(cards[0]['cardId'] === cardID) {
                //Block game board for short time
                mask.style.cssText = `display: block`;

                //Without listeners on the images nothing happens if the user continues clicking on matched cards
                //Just for us to know
                console.log("Match");

                //Highlight card with green shadow to indicate a match
                cards[0]['card'].classList.add('match-shadow');
                cards[1]['card'].classList.add('match-shadow');
                
                //This setTimeout accounts for the time in the flipping animation 
                //It prevents user from adding a match to the cards array a second time
                setTimeout(function() {
                //Clear array for next card set
                cards = [];
                mask.style.cssText = `display: none`;
                }, 800);
                
                //Increment matches
                matches++;

            //If the cards don't match
            } else {
                //Block game board with mask
                mask.style.cssText = `display: block`;

                //Highlight card with red shadow to indicate a NO match
                cards[0]['card'].classList.add('no-match-shadow');
                cards[1]['card'].classList.add('no-match-shadow');
                
                //Set 1 second timeout
                setTimeout(function(){ 
                    //Flip cards back over and alert missmatch with red shadow
                    cards[0]['card'].classList.remove('flip-card-over', 'no-match-shadow');
                    cards[1]['card'].classList.remove('flip-card-over', 'no-match-shadow');

                    //clear cards array for next card set
                    cards = [];
                    //Lastly remove the mask to restore play
                    mask.style.cssText = `display: none`;
                }, 1500);
            } //End of conditional for comparing matchers
        }//End of conditional checking for more than 1 card

        //If matches hits max game is won
        if(matches === numberOfMatches) {
            resetGame.style.cssText = 'bottom: 0';
            //Save high score in local storage
            if (localStorage.highScore === '--' || localStorage.highScore > score) {
                localStorage.highScore = score;
            }

            //Add event listener to Start button
            startButton.addEventListener('click', startNewGame);
        }
    }//End of conditional for checking if target is image
}// End of handleCardClick


// Function to restart the board
function startNewGame() {
    //Clear game area
    gameContainer.innerText = '';
    //Reshuffle gifs
    let nextshuffledGifs = shuffle(GIFS);
    //Create divs again
    createDivsThatFlip(nextshuffledGifs);
    //Reset matches and scores
    matches = 0;
    score = 0;
    scoreDisplay.innerText = score;
    //Display high score from local storag
    highScoreDisplay.innerText = localStorage.highScore;
    //Push the reset game area back below the page
    resetGame.style.cssText = 'bottom: -220';
    //Just checking
    console.log("New Game Started");
}

// when the DOM loads
createDivsThatFlip(shuffledGifs);



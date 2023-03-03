/** The code initializes several variables by selecting specific elements from the HTML document using their ID or class names:
 * _question: represents the HTML element with the ID "question".
 * _options: represents the HTML element with the class "trivia-options".
 * _checkBtn: represents the HTML element with the ID "check-answer".
 * _playAgainBtn: represents the HTML element with the ID "play-again".
 * _result: represents the HTML element with the ID "result".
 * _correctScore: represents the HTML element with the ID "correct-score".
 * _totalQuestion: represents the HTML element with the ID "total-question".
 * These variables are used throughout the code to manipulate the corresponding elements.
*/

const _question = document.getElementById('question');
const _options = document.querySelector('.trivia-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

/** Declares three variables, correctAnswer, correctScore, and askedCount, and initializes them to "", 0,
 * and 0 respectively using destructuring assignment.
*/

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 0;

/** Creates a new Audio object with the background.mp3 file
 *  and sets the loop property to true.
*/

var audio = new Audio('background.mp3');
audio.loop = true;

/** The document.body.addEventListener function adds an event listener to the mousemove event on the
 * page's body element. When the mouse moves, the function passed as the second argument is called, 
 * which in this case plays the background audio.
*/

document.body.addEventListener("mousemove", function () {
    audio.play();
});


/** The window.onload event is set to the onWindowLoad function. This function prompts the user to enter
 * the number of questions they want to answer. If the user enters a value, the totalQuestion variable is 
 * set to that value. Otherwise, an alert is shown to the user, and totalQuestion is set to a default 
 * value of 5. The total number of questions is displayed on the page in the element with the ID 
 * total-question.
*/

window.onload = onWindowLoad;

function onWindowLoad() {
    const response = prompt('Enter the number of questions: ');
 
    if (response) {
      totalQuestion = response;
    } else {
      alert('You did not enter any number.');
      totalQuestion = 5;
    } 
    _totalQuestion.textContent = totalQuestion;
}

/** This is an asynchronous function that loads a trivia question from an API and displays it on the page.
 * It begins by defining a constant variable APIUrl which is set to the URL of the API endpoint that will 
 * be used to fetch the question.
 * It uses the fetch function to make a GET request to the API URL and waits for the result using the
 * await keyword.
 * The response is then parsed as JSON using the json() method and the resulting data is stored in the
 * data variable using await.
 * The _result element's innerHTML is cleared using "" to ensure that any previous question is remove
 * from the page.
 * The showQuestion() function is called and passed the first question object from the data.results array
 * to display it on the page.
*/

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);

}

/** This function sets up event listeners for the "Check Answer" and "Play Again" buttons */

function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartTrivia);
}

/** When the DOM is fully loaded, this event listener calls the loadQuestion and eventListeners functions
 * and updates the text content for the total question and correct score counters
*/

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

// Function to show the question on the screen with options

function showQuestion(data){
    // Enable the check answer button
    _checkBtn.disabled = false;
    // Get the correct answer from the API data
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    // Insert the correct answer in a random position in the array of options
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    // Show the question and category on the scree
    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    // Show the options on the screen   
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    // Call selectOption function to enable option selection
    selectOption();
}

// Function to enable the selection of option

function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// Function to check if the selected answer is correct or not

function checkAnswer(){
     // Disable the check answer button
    _checkBtn.disabled = true;
    // Load audio for correct answer
    const _correct = new Audio('correct.mp3');
    // Load audio for wrong answer
    const _wrong = new Audio('wrong.mp3');
    
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        // If selected answer is correct
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
             // Play correct answer audio
            _correct.play();
        } else {
            // If selected answer is wrong
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
            // Play wrong answer audio
            _wrong.play();
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// Function to decode HTML entities

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// Function to check the count of total questions

function checkCount(){
    askedCount++;
    // Update the count of total questions and correct score
    setCount();
     // If all questions are asked
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);


        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        // Pause the background music
        audio.pause();
        // Show the play again button
        _playAgainBtn.style.display = "block";
        // Hide the check answer button
        _checkBtn.style.display = "none";
    } else {
        // Load the next question after a delay of 300ms
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

/** The setCount() function updates the text content of the HTML elements representing the total number of 
 * questions and the number of correct answers.
*/

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

/** The restartTrivia() function resets the game by setting the variables correctScore and askedCount to 
 * 0, hiding the "play again" button and showing the "check answer" button, enabling the "check answer" 
 * button, calling the setCount() function to update the score display, calling the loadQuestion() 
 * function to load a new question, playing the background music again, and calling the onWindowLoad() 
 * function.
*/

function restartTrivia(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
    audio.play();
    onWindowLoad();
}
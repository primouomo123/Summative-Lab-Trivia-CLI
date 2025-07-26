import chalk from "chalk";
import { select, input } from "@inquirer/prompts";
import { currentGameState, totalGameState } from "./state.js";

//This is the function to show the Main Menu of the game
export async function showMainMenu() {
  const action = await select({
    //I wrote a message informing the user that they have 10 seconds to answer each question
    message: "Welcome to the Trivia CLI\nYou have 10 seconds to finish each question.\n \nMain Menu",
    choices: [
      { name: "Start Game", value: "start" },
      { name: "See Total Stats", value: "stats" },
      { name: "Reset Stats", value: "reset" },
      { name: "Quit", value: "quit" },
    ],
  });

  //With the switch, a different function is called depending on the action the user selected
  switch (action) {
    case "start":
      await startGame();
      break;
    case "stats":
      showStats();
      await select({
        message: "Press Enter to go back",
        choices: [{ name: "Back", value: "back" }],
      });
      await showMainMenu();
      break;
    case "reset":
      resetGame();
      console.log(chalk.blue("Stats have been reset."));
      await showMainMenu();
      break;
    case "quit":
      console.log("Goodbye!");
      process.exit(0);
  }
}

//This is the function that performs the game
export async function startGame() {
  const questions = [
    {
      question: "What is the capital of Canada?",
      choices: ["a) Toronto", "b) Vancouver", "c) Montreal", "d) Ottawa"],
      answer: "d",
    },
    {
      question: "Which planet is known as the 'Red Planet'?",
      choices: ["a) Venus", "b) Mars", "c) Jupiter", "d) Saturn"],
      answer: "b",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      choices: [
        "a) Charles Dickens",
        "b) Jane Austen",
        "c) William Shakespeare",
        "d) Mark Twain",
      ],
      answer: "c",
    },
    {
      question: "How many continents are there on Earth?",
      choices: ["a) 7", "b) 6", "c) 5", "d) 8"],
      answer: "a",
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      choices: ["a) Gold", "b) Oxygen", "c) Osmium", "d) Ozone"],
      answer: "b",
    },
    {
      question: "Who painted the Mona Lisa?",
      choices: [
        "a) Vincent Van Gogh",
        "b) Leonardo da Vinci",
        "c) Pablo Picasso",
        "d) Michelangelo",
      ],
      answer: "b",
    },
    {
      question: "In which year did the Titanic sink?",
      choices: ["a) 1910", "b) 1912", "c) 1920", "d) 1905"],
      answer: "b",
    },
    {
      question: "Which language has the most native speakers?",
      choices: ["a) English", "b) Mandarin Chinese", "c) Spanish", "d) Hindi"],
      answer: "b",
    },
    {
      question: "What is the largest mammal in the world?",
      choices: ["a) Blue whale", "b) Elephant", "c) Giraffe", "d) Whale shark"],
      answer: "a",
    },
    {
      question: "How many degrees are in a right angle?",
      choices: ["a) 180", "b) 60", "c) 90", "d) 120"],
      answer: "c",
    },
    {
      question: "What is the name of Harry Potter's pet owl?",
      choices: ["a) Crookshanks", "b) Hedwig", "c) Scabbers", "d) Buckbeak"],
      answer: "b",
    },
    {
      question: "Which country is famous for inventing pizza?",
      choices: ["a) Greece", "b) Italy", "c) France", "d) Turkey"],
      answer: "b",
    },
    {
      question: "What does DNA stand for?",
      choices: [
        "a) Digital Network Architecture",
        "b) Dynamic Nucleic Acid",
        "c) Deoxyribonucleic Acid",
        "d) Dendrite Neurological Agent",
      ],
      answer: "c",
    },
    {
      question: "Which U.S. president abolished slavery?",
      choices: [
        "a) George Washington",
        "b) Abraham Lincoln",
        "c) John F. Kennedy",
        "d) Franklin D. Roosevelt",
      ],
      answer: "b",
    },
    {
      question: "What is the smallest prime number?",
      choices: ["a) 0", "b) 2", "c) 3", "d) 1"],
      answer: "b",
    },
    {
      question: "Which video game character is known for eating dots?",
      choices: ["a) Mario", "b) Donkey Kong", "c) Pac-Man", "d) Sonic"],
      answer: "c",
    },
    {
      question: "What is the hardest natural substance on Earth?",
      choices: ["a) Diamond", "b) Quartz", "c) Steel", "d) Obsidian"],
      answer: "a",
    },
    {
      question: "How many legs does a spider have?",
      choices: ["a) 6", "b) 8", "c) 10", "d) 12"],
      answer: "b",
    },
    {
      question: "Which ocean is the largest?",
      choices: ["a) Atlantic", "b) Pacific", "c) Indian", "d) Arctic"],
      answer: "b",
    },
    {
      question: "What is the square root of 144?",
      choices: ["a) 10", "b) 12", "c) 14", "d) 16"],
      answer: "b",
    },
  ];

  //This is the loop to iterate over each question
  for (const question of questions) {
    try { // valid execution occurs in try (This is an outter try)
      console.log(chalk.cyan(question.question)); //This is to show the question of the current iteration
      console.log(question.choices.join("\n")); //This is to show the current answer choices of the current iteration

      const countdown = startCountdown(10); //This is to show the countdown to the user when they're about to answer

      let userAnswer; //It's declared here so, I can have access to this variable in the outter and inner try

      try { // valid execution occurs in try (this is the inner try)
        userAnswer = await Promise.race([ /* With promise.race I can have an array of 2 promises,
        so it lets me wait for the user to answer or jump to the next question if
        no answer within 10 seconds */
          input({ message: "(Type a, b, c, or d)" }), /* This shows the options the user should choose while their about to
          enter their input and this is the first promise of the Promise.race */

          new Promise((_, reject) => //This is the second promise, in case the user doesn't answer within 10 seconds
            setTimeout(() => reject(new Error("timeout")), 10000)
          ),
        ]);
        countdown.cancel(); /* This is to cancel the countdown if the user answered before time's up, so it can restart in the next
        iteration */
        
      } catch (err) { /* This is what happens if the second promise (new promise) is done before */
        countdown.cancel(); //This is cancels the countdown and it's restarted with the next question
        throw err; //This makes the err available in the outer try...catch
      }

      let userInput;

      //This if..else is to validate the user input and make it lower case if needed
      if (userAnswer !== null && userAnswer !== undefined) {
        userInput = userAnswer.trim().toLowerCase();
      } else {
        userInput = "";
      }

      const validLetters = ["a", "b", "c", "d"];

      if (!validLetters.includes(userInput)) { //This first if is to count invalid inputs as incorrect answers
        currentGameState.incorrect++;
        totalGameState.incorrect++;
        console.log(chalk.red("Invalid input. Answer considered incorrect."));
      } else if (userInput === question.answer) { //This is to count the correct answers
        currentGameState.correct++;
        totalGameState.correct++;
        console.log(chalk.green("Correct!"));
      } else { //This is to count incorrect answers
        currentGameState.incorrect++;
        totalGameState.incorrect++;
        console.log(chalk.red("Incorrect!"));
      }
    } catch (err) { //This is the outter catch
      if (err.message === "timeout") {
        console.log(chalk.yellow("Time's up! Moving to the next question.")); //This is the message to be shown when time's up.
        currentGameState.unanswered++;
        totalGameState.unanswered++;
      } else {
        console.error("Unexpected error:", err); //This is in case there's an unespected error
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); //This is to make a 1 second pause between questions
  }

  showCurrentGameStats(); //I call this function to show the current game stats
  resetCurrentGame(); //Then, I call this function to clear the current game stat to have it ready for the next game
  await showMainMenu(); //I call showMainMenu, so the user can try the game again, see total stats or exit the game
}

// Show total stats
export function showStats() {

  //This if is to show "You don't have any game stats, yet" message in case no total stats have been saved, yet
  if (totalGameState.correct === 0 && totalGameState.incorrect === 0 && totalGameState.unanswered === 0) {
    console.log(chalk.yellow("You don't have any game stats, yet"));
    return;
  }

  //The following 4 console logs is to show the total stats, in case the user wants to see them.
  console.log(chalk.blue("Total Game Statistics:"));
  console.log(chalk.green(`Correct answers: ${totalGameState.correct}`));
  console.log(chalk.red(`Incorrect answers: ${totalGameState.incorrect}`));
  console.log(chalk.yellow(`Unanswered questions: ${totalGameState.unanswered}`));
}

// Reset total stats
export function resetGame() {
  totalGameState.correct = 0;
  totalGameState.incorrect = 0;
  totalGameState.unanswered = 0;
}

// Show current session stats
export function showCurrentGameStats() {
  console.log(chalk.blue("Current Game Statistics:"));
  console.log(chalk.green(`Correct answers: ${currentGameState.correct}`));
  console.log(chalk.red(`Incorrect answers: ${currentGameState.incorrect}`));
  console.log(chalk.yellow(`Unanswered questions: ${currentGameState.unanswered}`));
}

// Reset current session stats
export function resetCurrentGame() {
  currentGameState.correct = 0;
  currentGameState.incorrect = 0;
  currentGameState.unanswered = 0;
}

// Countdown with cancel support
function startCountdown(seconds) {
  let interval; //This is to save the interval ID in thus function
  let timeout; //This is to save the Timeout ID in this function

  const countdownPromise = new Promise((resolve) => {
    let remaining = seconds;

    process.stdout.write(chalk.gray(`${remaining}s`)); //This is to show the remaining seconds

    interval = setInterval(() => {
      remaining--;
      if (remaining >= 0) {
        process.stdout.write(
          chalk.gray(`\r${remaining}s `) // This is to verwrite the remaining seconds in the same line
        );
      }
    }, 1000);

    timeout = setTimeout(() => { //This timeout is to clear the interval
      clearInterval(interval);
      resolve();
    }, seconds * 1000);
  });

  //This is to clear the interval and timeout in this function when the user answers within 10 seconds or time's up
  countdownPromise.cancel = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    process.stdout.write("\r\r"); // This clears the line of the countdown
  };

  return countdownPromise;
}
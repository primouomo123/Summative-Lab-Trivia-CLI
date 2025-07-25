import chalk from "chalk";
import { select } from "@inquirer/prompts";
import { currentGameState, totalGameState } from "./state.js";

//This is the function to show the Main Menu of the game
export async function showMainMenu() {
  const action = await select({
    //I wrote a message informing the user that they have 5 seconds to answer each question
    message: "Welcome to the Trivia CLI\nYou have 5 seconds to finish each question.\n \nMain Menu",
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
      await select({ message: "Press Enter to go back", choices: [{ name: "Back", value: "back" }] });
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
  // Questions array (each question is an object)
  const questions = [
    {
    question: "What is the capital of Canada?",
    choices: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
    answer: "Ottawa",
  },
  {
    question: "Which planet is known as the 'Red Planet'?",
    choices: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    choices: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
    answer: "William Shakespeare",
  },
  {
    question: "How many continents are there on Earth?",
    choices: ["7", "6", "5", "8"],
    answer: "7",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    choices: ["Gold", "Oxygen", "Osmium", "Ozone"],
    answer: "Oxygen",
  },
  {
    question: "Who painted the Mona Lisa?",
    choices: ["Vincent Van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    answer: "Leonardo da Vinci",
  },
  {
    question: "In which year did the Titanic sink?",
    choices: ["1910", "1912", "1920", "1905"],
    answer: "1912",
  },
  {
    question: "Which language has the most native speakers?",
    choices: ["English", "Mandarin Chinese", "Spanish", "Hindi"],
    answer: "Mandarin Chinese",
  },
  {
    question: "What is the largest mammal in the world?",
    choices: ["Blue whale", "Elephant", "Giraffe", "Whale shark"],
    answer: "Blue whale",
  },
  {
    question: "How many degrees are in a right angle?",
    choices: ["180", "60", "90", "120"],
    answer: "90",
  },
  {
    question: "What is the name of Harry Potter's pet owl?",
    choices: ["Crookshanks", "Hedwig", "Scabbers", "Buckbeak"],
    answer: "Hedwig",
  },
  {
    question: "Which country is famous for inventing pizza?",
    choices: ["Greece", "Italy", "France", "Turkey"],
    answer: "Italy",
  },
  {
    question: "What does DNA stand for?",
    choices: [
      "Digital Network Architecture",
      "Dynamic Nucleic Acid",
      "Deoxyribonucleic Acid",
      "Dendrite Neurological Agent"
    ],
    answer: "Deoxyribonucleic Acid",
  },
  {
    question: "Which U.S. president abolished slavery?",
    choices: ["George Washington", "Abraham Lincoln", "John F. Kennedy", "Franklin D. Roosevelt"],
    answer: "Abraham Lincoln",
  },
  {
    question: "What is the smallest prime number?",
    choices: ["0", "2", "3", "1"],
    answer: "2",
  },
  {
    question: "Which video game character is known for eating dots?",
    choices: ["Mario", "Donkey Kong", "Pac-Man", "Sonic"],
    answer: "Pac-Man",
  },
  {
    question: "What is the hardest natural substance on Earth?",
    choices: ["Diamond", "Quartz", "Steel", "Obsidian"],
    answer: "Diamond",
  },
  {
    question: "How many legs does a spider have?",
    choices: ["6", "8", "10", "12"],
    answer: "8",
  },
  {
    question: "Which ocean is the largest?",
    choices: ["Atlantic", "Pacific", "Indian", "Arctic"],
    answer: "Pacific",
  },
  {
    question: "What is the square root of 144?",
    choices: ["10", "12", "14", "16"],
    answer: "12",
  },
  ];

  //This is the loop to iterate over each question
  for (const question of questions) {
    try { /* valid execution occurs in try */
      const answer = await Promise.race([ /* With promise.race I can have an array of 2 promises,
        so it lets me wait for the user to answer or jump to the next question if
        no answer within 5 secodns */
        select({ /* Select is the first posible promise */
          message: question.question,
          choices: question.choices.map(choice => ({
            name: choice,
            value: choice,
          })),
        }),

        //This new promise is what's going to happen if no answer within 5 seconds
        new Promise((_, reject) =>
             /* If no answer within 5 seconds, this promise will throw an error to be managed
        by catch */
          setTimeout(() => reject(new Error("timeout")), 5000)
        ),
      ]);

      // If answered before timeout:
      if (answer === question.answer) { //This happens if the answer is correct
        currentGameState.correct++;
        console.log(chalk.green("Correct!"));
      } else { //This happens if the answer is incorrect
        currentGameState.incorrect++;
        console.log(chalk.red("Incorrect!"));
      }
    }

    //Catch manages the error if time's up
    catch (err) {
      if (err.message === "timeout") {
        console.log(chalk.yellow("Time's up! Moving to the next question."));
        currentGameState.unanswered++;
      } else {
        console.error("Unexpected error:", err);
      }
    }
  }

  //I show the current game stats after each game ends
  showCurrentGameStats();

  //I reset the current game stats, to have it ready for next game
  resetCurrentGame();

  //showMainMenu is called after each game is finished
  await showMainMenu();
}

export function showStats() {
  
  //If there's no stats, this will be the message to be shown when this function is called  
  if (totalGameState.correct === 0 && totalGameState.incorrect === 0 && totalGameState.unanswered === 0) {
    console.log(chalk.yellow("You don't have any game stats, yet"));
    return;
  }

  //When there's stats, these are the messages to be shown
  console.log(chalk.blue("Total Game Statistics:"));
  console.log(chalk.green(`Correct answers: ${totalGameState.correct}`));
  console.log(chalk.red(`Incorrect answers: ${totalGameState.incorrect}`));
  console.log(chalk.yellow(`Unanswered questions: ${totalGameState.unanswered}`));
}

export function resetGame() {
  totalGameState.correct = 0;
  totalGameState.incorrect = 0;
  totalGameState.unanswered = 0;
}

export function showCurrentGameStats() {
  console.log(chalk.blue("Current Game Statistics:"));
  console.log(chalk.green(`Correct answers: ${currentGameState.correct}`));
  console.log(chalk.red(`Incorrect answers: ${currentGameState.incorrect}`));
  console.log(chalk.yellow(`Unanswered questions: ${currentGameState.unanswered}`));
}

export function resetCurrentGame() {
  currentGameState.correct = 0;
  currentGameState.incorrect = 0;
  currentGameState.unanswered = 0;
}
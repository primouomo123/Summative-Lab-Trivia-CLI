import chalk from "chalk";
import { select } from "@inquirer/prompts";
import gameState from "./state.js";

//This is the function to show the Main Menu of the game
export async function showMainMenu() {
  const action = await select({
    //I wrote a message informing the user that they have 5 seconds to answer each question
    message: "Welcome to the Trivia CLI\nYou have 5 seconds to finish each question.\n \nMain Menu",
    choices: [
      { name: "Start Game", value: "start" },
      { name: "See Stats", value: "stats" },
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
      question: "What is the capital of the United States?",
      choices: ["Ottawa", "Washington State", "Washington DC", "Kingston"],
      answer: "Washington DC",
    },
    {
      question: "What is the capital of Brazil?",
      choices: ["Rio de Janeiro", "Sao Paulo", "Bahia", "Brasilia"],
      answer: "Brasilia",
    },
    {
      question: "What is the capital of Morocco?",
      choices: ["Casablanca", "Rabat", "Madrid", "Granada"],
      answer: "Rabat",
    },
    {
      question: "What is the capital of Thailand?",
      choices: ["Bangkok", "Beijing", "Tokyo", "Laos"],
      answer: "Bangkok",
    },
    {
      question: "What is the capital of Kenya?",
      choices: ["Angola", "Cairo", "Congo", "Nairobi"],
      answer: "Nairobi",
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
        gameState.correct++;
        console.log(chalk.green("Correct!"));
      } else { //This happens if the answer is incorrect
        gameState.incorrect++;
        console.log(chalk.red("Incorrect!"));
      }
    }

    //Catch manages the error if time's up
    catch (err) {
      if (err.message === "timeout") {
        console.log(chalk.yellow("Time's up! Moving to the next question."));
        gameState.unanswered++;
      } else {
        console.error("Unexpected error:", err);
      }
    }
  }

  //I show the current game stat after each game ends
  showStats();

  //showMainMenu is called after each game is finished
  await showMainMenu();
}

export function showStats() {
  
  //If there's no stats, this will be the message to be shown when this function is called  
  if (gameState.correct === 0 && gameState.incorrect === 0 && gameState.unanswered === 0) {
    console.log(chalk.yellow("You don't have any game stats, yet"));
    return;
  }

  //When there's stats, these are the messages to be shown
  console.log(chalk.blue("Game Statistics:"));
  console.log(chalk.green(`Correct answers: ${gameState.correct}`));
  console.log(chalk.red(`Incorrect answers: ${gameState.incorrect}`));
  console.log(chalk.yellow(`Unanswered questions: ${gameState.unanswered}`));
}

export function resetGame() {
  gameState.correct = 0;
  gameState.incorrect = 0;
  gameState.unanswered = 0;
}
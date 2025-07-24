import chalk from "chalk";
import { select } from "@inquirer/prompts";
import gameState from "./state.js";

export async function showMainMenu() {
    const action = await select({
        message: "Welcome to the Trivia CLI\nYou have 20 seconds to finish the game.\n \nMain Menu",
    choices: [
      { name: "Start Game", value: "start" },
      { name: "See Stats", value: "stats" },
      { name: "Reset Stats", value: "reset" },
      { name: "Quit", value: "quit" },
    ],
    });

    switch (action) {
        case "start":
            await startGame();
            break;
        case "stats":
            showStats();
            await select({ message: "Press Enter to go back", choices: [{ name: "Back", value: "back" }] });
            showMainMenu();
            break;
        case "reset":
            resetGame();
            console.log(chalk.blue("Stats have been reset."));
            showMainMenu();
            break;
        case "quit":
            console.log("Goodbye!");
            process.exit(0);
  }
}

export async function startGame() {
  const questions = [
        {question: "What is the capital of the United States?",
            choices: ["Ottawa", "Washington State", "Washington DC", "Kingston"],
            answer: "Washington DC"
        },

        {question: "What is the capital of Brazil?",
            choices: ["Rio de Janeiro", "Sao Paulo", "Bahia", "Brasilia"],
            answer: "Brasilia"
        },

        {question: "What is the capital of Morocco?",
            choices: ["Casablanca", "Rabat", "Madrid", "Granada"],
            answer: "Rabat"
        },

        {question: "What is the capital of Thailand?",
            choices: ["Bangkok", "Beijing", "Tokyo", "Laos"],
            answer: "Bangkok"
        },

        {question: "What is the capital of Kenya?",
            choices: ["Angola", "Cairo", "TokyCongo", "Nairobi"],
            answer: "Nairobi"
        },
    ];

    const totalQuestions = questions.length;
    let answeredQuestions = 0;
    let unansweredQuestions = 0;

  for(const question of questions) {
        const answer = await select({
            message: question.question,
            choices: [
        { name: question.choices[0], value: question.choices[0] },
        { name: question.choices[1], value: question.choices[1] },
        { name: question.choices[2], value: question.choices[2] },
        { name: question.choices[3], value: question.choices[3] },
        ],
        });
        answeredQuestions++;
        unansweredQuestions = totalQuestions - answeredQuestions
        determineIfCorrect(answer, question, unansweredQuestions);

    }

    showStats()
    showMainMenu();
}

export function determineIfCorrect(answer, question, unansweredQuestions) {
    if(answer === question.answer) {
        gameState.correct++;
        console.log(chalk.green("Correct!"))
    } else {
        gameState.incorrect++;
        console.log(chalk.red("Incorrect!"))
    }

    gameState.unanswered = unansweredQuestions;
}

export function showStats() {
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
#!/usr/bin/env node

import { program } from "commander";
import { currentGameState, totalGameState } from "../src/lib/state.js";
import { showMainMenu } from "../src/lib/gameLogic.js";

showMainMenu(currentGameState, totalGameState);

program.parse(process.argv);
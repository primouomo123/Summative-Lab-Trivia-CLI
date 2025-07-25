#!/usr/bin/env node

import { program } from "commander";
import { showMainMenu } from "../src/lib/gameLogic.js";

showMainMenu();

program.parse(process.argv);
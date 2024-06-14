#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this is a custom cli tool i've created
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const index_1 = require("./index");
const promptForProjectId = () => {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question('Enter the project ID: ', (projectId) => {
            rl.close();
            resolve(projectId);
        });
    });
};
const promptForApiToken = () => {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question('Enter your Vercel API token: ', (apiToken) => {
            rl.close();
            resolve(apiToken);
        });
    });
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = yield promptForProjectId();
        const apiToken = yield promptForApiToken();
        const envVariables = yield (0, index_1.getEnvironmentVariables)(projectId, apiToken);
        const envFilePath = path_1.default.resolve(process.cwd(), '.env');
        (0, index_1.writeEnvFile)(envVariables, envFilePath);
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
});
main();

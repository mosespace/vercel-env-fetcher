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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const readline_1 = __importDefault(require("readline"));
dotenv_1.default.config();
const getEnvironmentVariables = (projectId, apiToken) => __awaiter(void 0, void 0, void 0, function* () {
    const variables = [];
    let url = `https://api.vercel.com/v9/projects/${projectId}/env`;
    while (url) {
        try {
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
            });
            variables.push(...response.data.envs);
            // Handling pagination if it exists
            if (response.data.pagination && response.data.pagination.next) {
                url = `${url}?until=${response.data.pagination.next}`;
            }
            else {
                url = null;
            }
        }
        catch (error) {
            console.error("Error fetching environment variables:", error.response ? error.response.data : error.message);
            process.exit(1);
        }
    }
    return variables;
});
const mergeEnvVariables = (existingContent, newVariables) => {
    const envMap = new Map();
    // Parse existing .env content
    existingContent.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key)
            envMap.set(key, value);
    });
    // Add new variables (override if key already exists)
    newVariables.forEach(({ key, value }) => {
        envMap.set(key, value);
    });
    // Convert map back to .env format
    return Array.from(envMap)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
};
const writeEnvFile = (variables, envFilePath) => {
    let existingContent = "";
    if (fs_1.default.existsSync(envFilePath)) {
        existingContent = fs_1.default.readFileSync(envFilePath, { encoding: "utf8" });
    }
    const mergedContent = mergeEnvVariables(existingContent, variables);
    try {
        fs_1.default.writeFileSync(envFilePath, mergedContent);
        console.log(`I've updated/created the .env file at ${envFilePath} 🎉
      Please, ⚠️⚠️⚠️⚠️ Ensure to add the path to .gitignore if not already done.
      `);
    }
    catch (error) {
        console.error("Error writing .env file:", error);
        process.exit(1);
    }
};
const promptForProjectId = () => {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question("Enter the project ID: ", (projectId) => {
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
        rl.question("Enter your Vercel API token: ", (apiToken) => {
            rl.close();
            resolve(apiToken);
        });
    });
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = yield promptForProjectId();
    const apiToken = yield promptForApiToken();
    const envVariables = yield getEnvironmentVariables(projectId, apiToken);
    const envFilePath = path_1.default.resolve(process.cwd(), ".env");
    writeEnvFile(envVariables, envFilePath);
});
main();

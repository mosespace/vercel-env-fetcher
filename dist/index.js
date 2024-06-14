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
exports.writeEnvFile = exports.mergeEnvVariables = exports.getEnvironmentVariables = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnvironmentVariables = (projectId, apiToken) => __awaiter(void 0, void 0, void 0, function* () {
    const variables = [];
    let url = `https://api.vercel.com/v9/projects/${projectId}/env`;
    while (url) {
        try {
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
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
            console.error('Error fetching environment variables:', error.response ? error.response.data : error.message);
            process.exit(1);
        }
    }
    return variables;
});
exports.getEnvironmentVariables = getEnvironmentVariables;
const mergeEnvVariables = (existingContent, newVariables) => {
    const envMap = new Map();
    // Parse existing .env content
    existingContent.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
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
        .join('\n');
};
exports.mergeEnvVariables = mergeEnvVariables;
const writeEnvFile = (variables, envFilePath) => {
    let existingContent = '';
    if (fs_1.default.existsSync(envFilePath)) {
        existingContent = fs_1.default.readFileSync(envFilePath, { encoding: 'utf8' });
    }
    const mergedContent = (0, exports.mergeEnvVariables)(existingContent, variables);
    try {
        fs_1.default.writeFileSync(envFilePath, mergedContent);
        console.log(`I've updated/created the .env file at ${envFilePath} 🎉
      Please, ⚠️⚠️⚠️⚠️ Ensure to add the path to .gitignore if not already done.
      `);
    }
    catch (error) {
        console.error('Error writing .env file:', error);
        process.exit(1);
    }
};
exports.writeEnvFile = writeEnvFile;

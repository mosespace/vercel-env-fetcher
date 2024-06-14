#!/usr/bin/env node
// this is a custom cli tool i've created
import path from 'path';
import readline from 'readline';
import { getEnvironmentVariables, writeEnvFile } from './index';

const promptForProjectId = (): Promise<string> => {
  const rl = readline.createInterface({
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

const promptForApiToken = (): Promise<string> => {
  const rl = readline.createInterface({
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

const main = async (): Promise<void> => {
  try {
    const projectId = await promptForProjectId();
    const apiToken = await promptForApiToken();
    const envVariables = await getEnvironmentVariables(projectId, apiToken);

    const envFilePath = path.resolve(process.cwd(), '.env');
    writeEnvFile(envVariables, envFilePath);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();

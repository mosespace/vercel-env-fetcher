import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

interface VercelEnvVariable {
  key: string;
  value: string;
}

const getEnvironmentVariables = async (
  projectId: string,
  apiToken: string
): Promise<VercelEnvVariable[]> => {
  const variables: VercelEnvVariable[] = [];
  let url = `https://api.vercel.com/v9/projects/${projectId}/env`;

  while (url) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      variables.push(...response.data.envs);

      // Handling pagination if it exists
      if (response.data.pagination && response.data.pagination.next) {
        url = `${url}?until=${response.data.pagination.next}`;
      } else {
        url = null as any;
      }
    } catch (error: any) {
      console.error(
        "Error fetching environment variables:",
        error.response ? error.response.data : error.message
      );
      process.exit(1);
    }
  }

  return variables;
};

const mergeEnvVariables = (
  existingContent: string,
  newVariables: VercelEnvVariable[]
): string => {
  const envMap = new Map<string, string>();

  // Parse existing .env content
  existingContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key) envMap.set(key, value);
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

const writeEnvFile = (
  variables: VercelEnvVariable[],
  envFilePath: string
): void => {
  let existingContent = "";
  if (fs.existsSync(envFilePath)) {
    existingContent = fs.readFileSync(envFilePath, { encoding: "utf8" });
  }

  const mergedContent = mergeEnvVariables(existingContent, variables);

  try {
    fs.writeFileSync(envFilePath, mergedContent);
    console.log(
      `I've updated/created the .env file at ${envFilePath} 🎉
      Please, ⚠️⚠️⚠️⚠️ Ensure to add the path to .gitignore if not already done.
      `
    );
  } catch (error) {
    console.error("Error writing .env file:", error);
    process.exit(1);
  }
};

const promptForProjectId = (): Promise<string> => {
  const rl = readline.createInterface({
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

const promptForApiToken = (): Promise<string> => {
  const rl = readline.createInterface({
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

const main = async (): Promise<void> => {
  const projectId = await promptForProjectId();
  const apiToken = await promptForApiToken();
  const envVariables = await getEnvironmentVariables(projectId, apiToken);

  const envFilePath = path.resolve(process.cwd(), ".env");
  writeEnvFile(envVariables, envFilePath);
};

main();

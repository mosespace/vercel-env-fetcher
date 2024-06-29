---
Detailed Explanation and Usage Guide for vercel-env-fetcher
---

### Package Name: vercel-env-fetcher

**Description:**
The `vercel-env-fetcher` package is a Node.js CLI utility designed to simplify the management of environment variables within Vercel projects. It leverages the Vercel API to fetch environment variables dynamically based on a specified project ID and writes/updates the `.env` file. This automation saves time by eliminating the manual process of retrieving and configuring environment variables for local development or deployment environments.

### Usage Guide

1. **Installation:**
   You can get the envs' interactively by running:

   If you need to run vercel-env-fetcher globally, ensure it is installed globally:

   ```bash
   npm install -g vercel-env-fetcher
   ```

   ```bash
   npx vercel-env-fetcher
   ```

### 2. Setup:

Before using the package, ensure you have a Vercel account and generate a Vercel Access Token following the steps outlined in the Vercel [documentation](https://vercel.com/docs/rest-api#creating-an-access-token).

- **Project ID:**

To obtain the Project ID:

- Log in to your Vercel account.

- Navigate to the dashboard or the specific project you want to fetch environment variables for.

- The Project ID can be found in the URL when viewing the project details.

- **Vercel Access Token:**

To generate a Vercel Access Token:

- In the Vercel dashboard, click on your profile picture in the upper-right corner.

- Select "Account Settings" from the dropdown menu.

- In the sidebar, navigate to "Tokens".

- Click on "Create Token".

- Provide a name and choose the appropriate scope (usually team-specific or personal).

- Set an expiration date for the token and click "Create Token".

- Copy the generated token value. This token will be used to authenticate API requests when fetching environment variables.

### 3. **Fetching Environment Variables:**

You will be prompted to enter the Project ID for the Vercel project from which you want to fetch environment variables.

### 4. Authentication:

If prompted, provide your Vercel Access Token when prompted by the CLI tool. This token is necessary to authenticate API requests to fetch environment variables.

### 5. Output:

The package will fetch the environment variables associated with the provided Project ID from Vercel. It will then write these variables into a .env file, typically located in a directory named fetched-env within your project's root directory.

### 6. Integration:

Use the generated .env file in your local development environment to ensure consistency with the environment variables used in your Vercel deployments. This automates the process of syncing environment configurations between development and deployment environments.

**Key Features:**

- **Dynamic Fetching:** Retrieves environment variables from Vercel projects via the Vercel API.
- **Automated Integration:** Writes fetched environment variables into `.env` file for seamless integration with local development setups.
- **CLI Interface:** User-friendly command-line interface that prompts for only the project ID and handles API authentication using a Vercel Access Token.

## Note:

Ensure your Vercel Access Token is kept secure and not exposed publicly, as it provides access to your Vercel account's resources.

You can read more about the author here: [@mosespace](https://www.mosespace.com)

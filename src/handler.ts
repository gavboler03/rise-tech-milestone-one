import type { Handler } from "aws-lambda";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runPlaywrightTests() {
  console.log("Starting Playwright test suite...");

  try {
    const { stdout, stderr } = await execFileAsync(
      "/app/node_modules/.bin/playwright",
      ["test", "--reporter=line"],
      {
        cwd: process.env.LAMBDA_TASK_ROOT || process.cwd(),
        env: process.env,
        maxBuffer: 20 * 1024 * 1024,
      },
    );

    if (stdout) {
      console.log("Playwright stdout:");
      console.log(stdout);
    }

    if (stderr) {
      console.error("Playwright stderr:");
      console.error(stderr);
    }

    return {
      success: true,
      message: "Playwright tests completed successfully",
    };
  } catch (error: any) {
    console.error("Playwright test execution failed.");

    console.error("Error:", error);

    if (error.stdout) {
      console.error("Playwright stdout:");
      console.error(error.stdout);
    }

    if (error.stderr) {
      console.error("Playwright stderr:");
      console.error(error.stderr);
    }

    throw error;
  }
}

export const handler: Handler = async () => {
  try {
    const result = await runPlaywrightTests();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Handler failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Playwright tests failed",
      }),
    };
  }
};

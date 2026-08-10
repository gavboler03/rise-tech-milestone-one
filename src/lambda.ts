import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const handler = async () => {
  console.log("Starting Playwright test suite...");

  try {
    const { stdout, stderr } = await execAsync("npx playwright test");

    console.log(stdout);

    if (stderr) {
      console.error(stderr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        output: stdout,
      }),
    };
  } catch (error: any) {
    console.error("Playwright tests failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};

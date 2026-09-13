const { spawn } = require("child_process");
const path = require("path");

const runCppAnalytics = (transactions) => {
  return new Promise((resolve, reject) => {
    const cppExecutable = path.join(
      __dirname,
      "../cpp/analytics.exe"
    );

    const cppProcess = spawn(cppExecutable);

    let output = "";
    let errorOutput = "";

    cppProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    cppProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    cppProcess.on("error", (error) => {
      reject(
        new Error(
          `Failed to start C++ analytics engine: ${error.message}`
        )
      );
    });

    cppProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `C++ process failed with code ${code}: ${errorOutput}`
          )
        );
      }

      resolve(output);
    });

    const input = transactions
      .map((transaction) => {
        return [
          transaction.type,
          transaction.category,
          transaction.amount,
          transaction.date,
        ].join("|");
      })
      .join("\n");

    cppProcess.stdin.write(input);
    cppProcess.stdin.end();
  });
};

module.exports = runCppAnalytics;
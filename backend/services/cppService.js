const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const runCppAnalytics = (transactions) => {
  return new Promise((resolve, reject) => {

    const executableName =
      process.platform === "win32"
        ? "analytics.exe"
        : "analytics";


    const cppExecutable = path.join(
      __dirname,
      "../cpp",
      executableName
    );


    // ==========================================
    // CHECK EXECUTABLE
    // ==========================================

    if (!fs.existsSync(cppExecutable)) {

      return reject(
        new Error(
          `C++ analytics executable not found: ${cppExecutable}`
        )
      );

    }


    // ==========================================
    // START C++ PROCESS
    // ==========================================

    const cppProcess =
      spawn(cppExecutable);


    let output = "";
    let errorOutput = "";


    // ==========================================
    // C++ OUTPUT
    // ==========================================

    cppProcess.stdout.on(
      "data",
      (data) => {
        output += data.toString();
      }
    );


    // ==========================================
    // C++ ERRORS
    // ==========================================

    cppProcess.stderr.on(
      "data",
      (data) => {
        errorOutput += data.toString();
      }
    );


    // ==========================================
    // PROCESS ERROR
    // ==========================================

    cppProcess.on(
      "error",
      (error) => {

        reject(
          new Error(
            `Failed to start C++ analytics engine: ${error.message}`
          )
        );

      }
    );


    // ==========================================
    // PROCESS COMPLETE
    // ==========================================

    cppProcess.on(
      "close",
      (code) => {

        if (code !== 0) {

          return reject(
            new Error(
              `C++ process failed with code ${code}: ${errorOutput}`
            )
          );

        }


        resolve(output);

      }
    );


    // ==========================================
    // PREPARE INPUT
    // ==========================================

    const input =
      (transactions || [])
        .map((transaction) => {

          return [
            transaction.type,
            transaction.category,
            transaction.amount,
            transaction.date,
          ].join("|");

        })
        .join("\n");


    // ==========================================
    // SEND INPUT
    // ==========================================

    if (input) {
      cppProcess.stdin.write(input);
    }

    cppProcess.stdin.end();

  });
};


module.exports =
  runCppAnalytics;
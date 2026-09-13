const { spawn } = require("child_process");
const path = require("path");

const runCppAnalytics = (transactions) => {
  return new Promise((resolve, reject) => {

    const cppExecutable = path.join(
      __dirname,
      "../cpp/analytics.exe"
    );


    // ==========================================
    // START C++ PROCESS
    // ==========================================

    const cppProcess = spawn(
      cppExecutable
    );


    let output = "";

    let errorOutput = "";


    // ==========================================
    // RECEIVE C++ OUTPUT
    // ==========================================

    cppProcess.stdout.on(
      "data",
      (data) => {

        output += data.toString();

      }
    );


    // ==========================================
    // RECEIVE C++ ERRORS
    // ==========================================

    cppProcess.stderr.on(
      "data",
      (data) => {

        errorOutput += data.toString();

      }
    );


    // ==========================================
    // PROCESS START ERROR
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
    // PROCESS FINISHED
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


    // ==========================================
    // SEND INPUT TO C++
    // ==========================================

    cppProcess.stdin.write(
      input
    );

    cppProcess.stdin.end();

  });
};


module.exports = runCppAnalytics;
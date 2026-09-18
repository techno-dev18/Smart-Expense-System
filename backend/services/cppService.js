const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const CPP_TIMEOUT = 10000;


// ==========================================
// RUN C++ ANALYTICS
// ==========================================

const runCppAnalytics = (transactions = []) => {
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


    // ========================================
    // CHECK EXECUTABLE
    // ========================================

    if (!fs.existsSync(cppExecutable)) {
      return reject(
        new Error(
          `C++ analytics executable not found: ${cppExecutable}`
        )
      );
    }


    // ========================================
    // PREPARE INPUT
    // ========================================

    const input = transactions
      .map((transaction) => {

        return [
          String(transaction.type ?? ""),
          String(transaction.category ?? ""),
          String(transaction.amount ?? 0),
          String(transaction.date ?? ""),
        ].join("|");

      })
      .join("\n");


    // ========================================
    // START PROCESS
    // ========================================

    const cppProcess = spawn(
      cppExecutable,
      [],
      {
        stdio: ["pipe", "pipe", "pipe"],
      }
    );


    let output = "";
    let errorOutput = "";
    let settled = false;


    // ========================================
    // CLEANUP
    // ========================================

    const cleanup = () => {
      clearTimeout(timeout);
    };


    const resolveOnce = (value) => {

      if (settled) return;

      settled = true;

      cleanup();

      resolve(value);
    };


    const rejectOnce = (error) => {

      if (settled) return;

      settled = true;

      cleanup();

      reject(error);
    };


    // ========================================
    // TIMEOUT
    // ========================================

    const timeout = setTimeout(() => {

      cppProcess.kill();

      rejectOnce(
        new Error(
          "C++ analytics process timed out"
        )
      );

    }, CPP_TIMEOUT);


    // ========================================
    // STANDARD OUTPUT
    // ========================================

    cppProcess.stdout.on("data", (data) => {
      output += data.toString();
    });


    // ========================================
    // ERROR OUTPUT
    // ========================================

    cppProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });


    // ========================================
    // PROCESS ERROR
    // ========================================

    cppProcess.on("error", (error) => {

      rejectOnce(
        new Error(
          `Failed to start C++ analytics engine: ${error.message}`
        )
      );

    });


    // ========================================
    // PROCESS COMPLETE
    // ========================================

    cppProcess.on("close", (code) => {

      if (code !== 0) {

        return rejectOnce(
          new Error(
            `C++ process failed with code ${code}: ${errorOutput}`
          )
        );

      }


      resolveOnce(output);

    });


    // ========================================
    // SEND INPUT
    // ========================================

    if (input) {
      cppProcess.stdin.write(input);
    }

    cppProcess.stdin.end();

  });
};


module.exports = runCppAnalytics;
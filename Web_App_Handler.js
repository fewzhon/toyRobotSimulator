/**
 * Web_App_Handler.gs
 *
 * This file contains the server-side functions for the Google Apps Script web application.
 * It serves the HTML content and provides endpoints for client-side JavaScript to
 * interact with the Toy Robot Simulator's core logic and testing functions.
 */

/**
 * Serves the main HTML file ('README.html') for the web application.
 * This function is automatically called when the web app's URL is accessed via a GET request.
 *
 * @param {GoogleAppsScript.Events.AppsScriptHttpRequestEvent} e The event object containing details about the HTTP GET request.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output to be rendered in the browser.
 */
function doGet(e) {
  Logger.log("[Web_App_Handler_doGet] Web App accessed (doGet function called).");
  return HtmlService.createTemplateFromFile('README')
    .evaluate()
    .setTitle('Toy Robot Simulator'); // Sets the browser tab title
}

/**
 * A helper function to include content from other HTML files within a main HTML template.
 * This is used with `<?!= include('filename') ?>` in HTML files.
 * While not explicitly used in this single README.html setup, it's a common pattern.
 *
 * @param {string} filename The name of the HTML file to include (without .html extension).
 * @returns {string} The HTML content of the specified file.
 */
function include(filename) {
  Logger.log(`[Web_App_Handler_Include] Attempting to include HTML file: ${filename}`);
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Processes a sequence of robot commands received from the web application's frontend.
 * It passes these commands to the `runCommands` function (defined in roboSimulator.gs)
 * and returns the collected reports for display in the web app UI.
 *
 * @param {string[]} commandsArray An array of command strings (e.g., ["PLACE 0,0,NORTH", "MOVE", "REPORT"]).
 * @returns {string} All collected report outputs and messages from the simulation, joined by newlines.
 */
function runCommandSequenceFromWebApp(commandsArray) {
  Logger.log(`[Web_App_Handler_RunSequence] Called. Received ${commandsArray.length} commands.`);
  Logger.log(`[Web_App_Handler_RunSequence] Commands received: ${JSON.stringify(commandsArray)}`);

  // Call the core simulation logic (defined in roboSimulator.gs)
  const reports = runCommands(commandsArray);

  Logger.log(`[Web_App_Handler_RunSequence] runCommands returned ${reports.length} reports.`);
  Logger.log(`[Web_App_Handler_RunSequence] Reports from runCommands: ${JSON.stringify(reports)}`);

  return reports.join('\n'); // Join reports for display in the HTML textarea
}

/**
 * Runs all unit tests (defined in test.gs) and captures their Logger output
 * to return as a string for display in the web application UI.
 * @returns {string} A string containing the results of all unit tests.
 */
function runAllUnitTestsForWebApp() {
  Logger.log("[Web_App_Handler_RunTests] runAllUnitTestsForWebApp called.");
  // Temporarily override Logger.log to capture messages for web app display
  const originalLoggerLog = Logger.log;
  let capturedLogs = [];
  Logger.log = function(message) {
    capturedLogs.push(message);
    originalLoggerLog(message); // Still log to the actual Apps Script logger
  };

  runAllUnitTests(); // Call the actual unit test function from test.gs

  // Restore the original Logger.log function
  Logger.log = originalLoggerLog;
  Logger.log(`[Web_App_Handler_RunTests] runAllUnitTestsForWebApp: Captured ${capturedLogs.length} logs.`);
  return capturedLogs.join('\n'); // Return all captured logs as a single string
}

/**
 * Runs all integration tests (defined in test.gs) and captures their Logger output
 * to return as a string for display in the web application UI.
 * @returns {string} A string containing the results of all integration tests.
 */
function runIntegrationTestsForWebApp() {
  Logger.log("[Web_App_Handler_RunTests] runIntegrationTestsForWebApp called.");
  // Temporarily override Logger.log to capture messages for web app display
  const originalLoggerLog = Logger.log;
  let capturedLogs = [];
  Logger.log = function(message) {
    capturedLogs.push(message);
    originalLoggerLog(message); // Still log to the actual Apps Script logger
  };

  runIntegrationTests(); // Call the actual integration test function from test.gs

  // Restore the original Logger.log function
  Logger.log = originalLoggerLog;
  Logger.log(`[Web_App_Handler_RunTests] runIntegrationTestsForWebApp: Captured ${capturedLogs.length} logs.`);
  return capturedLogs.join('\n'); // Return all captured logs as a single string
}
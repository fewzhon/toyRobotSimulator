// Web_App_Handler.gs

/**
 * Serves the HTML file for the web application.
 * @param {Object} e - The event object.
 * @return {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('README')
      .evaluate()
      .setTitle('Toy Robot Simulator');
}

/**
 * Helper function to include other HTML files (if needed, not used in this basic setup).
 * @param {string} filename The name of the HTML file to include.
 * @return {string} The content of the included HTML file.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Runs a single robot command received from the web app.
 * @param {string} commandLine The command string (e.g., "PLACE 0,0,NORTH").
 * @return {string} The report output or a status message.
 */
function runSingleCommandFromWebApp(commandLine) {
  // We need a way to maintain the robot's state across calls,
  // since doGet and subsequent calls are stateless in Apps Script by default.
  // A simple way is to store robot state in UserProperties or ScriptProperties.
  // For this quick demo, let's re-instantiate the robot and run the command.
  // This means the robot's state won't persist if you send commands one by one.

  // --- IMPORTANT LIMITATION FOR THIS QUICK WEB APP ---
  // If you send commands like MOVE, LEFT, RIGHT one by one, the robot's
  // state (position, direction) will NOT persist between calls to runSingleCommandFromWebApp.
  // This function will create a *new* robot every time.
  // For persistent state, you'd need to serialize/deserialize robot.x, y, direction.
  // For a quick demo, we'll run a full sequence of commands for the simulation.
  // OR, you could make the `robot` instance a global variable within this .gs file.
  // Let's modify runCommands slightly to facilitate this, or create a new wrapper.

  // To properly handle state in a web app, you might need:
  // 1. Store robot state in Script Properties between calls.
  // 2. Or, run a full sequence of commands in one go.

  // Let's re-design `runCommands` in `roboSimulator.gs` slightly to return all outputs.
  // For now, we'll assume `runCommands` exists and we can call it.
  
  // This is a quick workaround:
  const robot = new Robot(); // Creates a new robot instance for each command received

  // Re-use runCommands but we need to capture output
  // Temporarily override console.log for this scope
  const originalConsoleLog = console.log;
  let capturedReports = [];
  console.log = function(message) {
    capturedReports.push(message);
    originalConsoleLog(message); // Still log to Apps Script logger
  };

  runCommands([commandLine]); // runCommands expects an array

  console.log = originalConsoleLog; // Restore console.log

  if (capturedReports.length > 0) {
    return capturedReports.join('\n');
  } else {
    // If the command produced no direct report (e.g., MOVE, LEFT, RIGHT)
    // You might want to return the *current state* after the command.
    // This would require robot.report() to return its value, which we've already done!
    // So let's return the robot's current report after any command.
    return robot.report(); // This now returns a string
  }
}


/**
 * Runs all unit tests and returns their results as a string.
 * @return {string} Formatted test results.
 */
function runAllUnitTestsForWebApp() {
  const originalLoggerLog = Logger.log;
  let capturedLogs = [];
  Logger.log = function(message) { // Override Logger.log to capture messages
    capturedLogs.push(message);
    originalLoggerLog(message); // Still log to Apps Script logger
  };

  runAllUnitTests(); // Call your existing test function

  Logger.log = originalLoggerLog; // Restore Logger.log
  return capturedLogs.join('\n'); // Return all captured logs as a single string
}

/**
 * Runs all integration tests and returns their results as a string.
 * @return {string} Formatted test results.
 */
function runIntegrationTestsForWebApp() {
  const originalLoggerLog = Logger.log;
  let capturedLogs = [];
  Logger.log = function(message) { // Override Logger.log to capture messages
    capturedLogs.push(message);
    originalLoggerLog(message); // Still log to Apps Script logger
  };

  runIntegrationTests(); // Call your existing integration test function

  Logger.log = originalLoggerLog; // Restore Logger.log
  return capturedLogs.join('\n'); // Return all captured logs as a single string
}
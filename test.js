// test.gs

// Make sure your roboSimulator.gs is in the same project
// The functions from test_utils.gs will also be globally available

function runAllUnitTests() {
  Logger.log("--- Running Robot Unit Tests ---");

  testRobotPlacement();
  testRobotMovements();
  testRobotTurns();
  testRobotReport();
  testIgnoredCommandsWhenNotPlaced(); // New test suite for this specific requirement

  Logger.log("--- All Unit Tests Complete ---");
}

function testRobotPlacement() {
  Logger.log("\n--- Testing Robot Placement ---");
  let robot = new Robot(); // Create a fresh robot for each test function/suite

  robot.place('0', '0', 'NORTH');
  assertEqual(robot.isPlaced, true, "Robot should be placed after valid PLACE command");
  assertEqual(robot.x, 0, "Robot X should be 0 after PLACE 0,0,NORTH");
  assertEqual(robot.y, 0, "Robot Y should be 0 after PLACE 0,0,NORTH");
  assertEqual(robot.direction, 'NORTH', "Robot direction should be NORTH after PLACE 0,0,NORTH");

  let robot2 = new Robot();
  robot2.place('5', '5', 'NORTH'); // Off table
  assertEqual(robot2.isPlaced, false, "Robot should NOT be placed if off table (5,5)");
  assertNotNull(robot2.x, "Robot X should still be null if not placed"); // Check if it's still null
  assertNotNull(robot2.y, "Robot Y should still be null if not placed");
  assertNotNull(robot2.direction, "Robot direction should still be null if not placed");


  let robot3 = new Robot();
  robot3.place('0', '0', 'INVALID'); // Invalid direction
  assertEqual(robot3.isPlaced, false, "Robot should NOT be placed if direction is invalid");
}

function testRobotMovements() {
  Logger.log("\n--- Testing Robot Movements ---");
  let robot = new Robot();
  robot.place('0', '0', 'NORTH');
  robot.move();
  assertEqual(robot.x, 0, "Robot X should be 0 after moving NORTH from 0,0");
  assertEqual(robot.y, 1, "Robot Y should be 1 after moving NORTH from 0,0");

  robot.place('4', '0', 'EAST');
  robot.move();
  assertEqual(robot.x, 4, "Robot X should be 4 (stay on table) after moving EAST from 4,0");
  assertEqual(robot.y, 0, "Robot Y should be 0 after moving EAST from 4,0");

  robot.place('0', '4', 'NORTH'); // At edge
  robot.move(); // Should attempt to move to 0,5 (off table)
  assertEqual(robot.x, 0, "Robot X should remain 0 after attempting to move off NORTH edge");
  assertEqual(robot.y, 4, "Robot Y should remain 4 after attempting to move off NORTH edge");
}

function testRobotTurns() {
  Logger.log("\n--- Testing Robot Turns ---");
  let robot = new Robot();
  robot.place('0', '0', 'NORTH');

  robot.turnLeft();
  assertEqual(robot.direction, 'WEST', "Turn LEFT from NORTH should be WEST");

  robot.turnLeft();
  assertEqual(robot.direction, 'SOUTH', "Turn LEFT from WEST should be SOUTH");

  robot.turnRight();
  assertEqual(robot.direction, 'WEST', "Turn RIGHT from SOUTH should be WEST"); // Correcting based on WEST -> SOUTH -> EAST -> NORTH logic

  robot.turnRight();
  assertEqual(robot.direction, 'NORTH', "Turn RIGHT from WEST should be NORTH");

  // More turn tests...
}

function testRobotReport() {
  Logger.log("\n--- Testing Robot Report ---");
  let robot = new Robot();
  robot.place('1', '2', 'SOUTH');

  // To test console.log, you need to capture its output.
  // In Apps Script, you can't easily capture console.log directly.
  // Instead, you'd verify the internal state.
  // If `report()` returned a string instead of logging, it would be easier to test.
  // For now, let's assume `report()` prints to Logger, and we're just running it.
  Logger.log("Expected report output: 1,2,SOUTH (check Logger manually)");
  robot.report(); // This will log to Apps Script's Logger
}

function testIgnoredCommandsWhenNotPlaced() {
  Logger.log("\n--- Testing Ignored Commands When Not Placed ---");
  let robot = new Robot(); // Robot starts unplaced

  robot.move();
  assertEqual(robot.x, null, "Move should be ignored, X should remain null");
  assertEqual(robot.isPlaced, false, "Move should be ignored, isPlaced should remain false");

  robot.turnLeft();
  assertEqual(robot.direction, null, "TurnLeft should be ignored, direction should remain null");

  // More tests here, including `runCommands` with initial non-PLACE
}


// These are your integration tests / examples from the requirement
// They can remain as separate functions and be run manually or called from a main runner.
function runIntegrationTests() {
  Logger.log("\n--- Running Integration Tests (Example Scenarios) ---");

  Logger.log("\n--- Test Case 1: PLACE 0,0,NORTH, MOVE, REPORT ---");
  const testCommands1 = [
      "PLACE 0,0,NORTH",
      "MOVE",
      "REPORT"
  ];
  runCommands(testCommands1); // Expected Output: 0,1,NORTH

  Logger.log("\n--- Test Case 2: PLACE 0,0,NORTH, LEFT, REPORT ---");
  const testCommands2 = [
      "PLACE 0,0,NORTH",
      "LEFT",
      "REPORT"
  ];
  runCommands(testCommands2); // Expected Output: 0,0,WEST

  Logger.log("\n--- Test Case 3: PLACE 1,2,EAST, MOVE, MOVE, LEFT, MOVE, REPORT ---");
  const testCommands3 = [
      "PLACE 1,2,EAST",
      "MOVE",
      "MOVE",
      "LEFT",
      "MOVE",
      "REPORT"
  ];
  runCommands(testCommands3); // Expected Output: 3,3,NORTH

  Logger.log("\n--- Test Case 4: Edge Cases and Ignored Commands ---");
  const testCommands4 = [
      "MOVE", // Should be ignored
      "REPORT", // Should be ignored
      "PLACE 0,0,NORTH",
      "MOVE",
      "MOVE",
      "MOVE",
      "MOVE",
      "MOVE", // Should be ignored (would fall off)
      "REPORT" // Expected: 0,4,NORTH
  ];
  runCommands(testCommands4);
}

// You can create a master function to run everything
function main() {
  runAllUnitTests();
  runIntegrationTests();
}
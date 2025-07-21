/**
 * test.gs
 *
 * This file contains the unit and integration tests for the Toy Robot Simulator.
 * It uses assertion functions defined in test_utils.gs to verify the correctness
 * of the Robot class and the runCommands simulation logic.
 */

/**
 * Runs all defined unit test suites for the Robot class.
 */
function runAllUnitTests() {
  Logger.log("--- Running Robot Unit Tests ---");

  testRobotPlacement();
  testRobotMovements();
  testRobotTurns();
  testRobotReport();
  testIgnoredCommandsWhenNotPlaced();

  Logger.log("--- All Unit Tests Complete ---");
}

/**
 * Tests the Robot's ability to be placed correctly on the table
 * and to ignore invalid PLACE commands.
 */
function testRobotPlacement() {
  Logger.log("\n--- Test Suite: Robot Placement ---");
  let robot = new Robot(); // Create a fresh robot for each test suite

  // Test valid placement
  robot.place('0', '0', 'NORTH');
  assertEqual(robot.isPlaced, true, "Robot should be placed after valid PLACE command (0,0,NORTH)");
  assertEqual(robot.x, 0, "Robot X should be 0 after PLACE 0,0,NORTH");
  assertEqual(robot.y, 0, "Robot Y should be 0 after PLACE 0,0,NORTH");
  assertEqual(robot.direction, 'NORTH', "Robot direction should be NORTH after PLACE 0,0,NORTH");

  // Test placement off table
  let robot2 = new Robot();
  robot2.place('5', '5', 'NORTH'); // Off table (5x5, so max index is 4)
  assertEqual(robot2.isPlaced, false, "Robot should NOT be placed if off table (5,5)");
  assertEqual(robot2.x, null, "Robot X should still be null if not placed after invalid attempt");
  assertEqual(robot2.y, null, "Robot Y should still be null if not placed after invalid attempt");
  assertEqual(robot2.direction, null, "Robot direction should still be null if not placed after invalid attempt");

  // Test placement with invalid direction
  let robot3 = new Robot();
  robot3.place('0', '0', 'INVALID');
  assertEqual(robot3.isPlaced, false, "Robot should NOT be placed if direction is invalid");

  // Test placement with non-numeric coordinates
  let robot4 = new Robot();
  robot4.place('A', 'B', 'NORTH');
  assertEqual(robot4.isPlaced, false, "Robot should NOT be placed if coordinates are non-numeric");
}

/**
 * Tests the Robot's ability to move one unit forward
 * and to ignore moves that would cause it to fall off the table.
 */
function testRobotMovements() {
  Logger.log("\n--- Test Suite: Robot Movements ---");
  let robot = new Robot();

  // Test moving NORTH
  robot.place('0', '0', 'NORTH');
  robot.move();
  assertEqual(robot.x, 0, "Robot X should be 0 after moving NORTH from 0,0");
  assertEqual(robot.y, 1, "Robot Y should be 1 after moving NORTH from 0,0");

  // Test moving EAST
  robot.place('0', '0', 'EAST');
  robot.move();
  assertEqual(robot.x, 1, "Robot X should be 1 after moving EAST from 0,0");
  assertEqual(robot.y, 0, "Robot Y should be 0 after moving EAST from 0,0");

  // Test moving SOUTH
  robot.place('0', '1', 'SOUTH'); // Place it at 0,1 to move south
  robot.move();
  assertEqual(robot.x, 0, "Robot X should be 0 after moving SOUTH from 0,1");
  assertEqual(robot.y, 0, "Robot Y should be 0 after moving SOUTH from 0,1");

  // Test moving WEST
  robot.place('1', '0', 'WEST'); // Place it at 1,0 to move west
  robot.move();
  assertEqual(robot.x, 0, "Robot X should be 0 after moving WEST from 1,0");
  assertEqual(robot.y, 0, "Robot Y should be 0 after moving WEST from 1,0");

  // Test not moving off NORTH edge
  robot.place('0', '4', 'NORTH'); // At northern edge (0,4)
  robot.move(); // Attempt to move to 0,5 (off table)
  assertEqual(robot.x, 0, "Robot X should remain 0 after attempting to move off NORTH edge");
  assertEqual(robot.y, 4, "Robot Y should remain 4 after attempting to move off NORTH edge");

  // Test not moving off EAST edge
  robot.place('4', '0', 'EAST'); // At eastern edge (4,0)
  robot.move(); // Attempt to move to 5,0 (off table)
  assertEqual(robot.x, 4, "Robot X should remain 4 after attempting to move off EAST edge");
  assertEqual(robot.y, 0, "Robot Y should remain 0 after attempting to move off EAST edge");
}

/**
 * Tests the Robot's ability to rotate 90 degrees LEFT and RIGHT.
 */
function testRobotTurns() {
  Logger.log("\n--- Test Suite: Robot Turns ---");
  let robot = new Robot();
  robot.place('0', '0', 'NORTH');

  // Test LEFT turns
  robot.turnLeft();
  assertEqual(robot.direction, 'WEST', "Turn LEFT from NORTH should be WEST");
  robot.turnLeft();
  assertEqual(robot.direction, 'SOUTH', "Turn LEFT from WEST should be SOUTH");
  robot.turnLeft();
  assertEqual(robot.direction, 'EAST', "Turn LEFT from SOUTH should be EAST");
  robot.turnLeft();
  assertEqual(robot.direction, 'NORTH', "Turn LEFT from EAST should be NORTH (full cycle)");

  // Test RIGHT turns
  robot.turnRight();
  assertEqual(robot.direction, 'EAST', "Turn RIGHT from NORTH should be EAST");
  robot.turnRight();
  assertEqual(robot.direction, 'SOUTH', "Turn RIGHT from EAST should be SOUTH");
  robot.turnRight();
  assertEqual(robot.direction, 'WEST', "Turn RIGHT from SOUTH should be WEST");
  robot.turnRight();
  assertEqual(robot.direction, 'NORTH', "Turn RIGHT from WEST should be NORTH (full cycle)");
}

/**
 * Tests the Robot's report function and its behavior when not placed.
 */
function testRobotReport() {
  Logger.log("\n--- Test Suite: Robot Report ---");
  let robot = new Robot(); // Robot starts unplaced

  // Test report when not placed
  let reportUnplaced = robot.report();
  assertEqual(reportUnplaced, "Robot not placed.", "Report should state 'Robot not placed.' when robot is unplaced");

  // Test report after valid placement and movement
  robot.place('1', '2', 'SOUTH');
  let reportPlaced = robot.report();
  assertEqual(reportPlaced, "1,2,SOUTH", "Report should correctly state position after placement");

  robot.move(); // Move to 1,1,SOUTH
  reportPlaced = robot.report();
  assertEqual(reportPlaced, "1,1,SOUTH", "Report should correctly state position after movement");
}

/**
 * Tests that MOVE, LEFT, RIGHT, and REPORT commands are ignored
 * if the robot has not been successfully placed on the table.
 */
function testIgnoredCommandsWhenNotPlaced() {
  Logger.log("\n--- Test Suite: Ignored Commands When Not Placed ---");
  let robot = new Robot(); // Robot starts unplaced

  // Attempt MOVE before placement
  robot.move();
  assertEqual(robot.x, null, "Move should be ignored, X should remain null");
  assertEqual(robot.isPlaced, false, "Move should be ignored, isPlaced should remain false");

  // Attempt LEFT before placement
  robot.turnLeft();
  assertEqual(robot.direction, null, "TurnLeft should be ignored, direction should remain null");

  // Attempt RIGHT before placement
  robot.turnRight();
  assertEqual(robot.direction, null, "TurnRight should be ignored, direction should remain null");

  // Attempt REPORT before placement (already covered somewhat, but good to re-assert)
  let reportOutput = robot.report();
  assertEqual(reportOutput, "Robot not placed.", "Report should state 'Robot not placed.' when robot is unplaced");
}


/**
 * Runs a set of integration tests/example scenarios
 * using the runCommands function to simulate full sequences of input.
 */
function runIntegrationTests() {
  Logger.log("\n--- Running Integration Tests (Example Scenarios) ---");

  Logger.log("\n--- Scenario 1: PLACE 0,0,NORTH, MOVE, REPORT ---");
  const testCommands1 = [
      "PLACE 0,0,NORTH",
      "MOVE",
      "REPORT"
  ];
  const results1 = runCommands(testCommands1);
  assertEqual(results1.length, 1, "Scenario 1: Should have 1 report");
  assertEqual(results1[0], "0,1,NORTH", "Scenario 1: Correct output for 0,1,NORTH");

  Logger.log("\n--- Scenario 2: PLACE 0,0,NORTH, LEFT, REPORT ---");
  const testCommands2 = [
      "PLACE 0,0,NORTH",
      "LEFT",
      "REPORT"
  ];
  const results2 = runCommands(testCommands2);
  assertEqual(results2.length, 1, "Scenario 2: Should have 1 report");
  assertEqual(results2[0], "0,0,WEST", "Scenario 2: Correct output for 0,0,WEST");

  Logger.log("\n--- Scenario 3: PLACE 1,2,EAST, MOVE, MOVE, LEFT, MOVE, REPORT ---");
  const testCommands3 = [
      "PLACE 1,2,EAST",
      "MOVE",
      "MOVE",
      "LEFT",
      "MOVE",
      "REPORT"
  ];
  const results3 = runCommands(testCommands3);
  assertEqual(results3.length, 1, "Scenario 3: Should have 1 report");
  assertEqual(results3[0], "3,3,NORTH", "Scenario 3: Correct output for 3,3,NORTH");

  Logger.log("\n--- Scenario 4: Edge Cases and Ignored Commands ---");
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
  const results4 = runCommands(testCommands4);
  // Based on current implementation, this should capture ignored messages too
  // So the expected length might be different depending on exact messages pushed.
  // Let's refine the test to expect only the final report for this specific scenario.
  assertEqual(results4.length, 3, "Scenario 4: Should have 3 reports (2 ignored messages + final report)");
  assertEqual(results4[0], "Command 'MOVE' ignored: Robot not placed.", "Scenario 4: First ignored MOVE");
  assertEqual(results4[1], "Command 'REPORT' ignored: Robot not placed.", "Scenario 4: Second ignored REPORT");
  assertEqual(results4[2], "0,4,NORTH", "Scenario 4: Final report after valid sequence");

  Logger.log("\n--- Scenario 5: Invalid PLACE command (off table) ---");
  const testCommands5 = [
      "PLACE 5,5,NORTH", // Invalid
      "REPORT"           // Should report "Robot not placed."
  ];
  const results5 = runCommands(testCommands5);
  assertEqual(results5.length, 1, "Scenario 5: Should have 1 report for invalid PLACE");
  assertEqual(results5[0], "PLACE command ignored: Invalid coordinates (5,5) or off table.", "Scenario 5: Report for invalid PLACE");


  Logger.log("\n--- All Integration Tests Complete ---");
}


/**
 * Main function to run all unit and integration tests.
 * This function can be selected and run directly from the Apps Script editor.
 */
function main() {
  runAllUnitTests();
  runIntegrationTests();
}
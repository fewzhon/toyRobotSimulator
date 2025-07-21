/**
 * roboSimulator.gs
 *
 * This file defines the core logic for the Toy Robot Simulator.
 * It includes the Robot class, which encapsulates the robot's state and behaviors,
 * and the runCommands function, which processes a sequence of commands
 * to simulate the robot's movements on a 5x5 tabletop.
 *
 * Adheres to Object-Oriented Programming (OOP) principles and focuses on clean,
 * maintainable code with appropriate error handling as per challenge requirements.
 */

// Define constants for the table dimensions
const TABLE_WIDTH = 5;
const TABLE_HEIGHT = 5;

// Define an array to help manage directions (useful for turns)
// The order here is crucial for LEFT/RIGHT rotations (clockwise progression).
const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

/**
 * Represents the Toy Robot, managing its position, direction, and behavior.
 * The robot operates on a 5x5 table with (0,0) at the SOUTH WEST corner.
 */
class Robot {
    /**
     * Initializes a new Robot instance.
     * The robot starts off the table, with no defined position or direction.
     */
    constructor() {
        this.x = null;
        this.y = null;
        this.direction = null; // Stored as a string (e.g., 'NORTH')
        this.isPlaced = false; // Tracks if the robot has been successfully placed on the table
        Logger.log(`[Robot_Constructor] Robot initialized. State: x=${this.x}, y=${this.y}, dir=${this.direction}, placed=${this.isPlaced}`);
    }

    /**
     * Helper method to validate if a given (x, y) coordinate is within the table boundaries.
     * @param {number} x The X-coordinate to validate.
     * @param {number} y The Y-coordinate to validate.
     * @returns {boolean} True if the position is valid, false otherwise.
     * @private
     */
    _isValidPosition(x, y) {
        const isValid = x >= 0 && x < TABLE_WIDTH && y >= 0 && y < TABLE_HEIGHT;
        Logger.log(`[Robot_isValidPosition] Checking (${x}, ${y}) => ${isValid}`);
        return isValid;
    }

    /**
     * Places the robot on the table at a specified position and facing a given direction.
     * The command is ignored if the position is off the table, coordinates are invalid,
     * or the direction is unrecognized.
     *
     * @param {string} x The X-coordinate as a string (will be parsed to int).
     * @param {string} y The Y-coordinate as a string (will be parsed to int).
     * @param {string} direction The facing direction ('NORTH', 'SOUTH', 'EAST', 'WEST').
     * @returns {string} An empty string on successful placement, or an error message if ignored.
     */
    place(x, y, direction) {
        Logger.log(`[Robot_Place] Attempting PLACE command. Input: x=${x}, y=${y}, dir=${direction}`);
        const parsedX = parseInt(x, 10);
        const parsedY = parseInt(y, 10);

        // Validate coordinates: must be numbers and within table boundaries
        if (isNaN(parsedX) || isNaN(parsedY) || !this._isValidPosition(parsedX, parsedY)) {
            const errorMessage = `PLACE command ignored: Invalid coordinates (${x},${y}) or off table.`;
            Logger.log(`[Robot_Place] ${errorMessage}`);
            return errorMessage;
        }

        // Validate direction: must be one of the predefined cardinal directions
        if (!DIRECTIONS.includes(direction)) {
            const errorMessage = `PLACE command ignored: Invalid direction '${direction}'.`;
            Logger.log(`[Robot_Place] ${errorMessage}`);
            return errorMessage;
        }

        // If all validations pass, update the robot's state
        this.x = parsedX;
        this.y = parsedY;
        this.direction = direction;
        this.isPlaced = true;
        Logger.log(`[Robot_Place] Robot PLACED successfully. New state: x=${this.x}, y=${this.y}, dir=${this.direction}`);
        return ""; // Return empty string for successful command (no direct report from PLACE)
    }

    /**
     * Moves the robot one unit forward in its current direction.
     * The command is ignored if the robot is not placed, or if the move
     * would cause it to fall off the table.
     * @returns {void}
     */
    move() {
        Logger.log(`[Robot_Move] Attempting MOVE command. Current: x=${this.x}, y=${this.y}, dir=${this.direction}`);
        if (!this.isPlaced) {
            Logger.log("[Robot_Move] MOVE ignored: Robot not placed.");
            return;
        }

        let newX = this.x;
        let newY = this.y;

        switch (this.direction) {
            case 'NORTH': newY++; break;
            case 'EAST': newX++; break;
            case 'SOUTH': newY--; break;
            case 'WEST': newX--; break;
        }

        Logger.log(`[Robot_Move] Calculated potential move to: (${newX}, ${newY})`);
        // Validate if the potential new position is still on the table
        if (!this._isValidPosition(newX, newY)) {
            Logger.log(`[Robot_Move] MOVE ignored: Would fall off table. Robot remains at (${this.x}, ${this.y}).`);
            return;
        }

        // If the move is valid, update the robot's actual position
        this.x = newX;
        this.y = newY;
        Logger.log(`[Robot_Move] Robot MOVED to: x=${this.x}, y=${this.y}`);
    }

    /**
     * Rotates the robot 90 degrees to the left without changing its position.
     * The command is ignored if the robot is not placed.
     * @returns {void}
     */
    turnLeft() {
        Logger.log(`[Robot_TurnLeft] Attempting TURN LEFT. Current: x=${this.x}, y=${this.y}, dir=${this.direction}`);
        if (!this.isPlaced) {
            Logger.log("[Robot_TurnLeft] TURN LEFT ignored: Robot not placed.");
            return;
        }
        // Find current direction's index and calculate new index for left turn (wraps around)
        const currentIndex = DIRECTIONS.indexOf(this.direction);
        const newIndex = (currentIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length;
        this.direction = DIRECTIONS[newIndex];
        Logger.log(`[Robot_TurnLeft] Robot turned LEFT. New direction: ${this.direction}`);
    }

    /**
     * Rotates the robot 90 degrees to the right without changing its position.
     * The command is ignored if the robot is not placed.
     * @returns {void}
     */
    turnRight() {
        Logger.log(`[Robot_TurnRight] Attempting TURN RIGHT. Current: x=${this.x}, y=${this.y}, dir=${this.direction}`);
        if (!this.isPlaced) {
            Logger.log("[Robot_TurnRight] TURN RIGHT ignored: Robot not placed.");
            return;
        }
        // Find current direction's index and calculate new index for right turn (wraps around)
        const currentIndex = DIRECTIONS.indexOf(this.direction);
        const newIndex = (currentIndex + 1) % DIRECTIONS.length;
        this.direction = DIRECTIONS[newIndex];
        Logger.log(`[Robot_TurnRight] Robot turned RIGHT. New direction: ${this.direction}`);
    }

    /**
     * Reports the robot's current position and direction.
     * The command is ignored if the robot is not placed.
     * @returns {string} The report string (e.g., "0,1,NORTH") or "Robot not placed.".
     */
    report() {
        Logger.log(`[Robot_Report] Attempting REPORT. Current: x=${this.x}, y=${this.y}, dir=${this.direction}, placed=${this.isPlaced}`);
        if (!this.isPlaced) {
            const message = "Robot not placed.";
            Logger.log(`[Robot_Report] ${message}`);
            return message;
        }
        const reportString = `${this.x},${this.y},${this.direction}`;
        Logger.log(`[Robot_Report] Returning report: '${reportString}'`);
        return reportString;
    }
}

/**
 * Processes a sequence of commands for the Toy Robot Simulator.
 * This function creates a new Robot instance and executes commands sequentially.
 * It collects all report outputs and specific error/ignored messages for display.
 *
 * @param {string[]} commands An array of command strings (e.g., ["PLACE 0,0,NORTH", "MOVE", "REPORT"]).
 * @returns {string[]} An array of strings containing all collected reports and messages.
 */
function runCommands(commands) {
    Logger.log("\n--- [Simulator] Starting runCommands function ---");
    const robot = new Robot();
    const reports = [];

    Logger.log(`[Simulator] Processing ${commands.length} commands.`);
    for (const commandLine of commands) {
        // --- THIS IS THE CRUCIAL CHANGE AREA ---
        // Find the index of the first space
        const firstSpaceIndex = commandLine.indexOf(' ');
        let command;
        let args = null; // Initialize args to null

        if (firstSpaceIndex !== -1) {
            // If a space is found, split into command and arguments
            command = commandLine.substring(0, firstSpaceIndex).trim();
            args = commandLine.substring(firstSpaceIndex + 1).trim();
        } else {
            // If no space, the whole line is the command (e.g., "MOVE", "REPORT")
            command = commandLine.trim();
        }
        // --- END OF CRUCIAL CHANGE AREA ---

        Logger.log(`[Simulator] Parsed: Command='${command}', Args='${args || 'N/A'}'`); // This log will now show correct args

        // Handle PLACE command (special case)
        if (command === 'PLACE') {
            // ... (The rest of the PLACE command handling with the regex remains the same, as it will now receive the correct args)
            const placeMatch = args ? args.match(/(-?\d+)\s*,\s*(-?\d+)\s*,\s*([a-zA-Z]+)/) : null;

            if (placeMatch && placeMatch.length === 4) {
                const xCoord = placeMatch[1];
                const yCoord = placeMatch[2];
                const direction = placeMatch[3].toUpperCase();

                Logger.log(`[Simulator_PLACE] Regex parsed arguments successfully - X: '${xCoord}', Y: '${yCoord}', Direction: '${direction}'`);

                const placeResult = robot.place(xCoord, yCoord, direction);
                if (placeResult) {
                    reports.push(placeResult);
                }
            } else {
                const errorMessage = `PLACE command ignored: Invalid format or missing/incorrect arguments. Expected 'X,Y,DIRECTION'. Input: '${commandLine}'`;
                Logger.log(`[Simulator_PLACE] ${errorMessage}`);
                reports.push(errorMessage);
            }
        } else {
            // ... (rest of runCommands logic remains the same) ...
            if (!robot.isPlaced) {
                const ignoredMessage = `Command '${commandLine}' ignored: Robot not placed.`;
                Logger.log(`[Simulator] ${ignoredMessage}`);
                reports.push(ignoredMessage);
                continue;
            }
            Logger.log(`[Simulator] Command is '${command}'. Args: '${args || 'none'}'`);
            switch (command) {
                case 'MOVE':
                    robot.move();
                    break;
                case 'LEFT':
                    robot.turnLeft();
                    break;
                case 'RIGHT':
                    robot.turnRight();
                    break;
                case 'REPORT':
                    const reportOutput = robot.report();
                    reports.push(reportOutput);
                    Logger.log(`[Simulator_REPORT] Collected report: '${reportOutput}'`);
                    break;
                default:
                    const unknownCommandMessage = `Warning: Unknown command '${commandLine}' was encountered and ignored.`;
                    Logger.log(`[Simulator] ${unknownCommandMessage}`);
                    reports.push(unknownCommandMessage);
                    break;
            }
        }
    }
    Logger.log(`--- [Simulator] Finished runCommands function ---`);
    Logger.log(`[Simulator] Total reports collected: ${reports.length}. Reports: ${JSON.stringify(reports)}`);
    return reports;
}
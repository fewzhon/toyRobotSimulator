// Define constants for the table dimensions
const TABLE_WIDTH = 5;
const TABLE_HEIGHT = 5;

// Define an array to help manage directions (useful for turns)
const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

class Robot {
    constructor() {
        this.x = null;
        this.y = null;
        this.direction = null;
        this.isPlaced = false;
    }

    // Helper: Check if a position is within table boundaries (0 to 4 for a 5x5 table)
    _isValidPosition(x, y) {
        return x >= 0 && x < TABLE_WIDTH && y >= 0 && y < TABLE_HEIGHT;
    }

    place(x, y, direction) {
        // 1. Convert x and y to integers.
        const parsedX = parseInt(x, 10);
        const parsedY = parseInt(y, 10);

        // 2. Check if parsedX and parsedY are actually numbers AND if the proposed position is on the table.
        if (isNaN(parsedX) || isNaN(parsedY) || !this._isValidPosition(parsedX, parsedY)) {
            return;
        }

        // 3. Validate the direction. It must be one of 'NORTH', 'SOUTH', 'EAST', 'WEST'.
        if (!DIRECTIONS.includes(direction)) {
            return;
        }

        // If all inputs are valid, update the robot's state
        this.x = parsedX;
        this.y = parsedY;
        this.direction = direction;
        this.isPlaced = true;
    }

    move() {
        // 1. Check if the robot is placed. If not, ignore the command.
        if (!this.isPlaced) {
            return;
        }

        let newX = this.x;
        let newY = this.y;

        // 2. Calculate potential newX and newY based on current direction.
        switch (this.direction) {
            case 'NORTH':
                newY++;
                break;
            case 'EAST':
                newX++;
                break;
            case 'SOUTH':
                newY--;
                break;
            case 'WEST':
                newX--;
                break;
        }

        // 3. Validate this potential new position.
        if (!this._isValidPosition(newX, newY)) {
            return;
        }

        // 4. If valid, update the robot's actual position.
        this.x = newX;
        this.y = newY;
    }

    turnLeft() {
        // 1. Check if the robot is placed. If not, ignore.
        if (!this.isPlaced) {
            return;
        }

        // 2. Find the current direction's index in the DIRECTIONS array.
        const currentIndex = DIRECTIONS.indexOf(this.direction);

        // 3. Calculate the new index for a left turn.
        const newIndex = (currentIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length;

        // 4. Update the robot's direction based on the new index.
        this.direction = DIRECTIONS[newIndex];
    }

    turnRight() {
        // 1. Check if the robot is placed. If not, ignore.
        if (!this.isPlaced) {
            return;
        }

        // 2. Find the current direction's index in the DIRECTIONS array.
        const currentIndex = DIRECTIONS.indexOf(this.direction);

        // 3. Calculate the new index for a right turn.
        const newIndex = (currentIndex + 1) % DIRECTIONS.length;

        // 4. Update the robot's direction based on the new index.
        this.direction = DIRECTIONS[newIndex];
    }

    report() {
        if (!this.isPlaced) {
            // As per problem, just ignore if not placed. No need to log "not placed" for final output.
            return;
        }
        console.log(`${this.x},${this.y},${this.direction}`);
    }
}


// This function will take an array of command strings (e.g., ["PLACE 0,0,NORTH", "MOVE", "REPORT"])
function runCommands(commands) {
    const robot = new Robot();

    for (const commandLine of commands) {
        const parts = commandLine.split(' ', 2);
        const command = parts[0];
        const args = parts[1];

        if (command === 'PLACE') {
            // PLACE command always needs to be processed regardless of robot.isPlaced
            const placeArgs = args ? args.split(',') : [];
            robot.place(placeArgs[0], placeArgs[1], placeArgs[2]);
        } else {
            // For all other commands (MOVE, LEFT, RIGHT, REPORT),
            // check if the robot has been placed first.
            // If not placed, these commands should be discarded.
            if (!robot.isPlaced) { // Explicitly discard commands if robot not placed
                // console.log(`Ignoring command '${commandLine}' because robot is not placed.`); // Optional debug log
                continue; // Skip to the next command in the loop
            }

            // If robot IS placed, then process the command
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
                    robot.report();
                    break;
                default:
                    // console.log(`Warning: Unknown command '${commandLine}'`);
                    break;
            }
        }
    }
}
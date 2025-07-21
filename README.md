# Toy Robot Simulator

This project implements a console application that simulates a toy robot moving on a 5x5 square tabletop, as specified by the Iress Junior Engineer Toy Robot Code Challenge. [cite_start]The application processes commands to place, move, turn, and report the robot's position, adhering to specific rules regarding table boundaries and command validity[cite: 8, 9, 10, 11].

## Table of Contents
1.  [Project Overview](#project-overview)
2.  [Technologies Used](#technologies-used)
3.  [Project Structure](#project-structure)
4.  [Setup and How to Run](#setup-and-how-to-run)
5.  [Running Tests](#running-tests)
6.  [Design Decisions](#design-decisions)
7.  [Submission Notes](#submission-notes)

## 1. Project Overview

The core purpose of this application is to simulate a robot's movement and state on a defined tabletop. [cite_start]It robustly handles various commands, ensuring the robot remains on the table and responds appropriately to invalid or premature commands[cite: 9, 10, 14, 15]. [cite_start]The application outputs the robot's position and direction upon a `REPORT` command[cite: 18, 19].

## 2. Technologies Used

* [cite_start]**Language:** JavaScript (implemented within Google Apps Script) [cite: 7]
* **Environment:** Google Apps Script

My choice to use Google Apps Script leverages my existing experience in building internal tooling and allows for efficient development and testing within a familiar JavaScript environment.

## 3. Project Structure

The project is structured into three `.gs` files within a single Google Apps Script project:

* `roboSimulator.gs`: Contains the main application logic, including the `Robot` class and the `runCommands` function. This is the core simulation engine.
* `test_utils.gs`: Provides basic custom assertion functions (e.g., `assertEqual`, `assertNotNull`) necessary for running unit-like tests within the Google Apps Script environment.
* [cite_start]`test.gs`: Contains the unit tests for individual `Robot` class methods and integration tests (example scenarios) to demonstrate the `runCommands` function's behavior[cite: 8, 22].

## 4. Setup and How to Run

To set up and run this application in your Google Apps Script environment:

1.  **Clone the GitHub Repository:**
    ```bash
    git clone [https://github.com/fewzhon/toyRobotSimulator.git](https://github.com/fewzhon/toyRobotSimulator.git)
    cd toyRobotSimulator
    ```
2.  **Create a new Google Apps Script project:** Go to `script.google.com/home/start` and click "New project".
3.  **Transfer the files:**
    * For each `.gs` file in the cloned repository (`roboSimulator.gs`, `test_utils.gs`, `test.gs`, `Web_App_Handler.gs`), create a corresponding new Script file in your Apps Script project (e.g., `File > New > Script file`), name it exactly the same (e.g., `roboSimulator.gs`), and paste the code from your local file into it.
    * For the `README.html` file, create a new HTML file in your Apps Script project (`File > New > HTML file`), name it `README`, and paste the code from your local `README.html` file into it.
4.  **Deploy as Web App:**
    * In the Apps Script editor, go to `Deploy > New deployment`.
    * For "Select type", choose "Web app".
    * Configure "Execute as: Me" and "Who has access: Anyone".
    * Click "Deploy".
    * **Copy the provided "Web app URL"**. This is the link to your interactive simulator and documentation.
5.  **Access the Web App:** Paste the copied "Web app URL" into your browser to interact with the Toy Robot Simulator and view the documentation.
6.  **Run the main simulation (via UI):** On the deployed web app, enter commands in the input field (e.g., `PLACE 0,0,NORTH`, then `MOVE`, then `REPORT`) and click "Run Command". The output will appear in the "Robot Output" area.

## 5. Running Tests

[cite_start]Appropriate unit and integration tests are included to demonstrate the correctness and robustness of the solution.

1.  **Open `test.gs`** in the Google Apps Script editor.
2.  **To run all unit tests:** Select the `runAllUnitTests` function from the dropdown and click "Run".
3.  **To run all integration tests/example scenarios:** Select the `runIntegrationTests` function from the dropdown and click "Run".
4.  **To run all tests (unit and integration):** Select the `main` function from the dropdown and click "Run".
5.  **View Results:** All test outputs (PASS/FAIL messages for unit tests, and robot reports for integration tests) will be displayed in the Google Apps Script Logger (found under `View > Logs` or `Executions` after running).

## 6. Design Decisions

* **Object-Oriented Approach:** The core simulation logic is encapsulated within a `Robot` class. This class manages the robot's state (position, direction, placement status) and its behaviors (`place`, `move`, `turnLeft`, `turnRight`, `report`). [cite_start]This approach promotes modularity, maintainability, and reusability[cite: 6].
* **Separation of Concerns:** The `Robot` class is solely responsible for the robot's internal logic. A separate `runCommands` function is responsible for parsing input commands and orchestrating calls to the `Robot` instance. This keeps the concerns distinct.
* **Input Validation & Edge Case Handling:**
    * [cite_start]Commands are ignored until a valid `PLACE` command successfully puts the robot on the table[cite: 14, 15].
    * [cite_start]All movements (`PLACE`, `MOVE`) are validated against the 5x5 table boundaries *before* execution to prevent the robot from falling off[cite: 9, 10, 24, 25, 26]. Invalid moves are ignored.
    * Invalid command formats or arguments (e.g., non-numeric coordinates, unrecognized directions) are handled gracefully and ignored.
* [cite_start]**Maintainability & Correctness:** Emphasis was placed on clear variable names, concise method logic, and comprehensive testing to ensure the solution is easy to understand, debug, and extend, prioritizing correctness over raw performance for this simulation challenge[cite: 6].

## 7. Submission Notes

This project is provided as Google Apps Script `.gs` files.

* **Link to Hosted VCS Repository:** [**PASTE YOUR GITHUB/GITLAB/BITBUCKET LINK HERE WHEN YOU CREATE IT**]
* Alternatively, the source files can be provided in a `.zip` archive.

---
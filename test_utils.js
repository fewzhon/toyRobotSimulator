// test_utils.gs

// We'll make these return strings, and the web app handler will collect them.
// Your original console.log in these functions will still go to Apps Script Logger.

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    Logger.log(`PASS: ${message}`);
    return `PASS: ${message}`;
  } else {
    Logger.log(`FAIL: ${message} - Expected: ${expected}, Got: ${actual}`);
    return `FAIL: ${message} - Expected: ${expected}, Got: ${actual}`;
  }
}

function assertStrictEqual(actual, expected, message) {
  if (actual === expected) {
    Logger.log(`PASS: ${message}`);
    return `PASS: ${message}`;
  } else {
    Logger.log(`FAIL: ${message} - Expected (strict): ${expected}, Got: ${actual}`);
    return `FAIL: ${message} - Expected (strict): ${expected}, Got: ${actual}`;
  }
}

function assertNotNull(value, message) {
  if (value !== null) {
    Logger.log(`PASS: ${message}`);
    return `PASS: ${message}`;
  } else {
    Logger.log(`FAIL: ${message} - Expected not null, Got: ${value}`);
    return `FAIL: ${message} - Expected not null, Got: ${value}`;
  }
}
// You might need to make `Logger.log` a global mutable variable, or capture it dynamically in the test runners.
// For now, these modifications focus on the assert functions themselves returning the results.
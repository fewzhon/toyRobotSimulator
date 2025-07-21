// test_utils.gs

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

/**
 * Feature detection for localStorage.
 * Handles bizarre browser behaviour like safari pretending to support LS in private/incognito mode.
 */

const detectLocalStorage = () => {
  const testVal = 'test583745'
  try {
    localStorage.setItem(testVal, testVal)
    const checkVal = localStorage.getItem(testVal)
    localStorage.removeItem(testVal)
    return testVal === checkVal
  } catch (e) {
    return false
  }
}

module.exports = detectLocalStorage

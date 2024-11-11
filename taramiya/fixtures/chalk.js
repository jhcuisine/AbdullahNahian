'use strict';

import ansiStyles from 'ansi-styles';
import supportsColor from 'supports-color';

// Detect color support level
const { stdout: stdoutColor } = supportsColor;
const colorLevel = stdoutColor ? stdoutColor.level : 0;

const styles = Object.create(null);

// Helper function to apply options
const applyOptions = (object, options = {}) => {
  if (
    options.level &&
    !(
      Number.isInteger(options.level) &&
      options.level >= 0 &&
      options.level <= 3
    )
  ) {
    throw new Error('The `level` option should be an integer from 0 to 3');
  }

  object.level = options.level === undefined ? colorLevel : options.level;
};

// Function to style text
const createStyle = (style) => {
  return (text) => {
    if (styles[style]) {
      return `${styles[style]}${text}${ansiStyles.reset.open}`; // Reset color after text
    }
    return text; // Return plain text if style not found
  };
};

// Add color styles to the styles object
styles.red = ansiStyles.red.open;
styles.green = ansiStyles.green.open;
styles.blue = ansiStyles.blue.open;
styles.yellow = ansiStyles.yellow.open;
styles.bold = ansiStyles.bold.open;

// Chalk function
const chalk = (...args) => {
  const message = args.join(' ');
  return createStyle('green')(message); // Default to green
};

// Attach options method to chalk
chalk.applyOptions = applyOptions;

// Export the chalk function
export default chalk;

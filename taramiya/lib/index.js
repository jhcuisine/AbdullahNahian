import path from 'path';
import chalk from 'chalk';
import plur from 'plur';
import stringWidth from 'string-width';
import gradient from 'gradient-string'; // For creating beautiful gradient texts
import { locate } from './locator.js'; // Assuming you'll use locate in your logic
import through from 'through2'; // Handling file streams
import less from 'less'; // LESS to CSS compiler
import PluginError from 'plugin-error'; // For handling errors in Gulp
import replaceExt from 'replace-ext'; // For changing file extensions
import sourcemapsApply from 'vinyl-sourcemaps-apply'; // For applying sourcemaps

const gulpLessNext = (options = {}) => {
  return through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file); // Skip if file has no contents
    }

    if (file.isStream()) {
      return callback(
        new PluginError('gulp-less-next', 'Streaming not supported')
      );
    }

    // Use the locate function (if needed)
    const resolvedPath = locate ? locate(file.path) : file.path;

    const lessOptions = {
      filename: path.basename(resolvedPath), // Using locate if needed for file path
      ...options,
    };

    less
      .render(file.contents.toString(), lessOptions)
      .then((result) => {
        file.contents = Buffer.from(result.css); // Write the compiled CSS
        if (result.map) {
          sourcemapsApply(file, result.map); // Apply sourcemaps if present
        }
        file.path = replaceExt(file.path, '.css'); // Change .less to .css
        console.log(gradient.pastel.multiline(`Compiled: ${file.relative}`)); // Log success with gradient
        callback(null, file); // Pass the file to the next step
      })
      .catch((err) => {
        handleError(err, file); // Handle LESS compilation errors
        callback(new PluginError('gulp-less-next', err.message)); // Report error
      });
  });
};

// Error handling function with gradient effect
const handleError = (err, file) => {
  let totalErrorCount = 1; // Assuming each error is counted
  let totalWarningCount = 0; // Adjust if you're counting warnings
  const lines = [];

  const relativePath = path.relative('.', file.path); // Get relative path of the file
  const basename = path.basename(relativePath); // File name
  const dirname = path.dirname(relativePath) + path.sep; // Directory name

  const errorSummary = chalk.red.bold(
    `${totalErrorCount} ${plur('error', totalErrorCount)}`
  );
  const warningSummary =
    totalWarningCount > 0
      ? chalk.yellow.bold(
          `${totalWarningCount} ${plur('warning', totalWarningCount)}`
        )
      : '';

  let header = `\n ${chalk.dim(dirname)}${chalk.dim.bold(basename)} 🔥${
    totalErrorCount > 0 ? ' ' : ''
  }${[errorSummary, warningSummary].join(' ')}🔥\n`;

  // Apply gradient to the header for a visually appealing display
  const divider = chalk.dim('─'.repeat(stringWidth(header)));
  header = gradient.vice.multiline(divider + header + divider); // Gradient header

  lines.push(header);

  // Gradient for the error message
  const errorMessage = gradient.cristal(`Error in ${basename}: ${err.message}`);
  lines.push(errorMessage);

  console.error(lines.join('\n')); // Print the error message to the console
};

export default gulpLessNext;

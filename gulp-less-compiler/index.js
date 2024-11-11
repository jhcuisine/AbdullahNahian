import through from 'through2';
import less from 'less';
import path from 'path';
import PluginError from 'plugin-error';
import objectAssign from 'object-assign';
import replaceExt from 'replace-ext';
import sourcemapsApply from 'vinyl-sourcemaps-apply';
import chalk from 'chalk';

const PLUGIN_NAME = 'gulp-less-next';

const gulpLessNext = (options = {}) => {
  return through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    const lessOptions = objectAssign(
      { filename: path.basename(file.path) },
      options
    );

    less
      .render(file.contents.toString(), lessOptions)
      .then((result) => {
        file.contents = Buffer.from(result.css);

        if (result.map) {
          sourcemapsApply(file, result.map);
        }

        file.path = replaceExt(file.path, '.css');
        console.log(chalk.green(`Compiled: ${file.relative}`));
        callback(null, file);
      })
      .catch((err) => {
        console.error(chalk.red(`Error in ${file.relative}: ${err.message}`));
        callback(new PluginError(PLUGIN_NAME, err.message));
      });
  });
};

// Provide a default export
export default gulpLessNext;

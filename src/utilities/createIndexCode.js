import _ from "lodash";

const safeVariableName = fileName => {
  const indexOfDot = fileName.indexOf(".");

  if (indexOfDot === -1) {
    return fileName;
  } else {
    return fileName.slice(0, indexOfDot);
  }
};

const buildExportBlock = (files, options) => {
  let importBlock;

  importBlock = _.map(files, fileName => {
    return (
      "export { default as " +
      safeVariableName(fileName) +
      " } from './" +
      fileName.replace('.'+options.extensions[0], '') +
      "';"
    );
  });

  importBlock = importBlock.join("\n");

  return importBlock;
};

export default (filePaths, options = {}) => {
  let code;
  let configCode;

  code = "";
  configCode = "";

  if (options.banner) {
    const banners = _.isArray(options.banner)
      ? options.banner
      : [options.banner];

    banners.forEach(banner => {
      code += banner + "\n";
    });

    code += "\n";
  }
  console.log("options>", options);

  if (options.config && _.size(options.config) > 0) {
    configCode += " " + JSON.stringify(options.config);
  }

  code +=
    "// @create-index" +
    configCode.replace(`.${options.extensions[0]}`, "") +
    "\n\n";

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += buildExportBlock(sortedFilePaths, options) + "\n\n";
  }

  return code;
};

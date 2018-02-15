const tmp = require('tmp');
const commonPathPrefix = require('common-path-prefix');
const path = require('path');
const fs = require('fs');

function stringifyWithFunctions(object) {
  return JSON.stringify(object, (key, val) => {
    if (typeof val === 'function') {
      return val.toString().replace(/\n/g, ' ');
    }
    return val;
  });
}

function getTempFolderName() {
  return tmp.tmpNameSync();
}

function readFileContent(filePath, base64 = false) {
  const fileBuffer = Buffer.from(fs.readFileSync(filePath));

  if (base64) {
    return fileBuffer.toString('base64');
  }

  return fileBuffer.toString();
}

function getTempFileName() {
  return tmp.tmpNameSync();
}

function isDirectory(fileOrDirectoryPath) {
  return fileOrDirectoryPath.endsWith('\\') || fileOrDirectoryPath.endsWith('/');
}

function getCommonAncestorDirectory(listFileOrDirectoryPath) {
  // commonPathPrefix doesnt work if any of the path is a directory path
  // so if there is any directory path,kae it a random filepath within that directory
  const listFilePath = listFileOrDirectoryPath.map((eachFilePath) => {
    if (isDirectory(eachFilePath)) {
      return path.join(eachFilePath, 'randomFile.txt');
    }
    return path.normalize(eachFilePath);
  });

  return commonPathPrefix(listFilePath);
}

function getRelativePathFrom(absoluteFilePath, baseDirectoryPath) {
  return path.relative(baseDirectoryPath, absoluteFilePath);
}

function isWithinPath(checkeePath, parentDirectoryPath) {
  const commonDirectoryPath = getCommonAncestorDirectory([
    checkeePath, parentDirectoryPath,
  ]);
  return (path.normalize(commonDirectoryPath) === path.normalize(parentDirectoryPath));
}

function isLocalResource(testResourceFilePath) {
  const remoteResourcePattern = new RegExp('^http(s)?:\\/\\/');
  return !remoteResourcePattern.test(testResourceFilePath.trim());
}

function diffArrays(fullArray, excludeArray) {
  return fullArray.filter(arrElement => excludeArray.indexOf(arrElement) < 0);
}

module.exports = {
  stringifyWithFunctions,
  getTempFolderName,
  getTempFileName,
  getCommonAncestorDirectory,
  getRelativePathFrom,
  isWithinPath,
  isLocalResource,
  readFileContent,
  diffArrays,
};
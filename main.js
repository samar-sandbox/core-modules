const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const zlib = require("node:zlib");
const EventEmitter = require("node:events");

const emitter = new EventEmitter();
const gzip = zlib.createGzip();

/**
 * Problem 1
 * Write a function that logs the current file path and directory
 */
function logCurrentFilePathAndDir() {
  console.log({ file: __filename, dir: __dirname });
}
logCurrentFilePathAndDir();

/**
 * Problem 2
 * Write a function that takes a file path and returns its file name
 */
function getFileName(filePath) {
  if (typeof filePath !== "string") {
    return "getFileName: Invalid file path";
  }
  return path.basename(filePath);
}
console.log(getFileName("/user/files/report.pdf"));

/**
 * Problem 3
 * Write a function that builds a path from an object
 */
function getPath(pathObj) {
  if (!pathObj || typeof pathObj !== "object") {
    return "getPath: Invalid path object";
  }

  const formattedPath = path.format(pathObj);

  return path.normalize(formattedPath);
}
console.log(getPath({ dir: "/folder", name: "app", ext: ".js" }));

/**
 * Problem 4
 * Write a function that returns the file extension from a given file path
 */
function getFileExtension(filePath) {
  if (typeof filePath !== "string") {
    return "getFileExtension: Invalid file path";
  }
  return path.extname(filePath);
}
console.log(getFileExtension("/docs/readme.md"));

/**
 * Problem 5
 * Write a function that parses a given path and returns its name and ext
 */
function getFileDetails(filePath) {
  if (typeof filePath !== "string") {
    return "getFileDetails: Invalid file path";
  }
  const { name, ext } = path.parse(filePath);

  return { name, ext };
}
console.log(getFileDetails("/home/app/main.js"));

/**
 * Problem 6
 * Write a function that checks whether a given path is absolute
 */
function isAbsolutePath(filePath) {
  if (typeof filePath !== "string") {
    return "isAbsolutePath: Invalid file path";
  }
  return path.isAbsolute(filePath);
}
console.log(isAbsolutePath("/home/user/file.txt"));

/**
 * Problem 7
 * Write a function that joins multiple segments
 */
function joinPathSegments(...segments) {
  if (segments.some((seg) => typeof seg !== "string")) {
    return "joinPathSegments: Invalid segments, segments must be strings";
  }

  return path.join(...segments);
}
console.log(joinPathSegments("src", "components", "App.js"));

/**
 * Problem 8
 * Write a function that resolves a relative path to an absolute one
 */
function getAbsolutePath(filePath) {
  if (typeof filePath !== "string") {
    return "getAbsolutePath: Invalid file path";
  }
  return path.resolve(filePath);
}
console.log(getAbsolutePath("./index.js"));

/**
 * Problem 9
 * Write a function that joins two paths
 */
function joinTwoPaths(path1, path2) {
  if (typeof path1 !== "string" || typeof path2 !== "string") {
    return "joinTwoPaths: Invalid file path";
  }

  return path.join(path1, path2);
}
console.log(joinTwoPaths("/folder1", "folder2/file.txt"));

/**
 * Problem 10
 * Write a function that deletes a file asynchronously
 */
function deleteFileAsync(filePath) {
  if (!filePath) {
    console.error("deleteFileAsync: Invalid file path");
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log(`deleteFileAsync: File ${filePath} doesn't exist`);
    return;
  }

  const stats = fs.lstatSync(filePath);
  if (!stats.isFile()) {
    console.error(`deleteFileAsync: "${filePath}" isn't a file`);
    return;
  }

  fs.unlink(filePath, (error) => {
    if (error) {
      console.error(`Error deleting file ${filePath}: ${error.message}`);
    } else {
      console.log(`Success: file ${filePath} deleted successfully`);
    }
  });
}
deleteFileAsync("/path/to/file.txt");

/**
 * Problem 11
 * Write a function that creates a folder synchronously
 */
function createFolderSync(dirPath) {
  if (!dirPath) {
    console.error("createFolderSync: Invalid folder path");
    return;
  }

  if (fs.existsSync(dirPath)) {
    console.log(`createFolderSync: Folder ${dirPath} already exists`);
    return;
  }

  try {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Success: folder ${dirPath} created`);
  } catch (error) {
    console.error(`Error creating folder: ${error.message}`);
  }
}
createFolderSync("folder/sub-folder");

/**
 * Problem 12
 * Create an event emitter that listens for a "start" event and logs a welcome message
 */
emitter.on("start", () => {
  console.log("Welcome event triggered!");
});
emitter.emit("start");

/**
 * Problem 13
 * Emit a custom "login" event with a username parameter
 */
emitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});
emitter.emit("login", "Ahmed");

/**
 * Problem 14
 * Read a file synchronously and log its contents
 */
function readFileSync(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`The file content => "${content}"`);
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
  }
}
readFileSync("./notes.txt");

/**
 * Problem 15
 * Write asynchronously to a file
 */
function writeFileAsync(filePath, content) {
  if (!filePath) {
    console.error("writeFileAsync: Invalid file path");
    return;
  }

  fs.writeFile(filePath, content, (error) => {
    if (error) {
      console.error(
        `Error adding content to file ${filePath}: ${error.message}`,
      );
    } else {
      console.log("Content added to the async.txt file");
    }
  });
}
writeFileAsync("./async.txt", "Async save");

/**
 * Problem 16
 * Check if a directory exists
 */
function exists(filePath) {
  return fs.existsSync(filePath);
}
console.log(exists("./notes.txt"));

/**
 * Problem 17
 * Write a function that returns the OS platform and CPU architecture
 */
function getOSInfo() {
  return { platform: os.platform(), arc: os.arch() };
}
console.log(getOSInfo());

/**
 * Problem 18
 * Use a readable stream to read a file in chunks and log each chunk
 */
function readFileChunks(filePath) {
  if (!filePath) {
    console.error("readFileChunks: Invalid file path");
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log(`readFileChunks: File ${filePath} doesn't exist`);
    return;
  }

  const fileName = path.basename(filePath);

  const stream = fs.createReadStream(filePath, { highWaterMark: 100 });

  stream.on("data", (chunk) => {
    console.log(`>>>> file ${fileName} chunk: ${chunk}`);
  });

  stream.on("end", () => {
    console.log(`Finished reading ${fileName}`);
  });

  stream.on("error", (error) => {
    console.error(`Error reading ${fileName}: ${error.message}`);
  });
}
readFileChunks("big.txt");

/**
 * Problem 19
 * Use readable and writable streams to copy content from one file to another
 */
function copyFileContent(filePath, targetPath, isCompressed = false) {
  if (!filePath || !targetPath) {
    console.error("copyFileContent: Invalid file path");
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log(`copyFileContent: File ${filePath} doesn't exist`);
    return;
  }

  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream(targetPath);

  writeStream.on("finish", () => {
    console.log(
      `File ${filePath} copied using streams, isCompressed: ${isCompressed}`,
    );
  });

  writeStream.on("error", (error) => {
    console.error(`Error copying ${filePath}: ${error.message}`);
  });

  readStream.on("error", (error) => {
    console.error(`Error copying ${filePath}: ${error.message}`);
  });

  if (isCompressed) {
    readStream.pipe(gzip).pipe(writeStream);
  } else {
    readStream.pipe(writeStream);
  }
}
copyFileContent("./big.txt", "./copy.txt");

/**
 * Problem 20
 * Create a pipeline that reads a file, compresses it, and writes it to another file
 */

copyFileContent("./big.txt", "./copy.txt.gz", true);

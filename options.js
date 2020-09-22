const parse = require("yargs-parser");

function parseArgv(argv) {
  const options = parse(process.argv.slice(2), {
    string: ["assetsDir", "url", "outDir", "title", "name"],
  });

  if (!options.outDir) {
    options.outDir = "./bin";
  }
  if (!options.assetsDir && !options.url) {
    throw new Error("You must specify either --url or --assetsDir.");
  }

  return options;
}

module.exports = {
  parseArgv,
};

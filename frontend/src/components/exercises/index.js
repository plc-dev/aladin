/**
 * Loads all vue modules in sub directories and exposes the bundled components
 */
const req = require.context("./", true, /.vue$/);
const modules = req.keys().map(req);
const components = {};
req.keys().map((name, index) => {
  console.log(name,index, modules[index])
  Object.assign(components, {
    [name.match(/.*\/(.*)\./)[1]]: modules[index]["default"]
  });
});

export default components;

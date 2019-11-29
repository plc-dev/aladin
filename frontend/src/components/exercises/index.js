const req = require.context("./", true, /.vue$/);
const modules = req.keys().map(req);
const components = {};
req.keys().map((name, index) => {
  Object.assign(components, {
    [name.match(/.*\/(.*)\./)[1]]: modules[index]["default"]
  });
});
export default components;

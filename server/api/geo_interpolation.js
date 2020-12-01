const { asyncErrorWrapper, jwtValidationMiddleware } = require("../helper");
const { ValidationError } = require("../errorHandling/customErrors");
const { solver } = require("../exercises/solver");
const { generateTree } = require("../exercises/geoInterpolation");

module.exports = router => {
  router.post(
    "/getGeoGraph",
    asyncErrorWrapper(async (req, res) => {
      const { parameters } = req.body;
      const tree = generateTree(...parameters);
      const solution = solver(tree)
      res.status(201).json({ tree, solution });
    })
)};
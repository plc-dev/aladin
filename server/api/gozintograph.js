const { asyncErrorWrapper, jwtValidationMiddleware } = require("../helper");

module.exports = (router, User) => {
  /**
   * @swagger
   * /subscribe:
   *  post:
   *    summary: Validates the login data and sends user settings and ID to client
   *    parameters:
   *      - in: body
   *        name: user
   *        schema:
   *          type: object
   *          required:
   *            - email
   *              password
   *          properties:
   *            email:
   *              type: string
   *            password:
   *              type: string
   *    responses:
   *      '200':
   *        description: Login data valid
   *      '409':
   *        description: Validation error
   */
  router.post(
    "/saveGozintograph",
    asyncErrorWrapper(async (req, res) => {
      const { uuid, solvedExercise } = req.body;
      const user = await User.findOne({ _id: uuid });
      if (user !== null) {
        user.solvedExercises.push(solvedExercise);
        user.save.(done);
        res.status(201).json({});
      } else {
        throw Error();
      }
    })
  );
  return router;
};

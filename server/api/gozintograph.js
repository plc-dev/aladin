const { asyncErrorWrapper, jwtValidationMiddleware } = require("../helper");

module.exports = (router, User, webpush) => {
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
    "/subscribe",
    asyncErrorWrapper(async (req, res) => {
      const { uuid, subscription } = req.body;
      res.status(201).json({});
      const user = await User.findOneAndUpdate({ _id: uuid }, { subscription }, { upsert: true });
      if (user !== null) {
        const payload = JSON.stringify({ title: "Subscription", message: "Subscription successfully setup" });
        webpush.sendNotification(subscription, payload);
      }
    })
  );
  return router;
};

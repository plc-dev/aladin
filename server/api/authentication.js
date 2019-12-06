const { asyncErrorWrapper, jwtValidationMiddleware } = require("../helper");
const { ValidationError } = require("../errorHandling/customErrors");

const bcrypt = require("bcryptjs");

const BCRYPT_SALT_ROUNDS = 12;

module.exports = (router, jwt, User) => {
  /**
   * @swagger
   * /register:
   *  post:
   *    summary: Registers a new user and persists to MongoDB
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
   *      '201':
   *        description: User created successfully
   *      '409':
   *        description: Validation error
   */
  router.post(
    "/register",
    asyncErrorWrapper(async (req, res) => {
      const { email, password } = req.body;
      console.warn(req.body);
      let user = await User.findOne({ email });
      if (user != null || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        throw new ValidationError("ValidationError");
      } else {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        user = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "User has been created", uuid: user._id });
      }
    })
  );

  /**
   * @swagger
   * /login:
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
    "/login",
    asyncErrorWrapper(async (req, res) => {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (user === null) {
        throw new ValidationError("");
      } else if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email }, process.env.jwtSecret, { expiresIn: "24h" });
        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          // vapidPublicKey: ,
          uuid: user._id
          // TODO: user settings
        });
      } else {
        throw new ValidationError("");
      }
    })
  );

  /**
   * @swagger
   * /authenticate:
   *  post:
   *    summary: Validates the clients JWT and sends a confirmation to the client
   *    security:
   *      - Bearer: []
   *    parameters:
   *      - in: body
   *        name: UUID
   *        schema:
   *          type: string
   *          required:
   *            - UUID
   *    responses:
   *      '200':
   *        description: JWT is valid
   *      '409':
   *        description: Validation error
   */
  router.post("/authenticate", (req, res, next) => {
    jwtValidationMiddleware(req, res, next, jwt);
    res.status(200).json({
      success: true,
      message: "Authentication successful"
    });
  });

  return router;
};

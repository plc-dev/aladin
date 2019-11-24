const { AssertionError } = require("assert");
const { ValidationError } = require("./customErrors");
const { MongoError } = require("mongodb");

const errorHandlers = [
  function handleValidationError(error, req, res, next) {
    if (error instanceof ValidationError) {
      console.log(error.stack);
      return res.status(409).json({
        type: "ValidationError",
        message: error.message
      });
    }
    next(error);
  },

  function handleAssertionError(error, req, res, next) {
    if (error instanceof AssertionError) {
      return res.status(400).json({
        type: "AssertionError",
        message: error.message
      });
    }
    next(error);
  },

  function handleDatabaseError(error, req, res, next) {
    if (error instanceof MongoError) {
      return res.status(503).json({
        type: "MongoError",
        message: error.message
      });
    }
    next(error);
  },

  function handleUnhandled(error, req, res, next) {
    console.log(error.stack);
    return res.status(500).json({
      type: "Server",
      message: error.message
    });
  }
];

module.exports = errorHandlers;

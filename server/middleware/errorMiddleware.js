/**
 * @file errorMiddleware.js
 * @description Centralized error handling and 404 middleware for CampusBite.
 * Intercepts Mongoose ValidationErrors, CastErrors, duplicate key constraints, and JWT exceptions.
 * @author Aditya (feat/aditya-auth-security)
 */

/**
 * 404 Not Found catch-all middleware for handling unrecognized API endpoints.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error-handling middleware.
 * Sanitizes stack traces in production environments and structures error payloads.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = err.errors || null;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists`;
  }

  // Handle JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized — invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized — token has expired';
  }

  res.status(statusCode).json({
    message,
    ...(errors && { errors }),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };


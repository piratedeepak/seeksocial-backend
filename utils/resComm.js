import http from 'http'

// Common function to send response with common attributes
export const  responseCommon = (res, statusCode, message, data = null, success = true) => {
  const statusText = http.STATUS_CODES[statusCode];

  const response = {
    success,
    message: message || statusText,
    data
  };

  if (!success) {
    response.error = {
      code: statusCode,
      message: message || statusText
    };
  }

  return res.status(statusCode).json(response);
}
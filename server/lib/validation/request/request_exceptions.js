module.exports = {
  "NOT_ACCEPT_JSON": {
    type: "HTTPHeaderError",
    condition: "!req.headers['accept'] || req.headers['accept'].indexOf('application/json')<0",
    message: "Must accept application/json"
  },
  "XTOKEN_INVALID": {
    type: "HTTPHeaderError",
    condition: "1==0",
    message: "Invalid token"
  },
  "NOT_FORM_URLENCODED": {
    type: "HTTPHeaderError",
    condition: "!req.headers['content-type'] || req.headers['content-type'].indexOf('application/x-www-form-urlencoded')<0",
    message: "Content-Type must be: application/x-www-form-urlencoded"
  },
  "NOT_APPLICATION_JSON": {
    type: "HTTPHeaderError",
    condition: "!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json')<0",
    message: "Content-Type must be: application/json"
  },
  "NOT_FORM_URLENCODED_OR_APPLICATION_JSON": {
    type: "HTTPHeaderError",
    condition: "!req.headers['content-type'] || (req.headers['content-type'].indexOf('application/x-www-form-urlencoded')<0 && req.headers['content-type'].indexOf('application/json')<0)",
    message: "Request Content-Type must be: application/x-www-form-urlencoded or application/json"
  },
  "NOT_EMPTY_REQUEST_BODY": {
    type: "RequiredParameterError",
    condition: "Object.keys(req.body).length === 0",
    message: "Request body can't be empty"
  }
};

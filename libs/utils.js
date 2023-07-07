module.exports = {
  response: (data) => ({
    data,
    error: false,
    errormessage: "",
  }),
  error: (errormessage) => ({
    data: null,
    error: true,
    errormessage,
  }),
};

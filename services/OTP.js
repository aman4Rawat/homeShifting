module.exports = {
  async sendOTP(number, otp, res) {
    const axios = require("axios");

    const options = {
      method: "POST",
      url: "https://api.msg91.com/api/v5/flow/",
      headers: {
        authkey: "124283AhNChXVL584110faa",
        // authkey: "124283AhNChXVL584110fa", // rignt API key
        "content-type": "application/JSON",
        Cookie: "PHPSESSID=p6sigj223tdkhtfnq7l41tplh3",
      },
      data: {
        flow_id: "62333edd43408375e71a6f84",
        sender: "RGHTPS",
        mobiles: "91" + number,
        otp: otp,
      },
    };
    console.log(number, otp);
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};

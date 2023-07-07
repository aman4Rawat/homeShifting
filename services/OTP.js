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
  async verifyOTP(number, otp) {
    const axios = require("axios");
    const code =Number(otp);
    const options = {
      method: "POST",
      url: "https://api.msg91.com/api/v5/otp/verify",
      headers: {
        authkey: "124283AhNChXVL584110fa",
        "content-type": "application/JSON",
        Cookie: "PHPSESSID=p6sigj223tdkhtfnq7l41tplh3",
      },
      data: {
        mobile: "91" + number,
        otp: code,
      },
    };
    try {
      const response = await axios(options);
      console.log(response); // Handle the response data here

      if (response.data.type === "success") {
      return "OTP verification successful";
        // Perform further actions here, such as updating user information or granting access
      } else {
        return "OTP verification failed";
        // Handle the case where OTP verification fails
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};

const CONSTANTS={
	GST_REGEX: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/,
    CAPTCHA_REGEX: /^([0-9]){6}$/,
    GST_DETAILS_URL: "https://services.gst.gov.in/services/api/search/taxpayerDetails",
    GST_CAPTCHA_URL: "https://services.gst.gov.in/services/captcha?rnd=",
    INVALID_GST_CODE: "SWEB_9035",
    INVALID_CAPTCHA_CODE: "SWEB_9000",
    CAPTCHA_COOKIE_STRING: "CaptchaCookie"
}
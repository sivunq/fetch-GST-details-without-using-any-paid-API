# fetch-GST-details-without-using-any-paid-API

This is kind of a hacky way to get GST details without paying for the third party APIs. I used developer tools to analyse how Indian govt's GST details fetching works and created a small service for it, wasn't that starightforward as well, had to figure out bypassing their captcha and much more.  

I'm sharing the functions/module that I used in my Nest.js based service, it should be quite straight forward for you to integrate in your code/service or deploy it as an API.


## Usage Instructions:
1. The first step is to get GST captcha using getGstCaptcha function, frontend needs to hit this function and get captcha image in base64 buffer and a captcha_cookie.
2. Frontend needs to save the captch_cookie which will be used to get gst details in the next call, also render the captcha image for the user to read the captcha which will also be used to get GST details in next call.
2. To get GST details we need captcha, captcha_cookie, gst number as the request parameters. The function getGstDetails validates captcha and returns all the gst details or an error mentioning the reason.


## Future Scope:
Build & deploy a fullstak project to get GST details
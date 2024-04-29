import { CONSTANTS } from './constants';

async getGstCaptcha(): Promise<ResultEntity> {
    let result_entity: ResultEntity = new ResultEntity({});
    try {
      const url: string = `${CONSTANTS.GST_CAPTCHA_URL}${Math.random()}`;
	  
	  //build base64 from captcha image
      const captchaResponse = await axios.get(url, { responseType: 'arraybuffer' });
      const base64Image = Buffer.from(captchaResponse?.data).toString('base64');
		
      //get captcha cookie to be used in next requests
      const cookieHeader = captchaResponse?.headers['set-cookie'];
      let captcha_cookie: string = "";
      for (let i = 0; i < cookieHeader.length; i++) {
        const headerStrings: string = cookieHeader[i].split(";");

        for (let j = 0; j < headerStrings.length; j++) {
          const cookieString = headerStrings[j].split("=");
          if (cookieString[0] === CONSTANTS.CAPTCHA_COOKIE_STRING) {
            captcha_cookie = cookieString[1];
            break;
          }
        }
        if (captcha_cookie)
          break;
      }

      result_entity.setData({
        code: captchaResponse?.status,
        data: {
          captcha_image: base64Image,
          captcha_cookie: captcha_cookie
        }
      });

      return Promise.resolve(result_entity);
    } catch (error) {
      return Promise.reject(error);
    }
  }
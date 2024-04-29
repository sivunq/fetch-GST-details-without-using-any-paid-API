import { CONSTANTS } from './constants';
import { GstDetailsRequestDto } from './gst-details.request.dto';

async fetchGstDetails(gstDetailsRequestDto: GstDetailsRequestDto): Promise<ResultEntity> {
    let result_entity: ResultEntity = new ResultEntity({});

    try {
      let gstDetailsResponse;

      const {gst_number, captcha, captcha_cookie } = gstDetailsRequestDto;
      if (!validGstNumber(gst_number)) {
        this.logger.error(methodName, `Invalid GST Number: ${gst_number}`);
        throw new ErrorEntity({
          http_code: HttpStatus.BAD_REQUEST,
          error: "Invalid Request",
          error_description: `Invalid GST Number`,
          error_code: "true",
        });
      }

      const payload = {
        "gstin": gst_number,
        "captcha": captcha
      };
      const headers = {
        cookie: [`CaptchaCookie=${captcha_cookie}`]
      }
      let gstResponse = await axios.post(CONSTANTS.GST_DETAILS_URL, payload, {
        headers: headers
      });

      const gstData = gstResponse?.data;

      if (gstData?.message === null) {
        if (gstData?.errorCode === CONSTANTS.INVALID_GST_CODE) {
          this.logger.error(methodName, `Invalid GST Number: ${gst_number}`);
          throw new ErrorEntity({
            http_code: HttpStatus.BAD_REQUEST,
            error: "Invalid Request",
            error_description: `Invalid GST Number`,
            error_code: "true",
          });
        }
        else if (gstData?.errorCode === CONSTANTS.INVALID_CAPTCHA_CODE) {
          this.logger.error(methodName, `Invalid GST Captcha: ${captcha}`);
          throw new ErrorEntity({
            http_code: HttpStatus.BAD_REQUEST,
            error: "Invalid Request",
            error_description: `Invalid GST Captcha`,
            error_code: "true",
          });
        }
      }
      else {
        gstDetailsResponse = {
          "status": gstData.sts,
          "legalName": gstData.lgnm,
          "businessNature": gstData.nba,
          "address": gstData.pradr.adr,
          "companyType": gstData.ctb,
        }
      }
      result_entity.setData({
        code: HttpStatus.OK,
        data: gstDetailsResponse,
      });

      return Promise.resolve(result_entity);
    } catch (error) {
      return Promise.reject(error);
    }
  }

//logic to generate last character of GST number & map to validate
const validGstCheckSum = (gst_number: string) => {
    let gstSubstring = gst_number.substring(0, 14);

    let factor = 2, sum = 0, checkCodePoint = 0, i: number, j: number, digit: number, mod: number, codePoint: number, inputChars: string | any[];
    const cpChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    inputChars = gstSubstring.trim().toUpperCase();

    mod = cpChars.length;
    for (let i = inputChars.length - 1; i >= 0; i = i - 1) {
        codePoint = -1;
        for (let j = 0; j < cpChars.length; j = j + 1) {
            if (cpChars[j] === inputChars[i]) {
                codePoint = j;
            }
        }

        digit = factor * codePoint;
        factor = (factor === 2) ? 1 : 2;
        digit = (digit / mod) + (digit % mod);
        sum += Math.floor(digit);
    }
    checkCodePoint = ((mod - (sum % mod)) % mod);

    return (gstSubstring + cpChars[checkCodePoint]) === gst_number;
};

export const validGstNumber = (gst_number: string) => {
    return (validGstCheckSum(gst_number));
};
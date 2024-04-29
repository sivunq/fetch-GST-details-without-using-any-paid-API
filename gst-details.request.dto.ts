import { IsNotEmpty, IsNumberString, IsString, Matches } from "class-validator";
import { CONSTANTS } from "./constants";

export class GstDetailsRequestDto {
    @IsNotEmpty()
    @IsString()
    @Matches(CONSTANTS.GST_REGEX)
    gst_number: string;
    @IsNotEmpty()
    @IsString()
    @Matches(CONSTANTS.CAPTCHA_REGEX)
    captcha: string;
    @IsNotEmpty()
    @IsString()
    captcha_cookie: string;
}
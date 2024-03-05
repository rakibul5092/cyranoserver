import { HttpStatus } from "@nestjs/common";

export interface ExceptionType {
    httpStatus: HttpStatus;
    statusCode?: number;
    message?: string;
}

export const CUSTOM_ERROR_CODES: {[key: string]: ExceptionType} = {
    NOT_VALID_PASSWORD   : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: 4000, message: 'Not valid password' },
    OLD_PASSWORD         : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: 4001, message: 'Old password' },
    INVALID_CODE         : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid Code' },
    NOT_VERIFIED_USER    : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: HttpStatus.BAD_REQUEST, message: 'Not Verified User' },
    MISSING_PASSWORD     : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: HttpStatus.BAD_REQUEST, message: 'Missing Password"' },
    INVALID_EVENT        : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: HttpStatus.BAD_REQUEST, message: 'invalid event' },
    EMAIL_NOT_FOUND      : { httpStatus: HttpStatus.NOT_FOUND, statusCode: HttpStatus.NOT_FOUND, message: 'Email Not Found' },
    EMAIL_NOT_REGISTERED : { httpStatus: HttpStatus.NOT_FOUND, statusCode: HttpStatus.NOT_FOUND, message: 'Email Not Registered' },
    RESOURCE_NOT_FOUND   : { httpStatus: HttpStatus.NOT_FOUND, statusCode: HttpStatus.NOT_FOUND, message: 'Not Found' },
    SEND_EMAIL_ERROR     : { httpStatus : HttpStatus.INTERNAL_SERVER_ERROR, statusCode : HttpStatus.INTERNAL_SERVER_ERROR,
        message    : 'Error While Sending Email' },
    MAX_RETRIES_ERROR          : { httpStatus: HttpStatus.FORBIDDEN, statusCode: HttpStatus.FORBIDDEN, message: 'Reset password Max Number Reached' },
    RESET_PASSWORD_EMAIL_ERROR : { httpStatus: HttpStatus.INTERNAL_SERVER_ERROR, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: '"Error While Sending Reset Password Email' },
    USER_NOT_FOUND             : { httpStatus: HttpStatus.NOT_FOUND, statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found' },
    OTP_SEND_FAILED            : { httpStatus: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error While Sending SMS" },
    OTP_NOT_VALID              : { httpStatus: HttpStatus.FORBIDDEN, message: "OTP not valid" },
    OTP_VERIFICATION_FAILED    : { httpStatus: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error while OTP varification" },
    OTP_EXPIRED                : { httpStatus: HttpStatus.FORBIDDEN, message: "OTP expired" },
    DUPLICATE_FIELD            : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: 11000, message: 'Duplicate Field' },
    MAX_CALENDARS_REACHED      : { httpStatus: HttpStatus.FORBIDDEN, statusCode: 4002, message: 'Max calendars allowed is 10' },
    EMAIL_ALREADY_EXISTS       : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: HttpStatus.BAD_REQUEST, message: 'Email Already Exists' },
    NOT_VALID_CALENDAR_ACCOUNT : { httpStatus: HttpStatus.BAD_REQUEST, statusCode: 4003, message: 'Not Valid Calendar Account' },
}

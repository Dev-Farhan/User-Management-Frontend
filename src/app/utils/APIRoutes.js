// export const host = "http://192.168.1.45:4000";
// export const host = 'http://192.168.21.220:4000'
// export const host = "http://192.168.0.209:4000";
export const host = "https://user-management-backend-lpta.onrender.com/";

//API Endpoints
export const REGISTER = `${host}/api/v1/auth/register`;
export const VERIFY_OTP_ENDPOINT = `${host}/api/v1/auth/verify-otp`;
export const SENDOTP = `${host}/api/v1/auth/send-otp`;
export const UPDATE_USER_PROFILE = `${host}/api/v1/user/update`;
export const GET_USER_PROFILE_BY_ID = (id) =>
  `${host}/api/v1/user/getById/${id}`;

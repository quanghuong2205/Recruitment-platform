export const ERRORCODES = {
  UNKNOWN: '000',
  AUTH_INVALID_CREDENTALS: 100,
  AUTH_FAIL_SIGN_ACCESS_TOKEN: 102,
  AUTH_FAIL_SIGN_REFRESH_TOKEN: 103,
  AUTH_FAIL_VERIFY_ACCESS_TOKEN: 104,
  AUTH_FAIL_VERIFY_REFRESH_TOKEN: 105,
  AUTH_MISS_ACCESS_TOKEN: '106',
  AUTH_MISS_REFRESH_TOKEN: '107',
  AUTH_USER_EXIST: 108,

  REQUEST_INVALID_PARAM_VALUE: '401',
  REQUEST_INVALID_MISS_PARAM: '402',

  DOCUMENT_FAIL_CREATE: 201,
  DOCUMENT_FAIL_UPDATE: 202,
  DOCUMENT_FAIL_DELETE: 203,
  DOCUMENT_FAIL_FIND: 204,

  COMPANY_EMAIL_ALREADY_USED: 301,
  COMPANY_PHONE_ALREADY_USED: 302,
  COMPANY_NOT_FOUND: 303,
};

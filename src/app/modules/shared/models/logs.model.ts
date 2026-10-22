export interface LogToken {
  token: string,
  successful: boolean
}

export enum DeviceType {
  ANDROID_DEVICE = 1,
  IOS_DEVICE = 2,
  POS_DEVICE = 3,
  LAUNCHER_DEVICE = 4,
  WEB_DEVICE = 5
}

export interface EventLog {
  success: boolean
}

export enum EventType {
  EXIT_POS = 1,
  LOGIN = 2,
  LOGOUT = 3,
  LOCAL_PASS_SET = 4,
  LOGIN_ERROR = 5,
  LOCAL_PASS_ERROR = 6,
  APP_OPEN = 7,
  APP_PURCHASE_COMPLETE = 8,
  DIGITAL_ORDER = 8,
  PHYSICAL_ORDER = 9,
  PHYSICAL_BULK_ORDER = 10,
  CRYPTO_CHECK = 11,
  CRYPTO_FINALIZE = 12
}

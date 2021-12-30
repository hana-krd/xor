export class UserDeviceActiveSession {
  ip: string;
  platform: string;
  startDate: Date;
  endDate: Date;
  otp: string;
  otpExpiresAt: Date;
  isOtpVerified: boolean;
  isSessionVerified: boolean;
}

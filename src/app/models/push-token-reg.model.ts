export class PushTokenReg {
  /**
   * The string text of the token
   */
  token!: string;
  // tslint:disable-next-line: variable-name
  /**
   * The device type, 1 = iOS, 2 = Android
   */
  user_device_type_id!: 1|2;
  /**
   * Device UUID
   */
  // tslint:disable-next-line: variable-name
  device_uuid!: string;
}

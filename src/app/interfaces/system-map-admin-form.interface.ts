import { EventEmitter } from 'events';

export interface SystemMapAdminForm {
  /**
   * Provides validation for the form
   */
  valid(): boolean;
  /**
   * Method fir submitting the form
   */
  submitForm();
  /**
   * Used to dismiss the modal
   */
  dismiss();
}

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

/**
 * Used to interact with the loading indicator
 */
export class LoadingService {
  loadingIndicator: any;
  constructor(private loading: LoadingController) { }

  /**
   * Show the loading indicator
   */
  async show() {
    this.loadingIndicator = await this.loading.create({
      message: 'Loading...'
    });
    await this.loadingIndicator.present();
  }

  /**
   * Dismiss the loading indicator
   */
  dismiss() {
    try {
      this.loading.dismiss();
    } catch (error) {
      // ignore
    }
  }
}

import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Subject } from 'rxjs';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private configKeyName = 'app:config';
  constructor() { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData() {
    console.log('Settings data refresh called!');
    this.dataRefreshSource.next();
  }

  async intializeSettingsConfig()
  {
    const config = await this.getConfig();

    if (!config) {
      await Storage.set({ key: this.configKeyName, value: JSON.stringify({
          slideHints: false,
          useTouchId: false
        } as AppConfig)
      });
    }
  }

  async getConfig(): Promise<AppConfig> {
    return JSON.parse((await Storage.get({ key: this.configKeyName })).value) as AppConfig;
  }

  async setConfig(config: AppConfig) {
    await Storage.set({ key: this.configKeyName, value: JSON.stringify(config) });
  }

  // enableTouchId() {
  //   localStorage.setItem('useTouchId', 'true');
  // }

  // disableTouchId(): boolean {
  //   localStorage.setItem('useTouchId', 'false');
  //   return true;
  // }

  // touchIdEnabled(): boolean {
  //   const tId = localStorage.getItem('useTouchId');
  //   return (tId && tId === 'true') ? true : false;
  // }
}

export class AppConfig {
  slideHints: boolean;
  useTouchId: boolean;
}

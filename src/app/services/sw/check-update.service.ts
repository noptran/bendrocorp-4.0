import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckUpdateService {

  constructor(updates: SwUpdate) {
    if (updates.isEnabled) {
      console.log('Service worker updates enabled. The application will automatically check for updates and ensure they are loaded into the cache.');
      interval(1000 * 15).subscribe(() => {
        // console.log('Service worker checking for updates');
        updates.checkForUpdate();
      }); // check about every 15 seconds
    } else {
      console.warn('Service worker updates are not enabled!');
    }
  }
}
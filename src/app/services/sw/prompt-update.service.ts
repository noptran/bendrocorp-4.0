import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptUpdateService {

  private updateInfoSource = new Subject();
  updateAnnounced$ = this.updateInfoSource.asObservable();

  constructor(
    updates: SwUpdate
    ) {
    updates.available.subscribe(event => {
      this.updateInfoSource.next('UPDATE');
    },
      error => console.error(error)
    );
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bendro-safe-incident',
  templateUrl: './bendro-safe-incident.page.html',
  styleUrls: ['./bendro-safe-incident.page.scss'],
})
export class BendroSafeIncidentPage implements OnInit {
  initialDataLoaded: boolean;
  defaultReturnPath: string;

  constructor() { }

  ngOnInit() {
  }

}

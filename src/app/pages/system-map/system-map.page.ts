import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-map',
  templateUrl: './system-map.page.html',
  styleUrls: ['./system-map.page.scss'],
})
export class SystemMapPage implements OnInit {
  readonly slideOpts = {
    slidesPerView: 4
  };

  initialDataLoaded: boolean = true;
  searchFilter: string;

  constructor() { }

  onSearchKeyUp() {

  }

  ngOnInit() {
  }

}

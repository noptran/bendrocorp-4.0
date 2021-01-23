import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-map-list-card',
  templateUrl: './system-map-list-card.component.html',
  styleUrls: ['./system-map-list-card.component.scss'],
})
export class SystemMapListCardComponent implements OnInit {
  @Input() smObject: any;
  @Input() showTags = true;
  constructor() { }

  ngOnInit() {}

}

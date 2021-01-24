import { Component, Input, OnInit } from '@angular/core';
import { SystemImage } from 'src/app/models/system-map.model';

@Component({
  selector: 'app-system-image-list-card',
  templateUrl: './system-image-list-card.component.html',
  styleUrls: ['./system-image-list-card.component.scss'],
})
export class SystemImageListCardComponent implements OnInit {
  @Input() image: SystemImage;

  constructor() { }

  ngOnInit() {}

}

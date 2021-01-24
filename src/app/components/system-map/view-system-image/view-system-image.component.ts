import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SystemImage } from 'src/app/models/system-map.model';

@Component({
  selector: 'app-view-system-image',
  templateUrl: './view-system-image.component.html',
  styleUrls: ['./view-system-image.component.scss'],
})
export class ViewSystemImageComponent implements OnInit {
  image: SystemImage;

  constructor(
    private modalController: ModalController
  ) { }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}

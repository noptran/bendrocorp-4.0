import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BendroAlert } from 'src/app/models/alert.model';

@Component({
  selector: 'app-view-alert',
  templateUrl: './view-alert.component.html',
  styleUrls: ['./view-alert.component.scss'],
})
export class ViewAlertComponent implements OnInit {
  alert: BendroAlert;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) { }

  openAlertLocation() {
   if (this.alert.star_object) {
    const uri = `/system-map/${this.alert.star_object.id.split('-')[0]}-${this.alert.star_object.title.toLowerCase().split(' ').join('-').replace(/[^-A-Za-z0-9_]+/g, '')}`;
    this.router.navigateByUrl(uri);
    this.dismiss();
   }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}

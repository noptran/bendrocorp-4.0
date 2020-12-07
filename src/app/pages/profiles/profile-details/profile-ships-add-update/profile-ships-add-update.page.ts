import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Character } from 'src/app/models/character.model';
import { OwnedShip, Ship } from 'src/app/models/ship.models';
import { ProfileService } from 'src/app/services/profile.service';

import { Plugins } from '@capacitor/core';

const { Modals } = Plugins;

@Component({
  selector: 'app-profile-ships-add-update',
  templateUrl: './profile-ships-add-update.page.html',
  styleUrls: ['./profile-ships-add-update.page.scss'],
})
export class ProfileShipsAddUpdatePage implements OnInit {
  ownedShip: OwnedShip;
  character: Character;
  shipTypes: Ship[] = [];
  formAction: string;
  dataSubmitted: boolean = false;

  constructor(
    private profileService: ProfileService,
    private modalController: ModalController,
    // private messageService: MessageService
  ) { }

  async addUpdateOwnedShip() {
    if (this.ownedShip.id) {
      // TODO: This must be supported...
      // this.messageService.alert('Not supported!');
      await Modals.alert({
        title: 'Not supported',
        message: 'Not supported!'
      });
    } else {
      this.profileService.addShip(this.ownedShip).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.profileService.refreshData();
          this.dismiss();
        }
      });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  ngOnInit() {
    this.profileService.list_ships().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        console.log(results);
        this.shipTypes = results;
      }
    });

    if (!this.ownedShip) {
      this.ownedShip = { character_id: this.character.id } as OwnedShip;
      this.formAction = 'Create';
    } else {
      this.formAction = 'Update';
    }
  }

}

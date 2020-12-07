import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Character } from 'src/app/models/character.model';
import { EventAttendence } from 'src/app/models/event.model';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-service-record',
  templateUrl: './profile-service-record.page.html',
  styleUrls: ['./profile-service-record.page.scss'],
})
export class ProfileServiceRecordPage implements OnInit {
  @Input() character: Character;
  awardChunks = [];

  // loading indicator
  loadingIndicator: any;

  constructor(
    private router: Router,
    private loading: LoadingController,
    private profileService: ProfileService
  ) { }

  chunkArray(array, size) {
    // tslint:disable-next-line:prefer-const
    let result = [];
    for (const value of array) {
      const lastArray = result[result.length - 1];
      if (!lastArray || lastArray.length === size) {
        result.push([value]);
      } else {
        lastArray.push(value);
      }
    }
    return result;
  }

  attendedEvents(attends: EventAttendence[]) {
    if (this.character) {
      return attends.filter(x => x.attendence_type_id === 1);
    }
  }

  async ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      console.log('Loading route info');
      this.character = this.router.getCurrentNavigation().extras.state.character;
      console.log(this.character);
      this.awardChunks = this.chunkArray(this.character.awards, 2);
    } else {
      // create the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();


    }
  }

}

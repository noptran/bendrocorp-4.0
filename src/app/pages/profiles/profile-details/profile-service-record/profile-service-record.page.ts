import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
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
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private loading: LoadingController,
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute,
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

      // go look up the data
      const characterId = parseInt(this.route.snapshot.paramMap.get('id'), null);
      this.profileService.fetch(characterId).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.character = results;
          this.loadingIndicator.dismiss();
        } else {
          await Toast.show({
            text: 'Error Occured: Could not load background data!'
          });
          this.router.navigate(['profiles', characterId]);
        }
      });
    }
  }

}

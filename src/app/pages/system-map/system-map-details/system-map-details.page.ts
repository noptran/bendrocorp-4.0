import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription, concat, from } from 'rxjs';
import { concatAll } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { StarObject } from 'src/app/models/system-map.model';
import { SystemMapService } from 'src/app/services/system-map.service';
import { Plugins } from '@capacitor/core';
import { AddUpdateStarObjectComponent } from 'src/app/components/system-map/add-update-star-object/add-update-star-object.component';

const { Toast, Modals } = Plugins;

@Component({
  selector: 'app-system-map-details',
  templateUrl: './system-map-details.page.html',
  styleUrls: ['./system-map-details.page.scss'],
})
export class SystemMapDetailsPage implements OnInit, OnDestroy {
  isEditor: boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true : false;

  fullList: StarObject[] = [];
  selectedItemId: string;
  selectedItem: StarObject;

  // subscriptions
  routeSubscription: Subscription;
  updateSubscription: Subscription;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  readonly routePartialObjectId: string;
  initialDataLoaded: boolean;

  constructor(
    private systemMapService: SystemMapService,
    private authService: AuthService,
    private loading: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
    this.routePartialObjectId = this.route.snapshot.paramMap.get('id').split('-')[0];

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.selectedItem = this.router.getCurrentNavigation().extras.state.smObject;
      console.log(this.selectedItem);
    }

    this.updateSubscription = this.systemMapService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchSystemObjectsAndSelect();
    });
  }

  fetchSystemObjectsAndSelect() {
    this.systemMapService.searchByUUID(this.routePartialObjectId).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        if (results.length === 1) { // we found found it
          this.selectedItem = results[0];
          this.initialDataLoaded = true;
        } else if (results.length === 0) { // we didn't find it
          Toast.show({
            text: 'System Map object not found!'
          });
          this.router.navigateByUrl('/system-map');
        } else {
          Toast.show({
            text: 'Multiple objects found for selected partial ID. Please contact an app administrator.'
          });
          this.router.navigateByUrl('/system-map');
        }

        // stop the spinner
        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      }
    });
  }

  parseObjectLink(item: StarObject): string {
    const urlObjectId = `${item.id.split('-')[0]}-${item.title.trim().toLowerCase().split(' ').join('-')}`;
    return urlObjectId;
  }

  async fetchObjectDetails() {
    // clear the current item if it exists
    if (this.selectedItem) {
      this.selectedItem = null;
    }

    // spin the spinner
    // setup the loading indicator
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.fetchSystemObjectsAndSelect();

  }

  async updateStarObject() {
    const modal = await this.modalController.create({
      component: AddUpdateStarObjectComponent,
      componentProps: {
        starObject: this.selectedItem
      }
    });
    return await modal.present();
  }

  async archiveStarObject() {
    if (this.selectedItem && this.selectedItem.id) {
      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to archive this system map object?'
      });

      if (confirmRet.value) {
        this.systemMapService.archiveStarObject(this.selectedItem).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.router.navigateByUrl('/system-map');
          }
        });
      }
    }
  }

  async ngOnInit() {
    if (!this.selectedItem) {
      await this.fetchObjectDetails();
    }
  }

  ngOnDestroy() {
    //
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}

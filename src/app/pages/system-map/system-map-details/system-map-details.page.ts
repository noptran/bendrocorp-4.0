import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription, concat, from } from 'rxjs';
import { concatAll } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { SystemMapSearchItem } from 'src/app/models/system-map.model';
import { SystemMapService } from 'src/app/services/system-map.service';
import { Plugins } from '@capacitor/core';

const { Toast } = Plugins;

@Component({
  selector: 'app-system-map-details',
  templateUrl: './system-map-details.page.html',
  styleUrls: ['./system-map-details.page.scss'],
})
export class SystemMapDetailsPage implements OnInit, OnDestroy {
  isEditor: boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true : false;

  fullList: SystemMapSearchItem[] = [];
  selectedItemId: string;
  selectedItem: SystemMapSearchItem;

  // subscriptions
  routeSubscription: Subscription;
  updateSubscription: Subscription;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  readonly routePartialObjectId: string;

  constructor(
    private systemMapService: SystemMapService,
    private authService: AuthService,
    private loading: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.routePartialObjectId = this.route.snapshot.paramMap.get('id').split('-')[0];

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.selectedItem = this.router.getCurrentNavigation().extras.state.smObject;
      console.log(this.selectedItem);
    }
  }

  fetchSystemObjectsAndSelect() {
    // collection for all of the requests
    // this.fullList = [];
    var objectRequests = [];
    let completed = 0;

    // requests
    objectRequests.push(this.systemMapService.listSystems());
    objectRequests.push(this.systemMapService.listPlanets());
    objectRequests.push(this.systemMapService.listMoons());
    objectRequests.push(this.systemMapService.listSystemObjects());
    objectRequests.push(this.systemMapService.listLocations());
    objectRequests.push(this.systemMapService.listSettlements());
    objectRequests.push(this.systemMapService.listMissionGivers());
    objectRequests.push(this.systemMapService.listJumpPoints());

    // concat and execute
    const doObjectRequests = from(objectRequests);
    doObjectRequests.pipe(concatAll())
    .subscribe((results: any) => {
      if (!(results instanceof HttpErrorResponse)) {
        completed += 1;
        // console.log(completed);
        // console.log(results);

        // concat results into the full list
        let objectResult = results.map(x => {
          // the search object represents all of the possible fields that could be in System Map
          let searchObject = {
            // things everything will have that may even be potentially searchable
            id: x.id,
            title: x.title,
            description: x.description,
            tags: x.tags,
            kind: x.kind,
            primary_image_url: x.primary_image_url,
            primary_image_url_full: x.primary_image_url_full,
            // specific items below this
            planets: x.planets,
            moons: x.moons,
            locations: x.locations,
            settlements: x.settlements,
            system_objects: x.system_objects,
            jump_points: x.jump_points,
            mission_givers: x.mission_givers,
            faction_affiliation: x.faction_affiliation,
            faction_affiliation_id: x.faction_affiliation_id,
            jurisdiction: x.jurisdiction,
            jurisdiction_id: x.jurisdiction_id,
            object_type: x.object_type,
            object_type_id: x.object_type_id,
            location_type: x.location_type,
            location_type_id: x.location_type_id,
            system_map_images: x.system_map_images,
            atmospheric_height: x.atmospheric_height,
            general_radiation: x.general_radiation,
            economic_rating: x.economic_rating,
            population_density: x.population_density,
            minimum_criminality_rating: x.minimum_criminality_rating
          } as SystemMapSearchItem;

          // parent
          if (x.parent) {
            searchObject.parent_id = x.parent.id;
            searchObject.parent = x.parent;
          }

          // image
          if (x.primary_image_one_url) {
            searchObject.primary_image_url = x.primary_image_one_url;
          } else {
            searchObject.primary_image_url = x.primary_image_url;
          }

          return searchObject;
        }); // end results concat

        // push the results
        this.fullList.push(objectResult);

        // if completed, stop the spinner and flatten the list
        if (completed >= objectRequests.length) {
          // flatten the whole list
          this.fullList = this.fullList.flat();

          // select an item
          this.selectedItem = this.fullList.find(x => {
            return x.id.includes(this.routePartialObjectId);
          });

          // write the object to the console
          console.log(this.selectedItem);

          // if an item has not been selected then route back to base system map page
          if (!this.selectedItem) {
            Toast.show({
              text: 'System Map object not found!'
            });
            this.router.navigateByUrl('/system-map');
          }

          // stop the spinner
          if (this.loadingIndicator) {
            this.loadingIndicator.dismiss();
          }
        }
      } else {
        console.error('uh oh...something went wrong..');
      }
    });
  }

  parseObjectLink(item: SystemMapSearchItem): string {
    const urlObjectId = `${item.id.split('-')[0]}-${item.title.trim().toLowerCase().split(' ').join('-')}`;
    return urlObjectId;
  }

  async fetchObjectDetails() {
    console.log(this.route.params);

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

  async ngOnInit() {
    if (!this.selectedItem) {
      await this.fetchObjectDetails();
    }
  }

  ngOnDestroy() {
    //
    if (this.updateSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.updateSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}

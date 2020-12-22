import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, merge, Observable, Subject, Subscription } from 'rxjs';
import { concat, concatAll, debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { StarSystem, Planet, Moon, SystemObject, Settlement, SystemLocation, MissionGiver, SystemMapSearchItem } from 'src/app/models/system-map.model';
import { AppConfig, SettingsService } from 'src/app/services/settings.service';
import { SystemMapService } from 'src/app/services/system-map.service';

@Component({
  selector: 'app-system-map',
  templateUrl: './system-map.page.html',
  styleUrls: ['./system-map.page.scss'],
})
export class SystemMapPage implements OnInit, OnDestroy {
  readonly slideOpts = {
    slidesPerView: 4
  };

  initialDataLoaded: boolean = false;
  filterRestricted = true;
  searchFilter: string;

  // seperated object arrays
  systems: StarSystem[];
  planets: Planet[];
  moons: Moon[];
  systemObjects: SystemObject[];
  settlements: Settlement[];
  locations: SystemLocation[];
  missionGivers: MissionGiver[];

  // search stuff
  fullList: SystemMapSearchItem[] = [];
  searchList: SystemMapSearchItem[] = [];
  recentItems: SystemMapSearchItem[] = [];
  isFiltering: boolean = false;

  // limits the number of characters shown in the item boxes
  listItemTextLimit = 150;

  // https://stackoverflow.com/questions/42761163/angular-2-debouncing-a-keyup-event
  private searchSubject: Subject<string> = new Subject();

  // detail panel
  selectedListItemId: string;
  selectedListItem: SystemMapSearchItem;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;
  config: AppConfig;

  // subscriptions
  settingsSubscription: Subscription;

  constructor(
    private systemMapService: SystemMapService,
    private authService: AuthService,
    // private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingController,
    private settingsService: SettingsService
  ) {
    this.settingsSubscription = this.settingsService.dataRefreshAnnounced$.subscribe(() => {
      this.getSettings();
    });
  }

  filterItems() {
    // console.log('filter me');
    // console.log(this.searchFilter);

    if (this.searchFilter && this.fullList) {
      this.isFiltering = true;
      let filtered = [];
      filtered = this.fullList.filter(it => {
        // console.log(it);
        return it.title.toLowerCase().includes(this.searchFilter.toLowerCase())
        || (it.description && it.description.toLowerCase().includes(this.searchFilter.toLowerCase()))
        || (it.tags && it.tags.toLowerCase().includes(this.searchFilter.toLowerCase()))
        || (it.parent && it.parent.title && it.parent.title.toLowerCase().includes(this.searchFilter.toLowerCase()))
        || (it.kind && it.kind.toLowerCase().includes(this.searchFilter.toLowerCase()));
      });

      this.searchList = filtered;
      console.log(this.searchList);
      this.isFiltering = false;
    } else {
      this.searchList = [];
      this.isFiltering = false;
    }
  }

  fetchTypeOfItem(itemType: string) {
    if (this.fullList) {
      return this.fullList.filter(x => x.kind.toLowerCase() === itemType.toLowerCase());
    }
  }

  async getSettings() {
    this.config = await this.settingsService.getConfig();
  }

  selectListItem(listItem: SystemMapSearchItem) {
    this.recentItems = this.systemMapService.addRecentSelectedListItems(listItem);
    this.router.navigate(['system-map', `${listItem.id.split('-')[0]}-${listItem.title.toLowerCase().replace(' ', '-')}`], { state: { systemMapItem: JSON.stringify(listItem) } })
    // this.selectedListItem = listItem;
  }

  fetchSystemObjects() {
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
    // const doObjectRequests = concat.apply(this, objectRequests);
    // let doObjectRequests = concat(objectRequests);
    // const doObjectRequests = merge(objectRequests);
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
          this.fullList = this.fullList.flat();

          // stop the spinner
          if (this.loadingIndicator) {
            this.loadingIndicator.dismiss();
          }

          // loaded
          this.initialDataLoaded = true;

          console.log(this.fullList);

        }
      } else {
        console.error('uh oh...something went wrong..');
      }
    });
  }

  clearRecents() {
    this.recentItems = this.systemMapService.clearRecentSelectedListItems();
  }

  onSearchKeyUp(){
    this.searchSubject.next();
  }

  async ngOnInit() {
    // spin the spinner
    // setup the loading indicator
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    // fetch the config
    await this.getSettings();

    // fetch the recent items
    this.recentItems = this.systemMapService.recentSelectedListItems();

    // fetch all of the system objects
    this.fetchSystemObjects();

    // setup the filter debounce
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.filterItems();
    });
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

}

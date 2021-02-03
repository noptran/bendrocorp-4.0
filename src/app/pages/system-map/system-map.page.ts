import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Toast } from '@capacitor/core';
import { LoadingController, Platform, IonSlides, ModalController } from '@ionic/angular';
import { from, merge, Observable, Subject, Subscription } from 'rxjs';
import { concat, concatAll, debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateStarObjectComponent } from 'src/app/components/system-map/add-update-star-object/add-update-star-object.component';
import { StarObject} from 'src/app/models/system-map.model';
import { AppConfig, SettingsService } from 'src/app/services/settings.service';
import { SystemMapService } from 'src/app/services/system-map.service';

@Component({
  selector: 'app-system-map',
  templateUrl: './system-map.page.html',
  styleUrls: ['./system-map.page.scss'],
})
export class SystemMapPage implements OnInit, OnDestroy {
  slideOpts = {
    slidesPerView: 0
  };

  isAdmin: boolean;

  // meta
  initialDataLoaded: boolean = false;
  filterRestricted = true;
  searchFilter: string;

  // sliders
  @ViewChild('slidesSystems') slidesSystems: IonSlides;
  @ViewChild('slidesPeople') slidesPeople: IonSlides;
  @ViewChild('slidesLocations') slidesLocations: IonSlides;
  @ViewChild('slidesSearch') slidesSearch: IonSlides;

  // seperated object arrays
  // systems: StarSystem[];
  // planets: Planet[];
  // moons: Moon[];
  // systemObjects: SystemObject[];
  // settlements: Settlement[];
  // locations: SystemLocation[];
  // missionGivers: MissionGiver[];

  // search stuff
  fullList: StarObject[] = [];
  searchList: StarObject[] = [];
  recentItems: StarObject[] = [];
  recentlyAddedItems: StarObject[] = [];
  isFiltering: boolean = false;
  showSlides = true;

  // limits the number of characters shown in the item boxes
  listItemTextLimit = 150;

  // https://stackoverflow.com/questions/42761163/angular-2-debouncing-a-keyup-event
  private searchSubject: Subject<string> = new Subject();

  // detail panel
  selectedListItemId: string;
  selectedListItem: StarObject;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;
  config: AppConfig;

  // subscriptions
  settingsSubscription: Subscription;
  resizeSubscription: Subscription;
  updateSubscription: Subscription;

  constructor(
    private systemMapService: SystemMapService,
    private authService: AuthService,
    // private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingController,
    private settingsService: SettingsService,
    private platform: Platform,
    private modalController: ModalController
  ) {
    this.settingsSubscription = this.settingsService.dataRefreshAnnounced$.subscribe(() => {
      this.getSettings();
    });

    this.resizeSubscription = this.platform.resize.subscribe(() => {
      this.determineSlideCount();
    });

    this.updateSubscription = this.systemMapService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchSystemObjects();
    });
  }

  // populateRecentlyAddedItems() {
  //   if (this.fullList) {
  //     let recentlyAddedList = this.fullList;

  //     // adjust the data
  //     recentlyAddedList = recentlyAddedList

  //     this.recentlyAddedItems = recentlyAddedList;
  //   }
  // }

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

  selectListItem(listItem: StarObject) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      // state: {
      //   smObject: listItem
      // }
    };

    const uri = `/system-map/${listItem.id.split('-')[0]}-${listItem.title.toLowerCase().split(' ').join('-').replace(/[^-A-Za-z0-9_]+/g, '')}`;
    console.log(uri);

    this.router.navigateByUrl(uri, navigationExtras);
  }

  fetchSystemObjects(event?: any) {
    this.systemMapService.listStarObjects().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        // full list
        this.fullList = results;

        // recently added items
        let toFilter = Object.assign([], results); // this is to fix issues with splicing
        this.recentlyAddedItems = toFilter.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }).splice(0, 10);

        this.initialDataLoaded = true;
      }

      // stop the spinner
      if (this.loadingIndicator) {
        this.loading.dismiss();
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  doRefresh(event: any) {
    this.fetchSystemObjects(event);
  }

  clearRecents() {
    // this.recentItems = this.systemMapService.clearRecentSelectedListItems();
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

    while (!this.loadingIndicator) {
      // this might be a terrible idea...
      // but it should create a temp ms long hold to prevent the app from the skipping past the indicator being loaded
    }

    // system map admin
    this.isAdmin = await this.authService.hasClaim(23);

    // fetch the config
    await this.getSettings();

    this.determineSlideCount();

    // fetch the recent items
    // this.recentItems = this.systemMapService.recentSelectedListItems();

    // fetch all of the system objects
    this.fetchSystemObjects();

    // setup the filter debounce
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.filterItems();
    });
  }

  private determineSlideCount() {
    const platWidth = this.platform.width();
    // console.log(platWidth);
    const big = 4;
    const small = 2;

    if (platWidth < 600) { // this.platform.is('mobile') ||
      this.slideOpts.slidesPerView = small;
      // if (this.slidesSearch) {
      //   this.slidesSearch.options.slidesPerView = small;
      // }
      // this.slidesPeople.options.slidesPerView = small;
      // this.slidesLocations.options.slidesPerView = small;
      // this.slidesSystems.options.slidesPerView = small;
    } else {
      this.slideOpts.slidesPerView = big;
      // if (this.slidesSearch) {
      //   this.slidesSearch.options.slidesPerView = big;
      // }
      // this.slidesPeople.options.slidesPerView = big;
      // this.slidesLocations.options.slidesPerView = big;
      // this.slidesSystems.options.slidesPerView = big;
    }
  }

  async addStarObject() {
    const modal = await this.modalController.create({
      component: AddUpdateStarObjectComponent
    });
    return await modal.present();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }

    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}

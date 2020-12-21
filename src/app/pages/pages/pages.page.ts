import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { PageService } from 'src/app/services/page.service';
import { Plugins } from '@capacitor/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Page, PageCategory } from 'src/app/models/page.model';
import { AppConfig, SettingsService } from 'src/app/services/settings.service';
const { Toast, Modals } = Plugins;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {

  readonly slideOpts = {
    slidesPerView: 2
  };

  config: AppConfig;

  // general vars
  pages: Page[] = [];
  pageCategories: PageCategory[] = [];

  // pages into categories
  featuredPages: Page[] = [];
  guidePages: Page[] = [];
  policyPages: Page[] = [];
  yourPages: Page[] = [];
  otherPages: Page[] = [];

  // subscription
  pageSubscription: Subscription;

  //
  searchFilter: string;
  filteredPages: Page[];
  isFiltering: boolean;
  private searchSubject: Subject<string> = new Subject();
  private searchSubscription: Subscription;

  //
  userId: number;
  isEditor: boolean;
  isAdmin: boolean;
  initialDataLoaded = false;
  creatingPage = false;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  //
  settingsSubscription: Subscription;

  constructor(
    private loading: LoadingController,
    private authService: AuthService,
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.pageSubscription = this.pageService.dataRefreshAnnounced$.subscribe((results) => {
      this.fetchPagesAndCategories();
    });

    this.settingsSubscription = this.settingsService.dataRefreshAnnounced$.subscribe(async () => {
      console.log('pages settings update');

      await this.getSettings();

      console.log(`pages slide hints: ${this.config.slideHints}`);

    });
  }

  async createPage() {
    if (this.isEditor || this.isAdmin) {
      this.creatingPage = true;
      this.pageService.createPage({ title: 'A New Page' } as Page).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.pageService.refreshData();
          this.openEditPage(results);
        }

        this.creatingPage = false;
      });
    } else {
      this.creatingPage = false;
      await Toast.show({
        text: 'You are not authorized to create a new page!'
      });
    }
  }

  async getSettings() {
    this.config = await this.settingsService.getConfig();
  }

  openPage(page: Page) {
    console.log(page);

    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        page
      }
    };

    this.router.navigate([`${page.id.split('-')[0]}-${page.title.toLowerCase().split(' ').join('-')}`], navigationExtras);
  }

  openEditPage(page: Page) {
    this.router.navigateByUrl(`/pages/${page.id}/edit`);
  }

  doRefresh(event: any) {
    this.fetchPagesAndCategories(event);
  }

  async fetchPagesAndCategories(event?: any) {
    this.pageService.listPages().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.pages = results;
        // this.pageCategories = this.pages.map(x => x.page_category);
        this.yourPages = this.pages.filter((val) => {
          if (val.creator.id === this.userId) {
            return val;
          }
        });

        // re-init the categories
        this.featuredPages = [];
        this.guidePages = [];
        this.policyPages = [];
        this.otherPages = [];

        //
        this.pages.forEach((page) => {
          if (page.categories.filter(x => x.id === this.pageService.featuredCategoryId).length > 0 && page) {
            this.featuredPages.push(page);
          } else if (page.categories.filter(x => x.id === this.pageService.policiesCategoryId).length > 0) {
            this.policyPages.push(page);
          } else if (page.categories.filter(x => x.id === this.pageService.guidesCategoryId).length > 0) {
            this.guidePages.push(page);
          } else {
            this.otherPages.push(page);
          }
        });

        // stop the spinner
        if (this.loadingIndicator) {
          this.loadingIndicator.dismiss();
        }

        // show data as loaded
        this.initialDataLoaded = true;

        if (event) {
          event.target.complete();
        }

        // debug logging
        console.log(this.pages);
        console.log(this.pageCategories);
      }
    });
  }

  searchItems() {
    if (this.searchFilter && this.searchFilter.length > 3) {
      // var
      const searchText = this.searchFilter.toLowerCase();
      this.isFiltering = true;

      // search the pages and filter
      this.filteredPages = this.pages.filter(x =>
        x.title.toLowerCase().includes(searchText.toLowerCase()) ||
        x.subtitle.toLowerCase().includes(searchText.toLowerCase()) ||
        x.content.toLowerCase().includes(searchText.toLowerCase())
      );

      console.log(this.filteredPages);

      this.isFiltering = false;
    } else {
      this.filteredPages = [];
    }
  }

  onSearchKeyUp() {
    this.searchSubject.next();
  }

  async ngOnInit() {
    // setup the loading indicator
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    // get setting
    await this.getSettings();

    // get the user id
    this.userId = (await this.authService.retrieveUserSession()).id;

    // get the auth data
    this.isEditor = (await this.authService.hasClaim(29) || await this.authService.hasClaim(30));
    this.isAdmin = await this.authService.hasClaim(30);

    // run the initial fetch
    this.fetchPagesAndCategories();

    // create the subscription for search
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.searchItems();
    });
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

}

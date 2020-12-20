import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { PageService } from 'src/app/services/page.service';
import { Plugins } from '@capacitor/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Page, PageCategory } from 'src/app/models/page.model';
const { Toast, Modals } = Plugins;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {

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
  subscription: Subscription;

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

  constructor(
    private loading: LoadingController,
    private authService: AuthService,
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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

  openPage(page: Page) {
    this.router.navigateByUrl(`/pages/${page.id.split('-')[0]}-${page.title.toLowerCase().replace(' ', '-')}`);
  }

  openEditPage(page: Page) {
    this.router.navigateByUrl(`/pages/${page.id}/edit`);
  }

  async fetchPagesAndCategories() {
    this.pageService.listPages().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.pages = results;
        // this.pageCategories = this.pages.map(x => x.page_category);
        this.yourPages = this.pages.filter((val) => {
          if (val.creator.id === this.userId) {
            return val;
          }
        });

        // ?
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

      this.isFiltering = false;
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

}

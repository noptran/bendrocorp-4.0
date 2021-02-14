import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';
import { Remarkable } from 'remarkable';
import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';

const { Modals, Toast } = Plugins;

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.page.html',
  styleUrls: ['./page-details.page.scss'],
})
export class PageDetailsPage implements OnInit, OnDestroy {
  md = new Remarkable();
  page: Page;
  readonly pageId: string;
  userId: number;
  isEditor: boolean;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  // other
  pageSubscription: Subscription;

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loading: LoadingController,
    private domSanitizer: DomSanitizer
  ) {
    this.pageId = this.route.snapshot.paramMap.get('id').split('-')[0];

    if (this.router.getCurrentNavigation()?.extras.state?.page) {
      this.page = this.router.getCurrentNavigation().extras.state.page;
    }

    this.pageSubscription = this.pageService.dataRefreshAnnounced$.subscribe(() => {
      this.getPage();
    });
  }

  renderMarkdown() {
    if (this.page) {
      return this.domSanitizer.bypassSecurityTrustHtml(this.md.render(this.page.content));
    }
  }

  getPage() {
    if (this.pageId) {
      this.pageService.pageSearch(this.pageId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.page = results[0];
          // this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.page.content);

          if (this.loadingIndicator) {
            this.loadingIndicator.dismiss();
          }
        } else {
          this.router.navigate(['pages']);
        }
      });
    }
  }

  editPage() {
    if (this.isEditor || this.isAdmin) {
      const navigationExtras: NavigationExtras = {
        relativeTo: this.route,
        state: {
          page: this.page
        }
      };

      this.router.navigate(['edit'], navigationExtras);
    }
  }

  async archivePage() {
    if (this.isAdmin) {
      // confirm this is what the user wants to do
      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to archive this page?'
      });

      // check the results
      if (confirmRet.value) {
        this.pageService.archivePage(this.page).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            Toast.show({
              text: 'Page archived!'
            });
            this.pageService.refreshData();
            this.router.navigateByUrl('/pages');
          }
        });
      }
    }
  }

  authCheck() {

  }

  async ngOnInit() {
    // get the user id
    this.userId = (await this.authService.retrieveUserSession()).id;

    // get the auth data
    this.isEditor = (await this.authService.hasClaim(29) || await this.authService.hasClaim(30));
    this.isAdmin = await this.authService.hasClaim(30);

    if (!this.page) {
      //
      console.log('page not passed - fetching');

      // setup the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();
      this.getPage();
    } else {
      console.log('page passed from parent');
    }
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

}

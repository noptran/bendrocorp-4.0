import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { FieldDescriptor } from 'src/app/models/field.model';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-add-remove-page',
  templateUrl: './add-remove-page.page.html',
  styleUrls: ['./add-remove-page.page.scss'],
})
export class AddRemovePagePage implements OnInit {
  readonly pageId: string;
  pageUri: string;
  page: Page;
  userId: number;
  isEditor: boolean;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;
  pageCategories: FieldDescriptor[];

  // this is for the form only
  formCategoryIds: string[];

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loading: LoadingController,
  ) {
    this.pageId = this.route.snapshot.paramMap.get('id').split('-')[0];

    if (this.router.getCurrentNavigation()?.extras.state?.page) {
      this.page = this.router.getCurrentNavigation().extras.state.page as Page;
      this.pageUri = `${this.page.id.split('-')[0]}-${this.page.title.toLowerCase().split(' ').join('-')}`;
    }
  }

  getPage() {
    if (this.pageId) {
      this.pageService.pageSearch(this.pageId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.page = results[0] as Page;
          this.pageUri = `${this.page.id.split('-')[0]}-${this.page.title.toLowerCase().split(' ').join('-')}`;

          this.initParseIdsToCatArray();

          if (this.loadingIndicator) {
            this.loadingIndicator.dismiss();
          }
        } else {
          this.router.navigate(['pages']);
        }
      });
    }
  }

  updatePage() {
    if (this.page && this.page.id) {
      this.pageService.updatePage(this.page).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log('updated!');
        }
      });
    }
  }

  getCategories(): Promise<boolean> {
    return new Promise((resolve, error) => {
      this.pageService.listPageCategories().subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.pageCategories = results;
          resolve(true);
        } else {
          error(false);
        }
      });
    });
  }

  initParseIdsToCatArray() {
    this.formCategoryIds = this.page.categories.map((infraction) => {
      return infraction.id;
    });

  }

  async ngOnInit() {
    // get the user id
    this.userId = (await this.authService.retrieveUserSession()).id;

    // get the auth data
    this.isEditor = (await this.authService.hasClaim(29) || await this.authService.hasClaim(30));
    this.isAdmin = await this.authService.hasClaim(30);

    await this.getCategories();

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
      this.initParseIdsToCatArray();
    }
  }

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateIntelReportComponent } from 'src/app/components/ben-sec/add-update-intel-report/add-update-intel-report.component';
import { FieldDescriptor } from 'src/app/models/field.model';
import { BenSecListItem, IntelligenceCase } from 'src/app/models/intel.model';
import { FieldService } from 'src/app/services/field.service';
import { IntelService } from 'src/app/services/intel-service.service';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-ben-sec',
  templateUrl: './ben-sec.page.html',
  styleUrls: ['./ben-sec.page.scss'],
})
export class BenSecPage implements OnInit, OnDestroy {
  // security
  isReader: boolean;
  isWriter: boolean;

  // main vars
  fetchedItems: BenSecListItem[] = [];
  filteredItems: BenSecListItem[] = [];

  // search
  /**
   * The actual search filter
   */
  searchFilter: string;
  private searchSubject: Subject<string> = new Subject();
  searchSubscription: Subscription;

  // data subscription
  caseSubscription: Subscription;

  // meta
  initialDataLoaded = false;
  filterDescriptors: FieldDescriptor[] = [];
  selectedFilters: any[] = [];
  loadingIndicator: any;

  constructor(
    private intelService: IntelService,
    private fieldService: FieldService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingController
  ) {
    this.caseSubscription = this.intelService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchBenSecData();
    });
  }

  doRefresh(event: any) {
    this.fetchBenSecData(event);
  }

  onSearchKeyUp() {
    this.searchSubject.next();
  }

  filtersSelected() {
    console.log('log');
  }

  clearSearch() {
    this.searchFilter = '';
    this.filterItems();
  }

  filterItems() {
    if (this.searchFilter && this.searchFilter.length > 1) {
      this.filteredItems = this.fetchedItems.filter((item) => {
        if (item.handle.toLowerCase().includes(this.searchFilter.toLowerCase())
        || (item.tags && item.tags.toLowerCase().includes(this.searchFilter.toLowerCase()))) {
          return item;
        }
      });
    } else {
      this.filteredItems = this.fetchedItems;
    }
  }

  async fetchBenSecData(event?: any) {
    // helper var
    // const requiredResponses = 1;
    // let completedResponse = 0;
    let allItems = [];

    // Fetch cases
    this.intelService.listCases().subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        const items = results.map((item) => {
          return {
            id: item.id,
            handle: item.rsi_handle,
            avatar: item.rsi_avatar_link,
            type: 'case',
            createdAt: item.created_at,
            activeWarrantCount: item.warrants?.filter(x => !x.closed).length,
            warrantCount: item.warrants?.length,
            reportCount: item.incident_reports?.length,
            tags: item.tags,
            pendingCount: item.pending_incident_report_count
          } as BenSecListItem;
        });
        allItems = allItems.concat(items);

        // TEMP
        // add them to the class object
        this.fetchedItems = allItems;

        console.log(this.fetchedItems);

        // filter items
        this.filterItems(); // filter it

        // dimiss ticker
        await this.loadingIndicator.dismiss();
        // if an event was passed, complete it
        if (event) {
          event.target.complete();
        }
        // mark the data as loaded
        this.initialDataLoaded = true;
      }
    });
  }

  openItem(item: BenSecListItem) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      // state: {
      //   item
      // }
    };

    // ${item.type}-
    this.router.navigate([`${item.id.split('-')[0]}`], navigationExtras);
  }

  async createIntelCase() {
    const modal = await this.modalController.create({
      component: AddUpdateIntelReportComponent
    });
    await modal.present();
  }

  getDescriptors() {
    this.fieldService.getField('8b9a2eeb-bcf3-4113-9e47-1e1868319917').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.filterDescriptors = results;
        console.log(results);

        if (this.selectedFilters.length === 0) {
          this.selectedFilters = results; // Object.assign({}, results);
        }
      }
    });
  }

  async ngOnInit() {
    this.isReader = await this.authService.hasClaim(53);
    this.isWriter = await this.authService.hasClaim(54);

    if (!this.isReader) {
      this.router.navigateByUrl('/dashboard');
      await Toast.show({
        text: 'You are not authorized to view this page!'
      });
      return;
    }

    // show the ticker
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    // setup the filter debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(800)
    ).subscribe(() => {
      this.filterItems();
    });

    // get required descriptors
    this.getDescriptors();

    // get data
    this.fetchBenSecData();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.caseSubscription) {
      this.caseSubscription.unsubscribe();
    }
  }

}

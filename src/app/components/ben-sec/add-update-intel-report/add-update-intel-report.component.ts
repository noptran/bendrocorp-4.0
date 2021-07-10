import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IntelligenceCase } from 'src/app/models/intel.model';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { BendroSafeService } from 'src/app/services/bendro-safe.service';
import { FieldService } from 'src/app/services/field.service';
import { IntelService } from 'src/app/services/intel-service.service';

@Component({
  selector: 'app-add-update-intel-report',
  templateUrl: './add-update-intel-report.component.html',
  styleUrls: ['./add-update-intel-report.component.scss'],
})
export class AddUpdateIntelReportComponent implements OnInit, OnDestroy {
  @Input() passedHandle: string;
  searchResult: BendroSafeSearchResult;
  intelligenceCase: IntelligenceCase;
  formAction: string;
  tickerAction: string;
  dataSubmitting = false;
  searchComplete = false;
  searchInvalid = false;
  caseExists = false;

  loadingIndicator: any;

  /**
   * The actual search filter
   */
   searchFilter: string;
   private searchSubject: Subject<string> = new Subject();
   searchSubscription: Subscription;

  constructor(
    private modalController: ModalController,
    private fieldService: FieldService,
    private intelService: IntelService,
    private loading: LoadingController,
    private router: Router,
    private bendroSafe: BendroSafeService,
  ) { }

  onSearchKeyUp() {
    this.searchSubject.next();
  }

  openExistingCase() {
    if (this.searchResult && this.searchResult.intel_data.case_id) {
      this.router.navigateByUrl(`/ben-sec/case-${this.searchResult.intel_data.case_id.split('-')[0]}`);
      this.dismiss();
    }
  }

  async addUpdateIntelCase() {
    // show the ticker
    this.loadingIndicator = await this.loading.create({
      message: this.tickerAction
    });
    await this.loadingIndicator.present();

    // if we are updating an old one
    if (this.intelligenceCase.id) {
      this.intelService.updateCase(this.intelligenceCase).subscribe(async (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          this.intelService.refreshData();
          this.dismiss();
        }
        await this.loading.dismiss();
      });
    } else { // if we are creating a new one
      this.intelService.createCase(this.intelligenceCase).subscribe(async (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          this.intelService.refreshData();
          this.dismiss();
          this.router.navigateByUrl(`/ben-sec/${result.id.split('-')[0]}`);
        }
        await this.loading.dismiss();
      });
    }
  }

  async goSearch(event?: any) {
    console.log(event);

    this.searchComplete = false;
    this.caseExists = false;
    this.searchInvalid = true;

    if (this.intelligenceCase.rsi_handle) {
      // show the ticker
      this.loadingIndicator = await this.loading.create({
        message: 'Searching'
      });
      await this.loadingIndicator.present();

      //
      this.bendroSafe.search(this.intelligenceCase.rsi_handle).subscribe(async (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          console.log(result);
          this.searchResult = result;
          this.searchInvalid = (result.rsi_data.rsi_code === 200) ? false : true;
          this.caseExists = result.intel_data.case_exists;
        } else {
          this.searchResult = null;
          this.searchInvalid = true;
          this.caseExists = false;
        }
        await this.loadingIndicator.dismiss();

        this.searchComplete = true;
      });
    }
  }

  /**
   * Check to make sure that the form is valid
   * @returns Boolean
   */
  formValid(): boolean {
    if (this.intelligenceCase
      && (this.intelligenceCase.rsi_handle && this.intelligenceCase.rsi_handle.length > 0)
      && (this.intelligenceCase.case_summary && this.intelligenceCase.case_summary.length > 0)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    // setup the filter debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(1000)
    ).subscribe(() => {
      this.searchComplete = false;
      this.goSearch();
    });

    if (this.intelligenceCase) {
      this.formAction = 'Update';
      this.tickerAction = 'Updating';
    } else {
      this.formAction = 'Create';
      this.tickerAction = 'Creating';
      this.intelligenceCase = { rsi_handle: this.passedHandle } as IntelligenceCase;

      if (this.intelligenceCase.rsi_handle) {
        this.goSearch();
      }
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

}

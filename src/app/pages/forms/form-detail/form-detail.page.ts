import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { Field, FieldDescriptor } from 'src/app/models/field.model';
import { Report, ReportRoute, ReportField } from 'src/app/models/report.model';
import { FieldService } from 'src/app/services/field.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ReportService } from 'src/app/services/report.service';

// cap plugins
import { Plugins } from '@capacitor/core';
import { UserService } from 'src/app/services/user.service';
const { Toast, Modals } = Plugins;

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.page.html',
  styleUrls: ['./form-detail.page.scss'],
})
export class FormDetailPage implements OnInit, OnDestroy {
  // control states - draft, view

  // variable
  /**
   * The report id as retrieved from the URI
   */
  reportId: string;
  /**
   * The report object either passed to the object or loaded from @see reportId
   */
  report: Report;

  // other stuff
  publishDraft: boolean;
  approverList: ReportRoute[];
  fields: Field[];
  dataSubmissionInProgress: boolean;
  updateSubmissionInProgress: boolean;
  reportFieldUpdate = new Subject<string>();
  fieldUpdateSubscription: Subscription;

  // rights
  canEdit: boolean;
  canView: boolean;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private profileService: ProfileService,
    private fieldService: FieldService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.reportFieldUpdate.pipe(
      debounceTime(600),
      distinctUntilChanged())
      .subscribe(() => {
        this.updateValues();
      });
  }

  async fetchReport() {
    return new Promise<void>((resolve, reject) => {
      if (this.reportId) {
        this.reportService.showReport(this.reportId).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.report = results;
            // const report = results.find(x => x.id === this.reportId);

            // if (report) {
            //   if (this.canView) {
            //     this.report = report;
            //     this.publishDraft = !this.report.draft;
            //     // console.log(this.report);
            //     // console.log(this.publishDraft);

            //     if (!this.publishDraft) {
            //       this.fetchFields();
            //       this.fetchRoutes();
            //     }
            //   }
            // }
            // resolve h
            resolve();
          } else {
            console.log(results);
            reject();
          }
        });
      }
    });
  }

  fetchRoutes() {
    this.reportService.listReportRoutes().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.approverList = results;
      }
    });
  }

  fetchFields() {
    this.fieldService.listFields().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.fields = results;
      }
    });
  }

  findFieldDescriptorValue(field): FieldDescriptor {
    if (field.field_value.value) {
      return this.getFieldDescriptors(field).find(x => x.id === field.field_value.value);
    }
  }

  getFieldDescriptors(field: ReportField): FieldDescriptor[] {
    // console.log(field);
    // console.log(field.field_id);

    if (field && this.fields && this.fields.length > 0) {
      const foundField = this.fields.find(x => x.id === field.field_id);
      if (foundField) {
        return foundField.descriptors;
      }
    }
    // return null;
  }

  getSingleDescriptorValue(field: Field, descriptor_id: string) {
    const descs = this.getFieldDescriptors(field);
    if (descs) {
      const val = descs.find(x => x.id === descriptor_id);
      if (val) {
        return val.title;
      }
    }
  }

  selectableChange(event: any, field: ReportField) {
    field.field_value.value = event.value.id;
    this.updateValues();
    console.log(field.field_value.value);
  }

  updateValues() {
    if (this.report && this.report.draft) {
      this.updateSubmissionInProgress = true;
      const updateRequests = [];

      // update the report itself
      updateRequests.push(this.reportService.updateReport(this.report));

      // loop though all of the fields and create the update requests
      for (let index = 0; index < this.report.fields.length; index++) {
        if (this.report.fields[index].field_value && this.report.fields[index].field_value.id) {
          updateRequests.push(this.reportService.updateFieldValue(this.report.fields[index].field_value));
        }
      }

      const doUpdateRequests = concat.apply(this, updateRequests); // .subscribe(val => console.log(val));
      let updated = 0;
      const subscribe = doUpdateRequests.subscribe(val => {
        updated += 1;
        if (updated === updateRequests.length) {
          // Toast.show({
          //   text: 'Report updated!'
          // });
          this.updateSubmissionInProgress = false;
        }
      });
    }
  }

  async publishReport() {
    const { value } = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to submit this report for approval?'
    });

    // negative confirmation value guard
    if (!value) {
      return;
    }

    if (this.report && this.report.id) {
      this.dataSubmissionInProgress = true;

      // mark the report as no longer being a draft
      this.report.draft = false;

      // send the request
      this.reportService.updateReport(this.report).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          Toast.show({
            text: 'Report submitted!'
          });
          // refresh the current users approvals. This is a low but valid use case :)
          this.userService.refreshData();
          this.fetchReport();
        } else {
          this.report.draft = true;
        }
        this.dataSubmissionInProgress = false;
      });
    }
  }

  formValid() {
    if (this.report && this.report.id) {
      if (!this.report.report_for_id && !this.report.handler.for_class) {
        return false;
      }

      for (let index = 0; index < this.report.fields.length; index++) {
        const field = this.report.fields[index];
        if (field.required) {
          if (!field.field_value || !field.field_value.value || field.field_value.value.toString().length <= 0) {
            return false;
          }
        }

        if (field.validator && field.validator.toString().length > 0) {
          const re = new RegExp(field.validator);
          if (!re.test(field.field_value.value)) {
            return false;
          }
        }
      }

      return true;
    }
  }

  async archiveReport() {
    const { value } = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to archive this report?'
    });

    if (value) {
      this.reportService.archiveReport(this.report).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          Toast.show({
            text: 'Report archived!'
          });
          this.reportService.refreshReportsData();
          this.router.navigateByUrl('/forms');
        }
      });
    }
  }

  async ngOnInit() {
    // get the report is from the uri
    this.reportId = this.route.snapshot.paramMap.get('id');

    // get the report data
    if (this.router.getCurrentNavigation().extras.state) {
      this.report = this.router.getCurrentNavigation().extras.state.report;
    } else {
      // load based on the id
      await this.fetchReport();
    }

    // check to make sure the report exists
    if (!this.report) {
      this.exit();
    }

    // log the report
    console.log(this.report);

    // can a user edit the report
    // did they write it or are they an admin?
    this.canEdit = (await this.authService.retrieveUserSession()).id === this.report.user_id
    || await this.authService.hasClaim(49);

    // can the user view this report
    // did they write it, are they an admin or is the report for them?
    this.canView = (await this.authService.retrieveUserSession()).id === this.report.user_id
    || this.report.report_for.for_user_id === (await this.authService.retrieveUserSession()).id
    || await this.authService.hasClaim(this.report.report_for.for_role_id);

    if (this.canEdit || this.canView) {
      this.fetchFields();
    } else {
      // if we here something went wrong
      this.exit();
    }
  }

  exit() {
    Toast.show({
      text: 'Report not found or you do not have access to view this report!'
    });
    this.router.navigateByUrl('/forms');
  }

  ngOnDestroy() {
    if (this.fieldUpdateSubscription) {
      this.fieldUpdateSubscription.unsubscribe();
    }
  }

}

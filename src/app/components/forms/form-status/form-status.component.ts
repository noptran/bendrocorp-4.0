import { Component, Input, OnInit } from '@angular/core';
import { Report } from 'src/app/models/report.model';

@Component({
  selector: 'app-form-status',
  templateUrl: './form-status.component.html',
  styleUrls: ['./form-status.component.scss'],
})
export class FormStatusComponent implements OnInit {
  @Input() report: Report;
  reportStatus: string;

  constructor() { }

  reportStatusCheck(): string {
    if (!this.report.approval && this.report.draft) { // draft
      return 'draft';
    } else if (!this.report.draft && (!this.report.approval.approved && !this.report.approval.denied)) { // submitted
      return 'submitted';
    } else if (!this.report.draft && this.report.approval.approved) { // approved
      return 'approved';
    } else if (this.report.draft && this.report.approval.denied) { // returned
      return 'returned';
    }
  }

  ngOnInit() {
  }

}

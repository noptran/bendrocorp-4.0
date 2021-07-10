import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IncidentReport } from 'src/app/models/intel.model';
import { IncidentService } from 'src/app/services/incident-service.service';

@Component({
  selector: 'app-incident-report-list-item',
  templateUrl: './incident-report-list-item.component.html',
  styleUrls: ['./incident-report-list-item.component.scss'],
})
export class IncidentReportListItemComponent implements OnInit {
  @Input() incidentReport: IncidentReport;
  incidentUri: string;
  itemColor = 'medium';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  openIncidentReport() {
    const navigationExtras: NavigationExtras = {
      // relativeTo: this.route,
      state: {
        incidentReport: this.incidentReport
      }
    };

    // do the nav
    this.router.navigateByUrl(this.incidentUri, navigationExtras);
  }

  ngOnInit() {
    console.log(this.incidentReport);

    // determine go back link
    if (window.location.pathname.includes('ben-sec')) {
      this.incidentUri = `/ben-sec/${this.incidentReport.intelligence_case_id.split('-')[0]}/incidents/${this.incidentReport.id.split('-')[0]}`;
    } else {
      this.incidentUri = `/bendro-safe/${this.incidentReport.id.split('-')[0]}`;
    }

    // determine color to show

    if (this.incidentReport.approval_status_id === 'f4619ce3-2d7e-41cd-9286-7f889e8f17b6') { // approved
      this.itemColor = 'success';
    } else if (this.incidentReport.approval_status_id === 'd9bbda83-e290-4b0c-88ff-1e15ab674640') { // declined
      this.itemColor = 'danger';
    } else {
      this.itemColor = 'medium';
    }
  }

}

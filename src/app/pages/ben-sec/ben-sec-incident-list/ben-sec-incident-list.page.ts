import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IncidentReport } from 'src/app/models/intel.model';
import { IncidentService } from 'src/app/services/incident-service.service';
import { IntelService } from 'src/app/services/intel-service.service';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-ben-sec-incident-list',
  templateUrl: './ben-sec-incident-list.page.html',
  styleUrls: ['./ben-sec-incident-list.page.scss'],
})
export class BenSecIncidentListPage implements OnInit {
  parentCaseId: string;
  incidentReports: IncidentReport[] = [];

  loadingIndicator: any;

  initialDataLoaded = false;

  // constructors
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private intelService: IntelService,
    private loading: LoadingController
  ) { }

  loadIncidentList() {
    if (this.parentCaseId) {
      // go look up the data
      this.intelService.fetchCase(this.parentCaseId).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.incidentReports = results.incident_reports;
          this.loadingIndicator.dismiss();
          this.initialDataLoaded = true;
        } else {
          await Toast.show({
            text: 'Error Occured: Could not load list of infraction!'
          });
          this.router.navigateByUrl('/ben-sec');
        }
      });
    }
  }

  async ngOnInit() {
    // get the parent id from the route
    this.parentCaseId = this.route.snapshot.paramMap.get('case_id');

    // see if we got passed data
    if (this.router.getCurrentNavigation().extras.state) {
      console.log('Loading route info');
      this.incidentReports = this.router.getCurrentNavigation().extras.state.incidentReports;
      console.log('passed incident report data');
      console.log(this.incidentReports);
      this.initialDataLoaded = true;
    } else {
      // create the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();

      this.loadIncidentList();
    }
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { AddUpdateIncidentReportComponent } from '../../ben-sec/add-update-incident-report/add-update-incident-report.component';
import { AddUpdateIntelReportComponent } from '../../ben-sec/add-update-intel-report/add-update-intel-report.component';
import { AddUpdateOffenderReportComponent } from '../../offender-reports/add-update-offender-report/add-update-offender-report.component';

@Component({
  selector: 'app-bendro-safe-search-result',
  templateUrl: './bendro-safe-search-result.component.html',
  styleUrls: ['./bendro-safe-search-result.component.scss'],
})
export class BendroSafeSearchResultComponent implements OnInit {
  isIntelWriter: boolean;
  @Input() searchResult: BendroSafeSearchResult;
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
  ) { }

  dismiss() {
    this.modalController.dismiss();
    console.log('closed the thing');
  }

  async createIntelCase() {
    console.log('create case from search');
    this.dismiss();
    const modal = await this.modalController.create({
      component: AddUpdateIntelReportComponent,
      componentProps: {
        passedHandle: this.searchResult.rsi_data.handle
      }
    });
    await modal.present();
  }

  async createOffenderReport() {
    console.log('create incident from search');

    this.dismiss();
    const modal = await this.modalController.create({
      component: AddUpdateIncidentReportComponent,
      componentProps: {
        passedHandle: this.searchResult.rsi_data.handle
      }
    });
    await modal.present();
  }

  async ngOnInit() {
    this.isIntelWriter = await this.authService.hasClaim(54);
  }

}

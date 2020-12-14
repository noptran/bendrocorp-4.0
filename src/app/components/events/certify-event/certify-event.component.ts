import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { EventAttendence, AttendenceType, Event } from '../../../models/event.model';

const { Toast } = Plugins;
const { Modals } = Plugins;


@Component({
  selector: 'app-certify-event',
  templateUrl: './certify-event.component.html',
  styleUrls: ['./certify-event.component.scss'],
})
export class CertifyEventComponent implements OnInit {

  event: Event;
  attendences: EventAttendence[];
  attendenceTypes: AttendenceType[];
  debriefingText: string;
  initialDataLoaded: boolean = false;
  attendenceSubmitting: boolean = false;
  certificationPassed: boolean = false;
  loadingIndicator: any;

  constructor(
    private modalController: ModalController,
    private eventService: EventService,
    private loading: LoadingController) { }

  async submitForCertification() {
    const returnConfirm = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to submit the attendance this event?'
    });

    if (returnConfirm.value) {
      if (this.event) {
        this.attendenceSubmitting = true;
        this.eventService.certification(this.event.id, this.attendences, this.debriefingText).subscribe(
          (results) =>
          {
            this.attendenceSubmitting = false;
            if (!(results instanceof HttpErrorResponse)) {
              this.eventService.refreshData();
              this.certificationPassed = true;
              this.dismiss();
            }
          }
        );
      }
    }
  }

  async fetchAttendences()
  {
    if (this.event && this.event.id) {
      this.eventService.startCertification(this.event).subscribe(
        async (results) =>
        {
          if (!(results instanceof HttpErrorResponse)) {
            this.attendences = results.sort((a,b) => {
              return ('' + a.character.full_name).localeCompare(b.character.full_name);
            })
            this.initialDataLoaded = true;
            await this.loading.dismiss();
          }
        }
      )
    } else {
      console.error('Event not passed!');
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async ngOnInit() {
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.eventService.list_attendence_types().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.attendenceTypes = results
          this.fetchAttendences();
        }
      }
    )
  }

}

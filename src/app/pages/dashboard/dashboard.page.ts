import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { LoadingService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(
    private eventService: EventService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    // this.loadingService.show();
  }

}

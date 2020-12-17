import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ILNewsStory } from 'src/app/models/news.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
})
export class NewsDetailComponent implements OnInit {
  newsItem: ILNewsStory;
  constructor(
    private modalController: ModalController
  ) { }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  ngOnInit() {
  }
}

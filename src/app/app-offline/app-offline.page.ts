import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-offline',
  templateUrl: './app-offline.page.html',
  styleUrls: ['./app-offline.page.scss'],
})
export class AppOfflinePage implements OnInit {

  constructor(
    private router: Router
  ) { }

  retry() {
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
  }

}

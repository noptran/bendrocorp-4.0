import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserSessionResponse } from './models/user.model';
import { MenuItem } from './models/misc.model';
import { MenuService } from './menu.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [] as MenuItem[];
  /*
  public appPages = [
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'star'
    },
    {
      title: 'Outbox',
      url: '/folder/Outbox',
      icon: 'paper-plane'
    },
    {
      title: 'Favorites',
      url: '/folder/Favorites',
      icon: 'heart'
    },
    {
      title: 'Archived',
      url: '/folder/Archived',
      icon: 'archive'
    },
    {
      title: 'Trash',
      url: '/folder/Trash',
      icon: 'trash'
    },
    {
      title: 'Spam',
      url: '/folder/Spam',
      icon: 'warning'
    }
  ];*/
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  isAuthorized: boolean;
  authorizationSubscription: Subscription;
  user: UserSessionResponse;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.authorizationSubscription = this.authService.AuthUpdateAnnounced$.subscribe(async (result) => {
        this.isAuthorized = await this.authService.isAuthorized();
      });

      this.isAuthorized = (await this.authService.checkAndRefreshAccessToken()) != null;
      if (!this.isAuthorized) {
        this.router.navigateByUrl('/auth');
      } else {
        this.user = await this.authService.retrieveUserSession();
        this.appPages = (await this.menuService.list()).filter(x => x.nested_under_id == null).sort((a, b) => a.ordinal - b.ordinal);
      }

      const path = window.location.pathname.split('/')[1];
      if (path !== undefined) {
        this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      } else {
        this.selectedIndex = 0;
      }

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    throw new Error('Method not implemented.');
  }
}

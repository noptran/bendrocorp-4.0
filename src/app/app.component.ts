import { Component, OnDestroy, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserSessionResponse } from './models/user.model';
import { MenuItem } from './models/misc.model';
import { MenuService } from './menu.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConnectionService } from 'ng-connection-service';
import { ProfileService } from './services/profile.service';
import { SettingsComponent } from './components/settings/settings.component';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [] as MenuItem[];

  isAuthorized: boolean;
  authorizationSubscription: Subscription;
  navigationSubscription: Subscription;
  connectionSubscription: Subscription;
  profileSubscription: Subscription;
  user: UserSessionResponse;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private menuService: MenuService,
    private connection: ConnectionService,
    private profileService: ProfileService,
    private router: Router,
    private modalController: ModalController,
    private settings: SettingsService
  ) {
    this.initializeApp();

    // this.authorizationSubscription = this.authService.AuthUpdateAnnounced$.subscribe((action) => {
    //   if (action === 'LOGOUT') {
    //     this.router.navigateByUrl('/auth')
    //   }
    // });
  }

  getAvatar(): string {
    if (this.user) {
      return this.user.avatar;
    }
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // intialize settings
      await this.settings.intializeConfig();

      // create auth subscriber
      this.authorizationSubscription = this.authService.AuthUpdateAnnounced$.subscribe(async (result) => {
        this.isAuthorized = await this.authService.isAuthorized();
      });

      // profile subscriber
      this.profileSubscription = this.profileService.dataRefreshAnnounced$.subscribe(async () => {
        await this.authService.checkAndRefreshAccessToken(true);
        this.user = await this.authService.retrieveUserSession();
      });

      this.isAuthorized = (await this.authService.checkAndRefreshAccessToken()) != null;
      if (!this.isAuthorized) {
        this.router.navigateByUrl('/auth');
      } else {
        this.user = await this.authService.retrieveUserSession();
        this.appPages = (await this.menuService.list()).filter(x => x.nested_under_id == null).sort((a, b) => a.ordinal - b.ordinal);
      }

      // get the initial menu selection
      this.selectMenuItem();

      this.navigationSubscription = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.selectMenuItem();
        }
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private selectMenuItem() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    } else {
      this.selectedIndex = 0;
    }
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
    });
    return await modal.present();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.authorizationSubscription) {
      this.authorizationSubscription.unsubscribe();
    }

    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }
}

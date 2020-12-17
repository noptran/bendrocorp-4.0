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
import { UserService } from './services/user.service';
import { CheckUpdateService } from './services/sw/check-update.service';
import { LogUpdateService } from './services/sw/log-update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [] as MenuItem[];
  pendingApprovalCount: number;

  isAuthorized: boolean;
  authorizationSubscription: Subscription;
  navigationSubscription: Subscription;
  connectionSubscription: Subscription;
  profileSubscription: Subscription;
  userServiceSubscription: Subscription;

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
    private settings: SettingsService,
    private userService: UserService,

    // sw stuff
    private checkUpdate: CheckUpdateService,
    private logUpdate: LogUpdateService
  ) {
    this.initializeApp();

    // this.authorizationSubscription = this.authService.AuthUpdateAnnounced$.subscribe((action) => {
    //   if (action === 'LOGOUT') {
    //     this.router.navigateByUrl('/auth')
    //   }
    // });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // intialize settings
      await this.settings.intializeConfig();

      // create user sub
      this.userServiceSubscription = this.userService.approvalsDataRefreshAnnounced$.subscribe(() => {

      });

      // create auth subscriber
      this.authorizationSubscription = this.authService.AuthUpdateAnnounced$.subscribe(async (result) => {
        this.isAuthorized = await this.authService.isAuthorized();
        await this.fetchUser();
        await this.fetchMenu();
      });

      // profile subscriber
      this.profileSubscription = this.profileService.dataRefreshAnnounced$.subscribe(async () => {
        await this.authService.checkAndRefreshAccessToken(true);
        await this.fetchUser();
      });

      this.isAuthorized = (await this.authService.checkAndRefreshAccessToken()) != null;
      if (!this.isAuthorized) {
        this.router.navigateByUrl('/auth');
      } else {
        await this.fetchUser();
        await this.fetchMenu();
      }

      // get the initial menu selection
      this.selectMenuItem();
      this.fetchApprovals();

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
      this.selectedIndex = this.appPages.findIndex(page => page.title.replace(' ', '-').toLowerCase() === path.toLowerCase());
    } else {
      this.selectedIndex = 0;
    }
  }

  fetchApprovals() {
    this.userService.fetchPendingApprovalsCount().subscribe((results) => {
      this.pendingApprovalCount = results;
    });
  }

  async fetchUser() {
    this.user = await this.authService.retrieveUserSession();
  }

  openApprovals() {
    this.router.navigate(['approvals']);
  }

  getAvatar(): string {
    if (this.user) {
      return this.user.avatar;
    }
  }

  async fetchMenu() {
    this.appPages = (await this.menuService.list()).filter(x => x.nested_under_id == null).sort((a, b) => a.ordinal - b.ordinal);
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

    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
  }
}

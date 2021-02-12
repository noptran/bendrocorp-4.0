import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { UserSessionResponse } from './models/user.model';
import { MenuItem } from './models/misc.model';
import { MenuService } from './menu.service';
import { ConnectionService } from 'ng-connection-service';
import { ProfileService } from './services/profile.service';
import { SettingsComponent } from './components/settings/settings.component';
import { SettingsService } from './services/settings.service';
import { UserService } from './services/user.service';
import { CheckUpdateService } from './services/sw/check-update.service';
import { LogUpdateService } from './services/sw/log-update.service';
import { SwUpdate } from '@angular/service-worker';
import { PromptUpdateService } from './services/sw/prompt-update.service';
import { Plugins } from '@capacitor/core';
import { PushRegistarService } from './services/push-registar.service';
import { AlertService } from './services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
const { App, SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [] as MenuItem[];
  readonly copyrightYear = new Date().getFullYear();
  pendingApprovalCount: number;

  isAuthorized: boolean;
  authorizationSubscription: Subscription;
  navigationSubscription: Subscription;
  connectionSubscription: Subscription;
  profileSubscription: Subscription;
  userServiceSubscription: Subscription;
  updateSubscription: Subscription;
  alertSubscription: Subscription;

  user: UserSessionResponse;
  totalApprovalsCount = 0;

  alertCount = 0;

  // updates
  updateAvailable: boolean;
  // check every 60 seconds for menu updates
  // if roles change we want to capture menu changes
  menuInterval = interval(1000 * 60);
  menuUpdateSubscription: Subscription;

  isNativeiOS: boolean;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private menuService: MenuService,
    private connection: ConnectionService,
    private alertService: AlertService,
    private profileService: ProfileService,
    private router: Router,
    private modalController: ModalController,
    private settings: SettingsService,
    private userService: UserService,
    private push: PushRegistarService,

    // sw stuff
    private checkUpdate: CheckUpdateService,
    private logUpdate: LogUpdateService,

    // updates
    private promptUpdate: PromptUpdateService,
    private update: SwUpdate,

    // zone
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // deep links
    App.addListener('appUrlOpen', (data: any) => {
      this.zone.run(() => {
          const slug = data.url.split('.app').pop();
          if (slug) {
              this.router.navigateByUrl(slug);
          }
          // If no match, do nothing - let regular routing
          // logic take over
      });
    });

    // wait for the platform to be ready and all the basic setup to be done
    this.platform.ready().then(async () => {
      // intialize settings
      await this.settings.intializeSettingsConfig();

      // create user sub
      this.userServiceSubscription = this.userService.approvalsDataRefreshAnnounced$.subscribe(() => {
        this.fetchApprovals();
      });

      // update subscription
      this.updateSubscription = this.promptUpdate.updateAnnounced$.subscribe((result) => {
        if (result === 'UPDATE') {
          this.updateAvailable = true;
        }
      });

      // create auth subscriber
      this.authorizationSubscription = this.authService.AuthUpdateAnnounced$.subscribe(async (result) => {
        this.isAuthorized = await this.authService.isAuthorized();
        await this.fetchUser();
        await this.fetchMenu();
        await this.fetchApprovals();

        this.getAlertCount();

        // register for push notifications
        await this.push.initPushNotifications();
      });

      // profile subscriber
      this.profileSubscription = this.profileService.dataRefreshAnnounced$.subscribe(async () => {
        await this.authService.checkAndRefreshAccessToken(true);
        await this.fetchUser();
      });

      this.menuUpdateSubscription = this.menuInterval.subscribe(async () => {
        if (await this.authService.isAuthorized()) {
          this.fetchMenu();
          this.selectMenuItem();
          this.getAlertCount();
        }
      });

      this.alertSubscription = this.alertService.dataRefreshAnnounced$.subscribe(() => {
         this.getAlertCount();
      });

      // intial setting
      this.isAuthorized = await this.authService.isAuthorized();

      if (this.isAuthorized) {
        // register for push notifications
        await this.push.initPushNotifications();
      }

      if (this.isAuthorized) {
        await this.fetchUser();
        await this.fetchMenu();

        // get alerts count
        this.getAlertCount();

        // get the initial menu selection
        this.selectMenuItem();
        this.fetchApprovals();
      }

      this.navigationSubscription = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.selectMenuItem();
        }
      });

      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      SplashScreen.hide();
    });
  }

  private selectMenuItem() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined && path !== '') {
      this.selectedIndex = this.appPages.findIndex(page => page.title.replace(' ', '-').toLowerCase() === path.toLowerCase());
    } else {
      this.selectedIndex = 0;
      if (this.appPages && this.appPages.length > 0) {
        this.router.navigateByUrl(this.appPages[0].link);
      }
    }
  }

  doUpdate() {
    this.update.activateUpdate().then(() => document.location.reload());
  }

  async fetchApprovals() {
    // TODO: Promisify this...
    if (await this.authService.isAuthorized() && await this.authService.hasClaim(0)) {
      this.userService.fetchTotalApprovalCount().subscribe((results) => {
        this.totalApprovalsCount = results;
      });

      this.userService.fetchPendingApprovalsCount().subscribe((results) => {
        this.pendingApprovalCount = results;
      });
    }
  }

  async fetchUser() {
    this.user = await this.authService.retrieveUserSession();
  }

  openApprovals() {
    this.router.navigate(['approvals']);
  }

  getFullName() {
    if (this.user.first_name && this.user.last_name) {
      return `${this.user.first_name} ${this.user.last_name}`;
    } else {
      return this.user.name;
    }
  }

  getAvatar(): string {
    if (this.user) {
      return this.user.avatar;
    }
  }

  getAlertCount() {
    this.alertService.list().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.alertCount = results.length;
      }
    });
  }

  async fetchMenu() {
    this.appPages = (await this.menuService.list()).filter(x => x.nested_under_id == null).sort((a, b) => a.ordinal - b.ordinal);

    if (this.isNativeiOS) {
      this.appPages = this.appPages.filter(x => !x.skip_ios);
    }
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
    });
    return await modal.present();
  }

  ngOnInit() {
    this.isNativeiOS = this.platform.is('capacitor') && this.platform.is('ios');
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

    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }

    if (this.menuUpdateSubscription) {
      this.menuUpdateSubscription.unsubscribe();
    }

    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }
}

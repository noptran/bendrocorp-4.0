import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { Push, PushOptions, PushObject } from '@ionic-native/push/ngx';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment.prod';
import { AppBadgeService } from './app-badge.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  LocalNotificationActionType,
  LocalNotificationAction,
} from '@capacitor/core';
import { PushTokenReg } from '../models/push-token-reg.model';
import { pushTokenStorageKey } from 'constants';
import { AuthService } from '../auth.service';
import { debugRole } from 'constants';
import { RequestsService } from './requests.service';
import { Router } from '@angular/router';

const { PushNotifications, LocalNotifications, Storage, Device, Toast, Modals } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PushRegistarService {
  private deviceTypeId: 1|2;
  private pushDebug: boolean;

  constructor(
    private router: Router,
    private platform: Platform,
    // private push: Push,
    private userService: UserService,
    private requestService: RequestsService,
    private appBadgeService: AppBadgeService,
    private authService: AuthService) {
    }

  async registerPushActionTypes() {
    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      // const yoyoSelfTestAction: LocalNotificationAction = {
      //   id: 'FUNNY_BUNNY',
      //   title: 'Funny Bunny 🐰',
      //   foreground: true
      // };

      const selfTestActionType: LocalNotificationActionType = {
        id: 'SELF_TEST',
        actions: [
          {
            id: 'FUNNY_BUNNY',
            title: 'Funny Bunny 🐰',
            foreground: true
          } as LocalNotificationAction
        ]
      };

      const alertNoticeActionType: LocalNotificationActionType = {
        id: 'ALERT_NOTICE',
        actions: [
          {
            id: 'VIEW_ALERT',
            title: 'View Alert',
            foreground: true
          }
        ]
      };

      const profileNoticeActionType: LocalNotificationActionType = {
        id: 'PROFILE_NOTICE',
        actions: [
          {
            id: 'VIEW_PROFILE',
            title: 'View Profile',
            foreground: true
          }
        ]
      };

      const calendarActionType: LocalNotificationActionType = {
        id: 'CALENDAR_EVENT',
        actions: [
          {
            id: 'VIEW_EVENT',
            title: 'View Event',
            foreground: true
          }
        ]
      };

      const newsPostedActionType: LocalNotificationActionType = {
        id: 'NEWS_POSTED',
        actions: [
          {
            id: 'VIEW_ARTICLE',
            title: 'View Article',
            foreground: true
          }
        ]
      };

      const approvalChangeActionType: LocalNotificationActionType = {
        id: 'APPROVAL_CHANGE',
        actions: [
          {
            id: 'VIEW_APPROVAL',
            title: 'View Approval',
            foreground: true
          }
        ]
      };

      // for new approvals where the user needs to take some kind of action
      const approvalActionType: LocalNotificationActionType = {
        id: 'APPROVAL',
        actions: [
          {
            id: 'VIEW_APPROVAL',
            title: 'View Approval',
            foreground: true
          },
          {
            id: 'APPROVE_APPROVAL',
            title: 'Approve'
          },
          {
            id: 'DENY_APPROVAL',
            title: 'Deny',
            destructive: true
          }
        ]
      };

      const viewApplicationActionType: LocalNotificationActionType = {
        id: 'VIEW_APPLICATION',
        actions: [
          {
            id: 'PROFILE_360',
            title: 'View Application',
            foreground: true
          }
        ]
      };

      // register all of the actions
      await LocalNotifications.registerActionTypes({ types: [
        selfTestActionType,
        alertNoticeActionType,
        profileNoticeActionType,
        calendarActionType,
        newsPostedActionType,
        approvalChangeActionType,
        approvalActionType,
        viewApplicationActionType
      ]});
    } // end is cap
  }

  /**
   * Attempt to initialize push notifications on devices which are supported by the BendroCorp service.
   */
  async initPushNotifications() {
    // register the types of actions we can do
    // await this.registerPushActionTypesAndListeners();

    // see if the user is in the push debug role
    this.pushDebug = await this.authService.hasClaim(debugRole);

    if (this.platform.is('capacitor') || this.platform.is('cordova')) {

      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermission().then(result => {
        if (result.granted) {
          if (this.pushDebug) {
            Toast.show({
              text: 'Push notifcation rights granted. Registering.'
            });
          }
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
          if (this.pushDebug) {
            Toast.show({
              text: 'Push notification rights not granted'
            });
          }
          console.warn('Push notification registration failed!');
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        async (token: PushNotificationToken) => {
          if (this.pushDebug) {
            Toast.show({
              text: 'Push registration success, token: ' + token.value
            });
          }

          // if we have already set a push notification token then skip pushing to the API
          if (((await Storage.get({ key: pushTokenStorageKey }))?.value)) {
            if (this.pushDebug) {
              Toast.show({
                text: 'Push key already found not pushing'
              });
            }
            return;
          }

          // ios fix, does not apply to Android or others
          const tokenValue = (token.value as string).replace('<', '').replace('>', '');

          // determine the platform of the device so we can tell the API what its looking for
          if (this.platform.is('ios')) {
            this.deviceTypeId = 1;
          } else if (this.platform.is('android')) {
            this.deviceTypeId = 2;
          } else {
            console.warn('Unsupported push notification platform');
            return;
          }

          const { uuid } = await Device.getInfo();

          const tokenReg: PushTokenReg = {
            token: tokenValue,
            user_device_type_id: this.deviceTypeId,
            device_uuid: uuid
          };

          // send the token to the API for registration
          this.userService.registerForPushNotifications(tokenReg).subscribe(async (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              // store the token
              await Storage.set({ key: pushTokenStorageKey, value: tokenValue });
              console.log(`Push token ${tokenValue} registered on the BendroCorp API for this device.`);

              // debug output
              if (this.pushDebug) {
                Toast.show({
                  text: 'Token registered!'
                });
              }
            } else {
              // remove the stored token since things failed
              await Storage.remove({ key: pushTokenStorageKey });
              if (this.pushDebug) {
                Toast.show({
                  text: `Token could not be registered with the BendroCorp API because: ${results.error.message}`
                });
              }
            }
          });
        }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        async (error: any) => {
          Modals.alert({
            title: 'Error',
            message: 'Error on push registration: ' + JSON.stringify(error)
          });

          await Storage.remove({ key: pushTokenStorageKey });
        }
      );



      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          // alert('Push received: ' + JSON.stringify(notification));
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          // alert('Push action performed: ' + JSON.stringify(notification));
          // notification.actionId
          // notification.notification.data.variable_here
          console.log(notification.actionId);

          if (this.pushDebug) {
            Toast.show({
              text: 'pushNotificationActionPerformed fired',
              duration: 'long'
            });
          }

          // debug
          if (this.pushDebug) {
            Toast.show({
              text: notification.actionId + ' ' + notification.notification.click_action
            });
          }

          // handle action
          const data = notification.notification.data;
          switch (notification.actionId) {
            case 'FUNNY_BUNNY':
              this.router.navigateByUrl(`/profiles/${data.profile_id}`);
              break;
            case 'VIEW_ALERT':
              this.router.navigateByUrl(`/alerts/${data.alert_id}`);
              break;
            case 'VIEW_PROFILE':
              this.router.navigateByUrl(`/profiles/${data.profile_id}`);
              break;
            case 'VIEW_EVENT':
              this.router.navigateByUrl(`/profiles/${data.event_id}`);
              break;
            case 'VIEW_ARTICLE':
              this.router.navigateByUrl(`/news/${data.article_id}`);
              break;
            case 'VIEW_APPROVAL':
              this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
              break;
            case 'APPROVE_APPROVAL':
              // 4
              this.requestService.fetch_approval(data.approver_id).subscribe((results) => {
                if (!(results instanceof HttpErrorResponse)) {
                  this.requestService.submit_approval(results.approval_id, 4).subscribe((iResults) => {
                    if (!(results instanceof HttpErrorResponse)) {
                      this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
                    } else {
                      this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
                    }
                  });
                } else {
                  this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
                }
              });
              break;
            case 'DENY_APPROVAL':
              // 5
              this.requestService.fetch_approval(data.approver_id).subscribe((results) => {
                if (!(results instanceof HttpErrorResponse)) {
                  this.requestService.submit_approval(results.approval_id, 5).subscribe((iResults) => {
                    if (!(results instanceof HttpErrorResponse)) {
                      this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
                    } else {
                      this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
                    }
                  });
                } else {
                  this.router.navigateByUrl(`approvals/details/${data.approver_id}`);
                }
              });
              break;
            case 'PROFILE_360':
              this.router.navigateByUrl(`/profiles/${data.profile_id}/application`);
              break;
            default:
              return;
          }
        }
      );
    }
  }
}

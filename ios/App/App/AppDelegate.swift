import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?


  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    // add notification types
    // ALERT_NOTICE
//    let alertNoticeCategory =
//        UNNotificationCategory(identifier: "ALERT_NOTICE",
//        actions: [
//            UNNotificationAction(identifier: "VIEW_ALERT",
//            title: "View Alert",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // PROFILE_NOTICE
//    let profileNoticeCategory =
//        UNNotificationCategory(identifier: "PROFILE_NOTICE",
//        actions: [
//            UNNotificationAction(identifier: "VIEW_PROFILE",
//            title: "View Profile",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // CALENDAR_EVENT
//    let calendarEventCategory =
//        UNNotificationCategory(identifier: "CALENDAR_EVENT",
//        actions: [
//            UNNotificationAction(identifier: "VIEW_EVENT",
//            title: "View Event",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // SELF_TEST
//    let selfTestCategory =
//        UNNotificationCategory(identifier: "SELF_TEST",
//        actions: [
//            UNNotificationAction(identifier: "FUNNY_BUNNY",
//            title: "Funny Bunny 🐰",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // NEWS_POSTED
//    let newsPostedCategory =
//        UNNotificationCategory(identifier: "NEWS_POSTED",
//        actions: [
//            UNNotificationAction(identifier: "VIEW_ARTICLE",
//            title: "View Article",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // APPROVAL_CHANGE
//    let approvalChangeCategory =
//        UNNotificationCategory(identifier: "APPROVAL_CHANGE",
//        actions: [
//            UNNotificationAction(identifier: "VIEW_APPROVAL",
//            title: "View Approval",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // APPROVAL
//    let approvalCategory =
//        UNNotificationCategory(identifier: "APPROVAL",
//        actions: [
//            UNNotificationAction(identifier: "VIEW_APPROVAL",
//            title: "View Approval",
//            options: [.foreground]),
//            UNNotificationAction(identifier: "APPROVE_APPROVAL",
//            title: "Approve",
//            options: [.foreground]),
//            UNNotificationAction(identifier: "DENY_APPROVAL",
//            title: "Deny",
//            options: [.foreground, .destructive])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//        options: .customDismissAction)
//    // VIEW_APPLICATION
//    let viewApplicationCategory =
//        UNNotificationCategory(identifier: "VIEW_APPLICATION",
//        actions: [
//            UNNotificationAction(identifier: "PROFILE_360",
//            title: "View Application",
//            options: [.foreground])
//        ],
//        intentIdentifiers: [],
//        hiddenPreviewsBodyPlaceholder: "",
//    options: .customDismissAction)
    
    // add the notification categories to the app
//    let notificationCenter = UNUserNotificationCenter.current()
//    notificationCenter.setNotificationCategories([
//        alertNoticeCategory,
//        profileNoticeCategory,
//        calendarEventCategory,
//        selfTestCategory,
//        newsPostedCategory,
//        approvalChangeCategory,
//        approvalCategory,
//        viewApplicationCategory
//    ])
    
    // return
    return true
  }

  func applicationWillResignActive(_ application: UIApplication) {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  }

  func applicationWillTerminate(_ application: UIApplication) {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
  }

  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // Called when the app was launched with a url. Feel free to add additional processing here,
    // but if you want the App API to support tracking app url opens, make sure to keep this call
    return CAPBridge.handleOpenUrl(url, options)
  }
  
  func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    // Called when the app was launched with an activity, including Universal Links.
    // Feel free to add additional processing here, but if you want the App API to support
    // tracking app url opens, make sure to keep this call
    return CAPBridge.handleContinueActivity(userActivity, restorationHandler)
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    super.touchesBegan(touches, with: event)

    let statusBarRect = UIApplication.shared.statusBarFrame
    guard let touchPoint = event?.allTouches?.first?.location(in: self.window) else { return }

    if statusBarRect.contains(touchPoint) {
      NotificationCenter.default.post(CAPBridge.statusBarTappedNotification)
    }
  }

  #if USE_PUSH

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()), object: deviceToken)
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object: error)
  }

#endif

}


export enum NotificationEndpoints {
  //getAll
  Notification = `notification`,
  //get
  NotificationxProperty = `notification-x-property`,
  //put
  NotificationxPropertyPut = `notification-x-property/property`,
  //post
  ValidateGoodStatus = `validate-good-status`,
  //post
  NotifyRatification = `notify-ratification`,
  //post
  NotificationxPropertyFilter = `notification-x-property/filter`,
  //post calculo de días
  NotificationxPropertyFilterSort = `notification-x-property/filter?sortBy=notificationDate:ASC`,
  //get, post
  TmpNotification = `tmp-notification`,
  //get
  MaxFlyerNumber = `notification/max-flyer-number`,
  //last wheel number
  LastWheelNumber = `notification/last-wheel-number`,
  //dailyConsecutive
  DailyConsecutive = `daily-consecutive`,
  //find-notification-by-transferent-or-city
  FindTransferentCity = `notification/find-notification-by-transferent-or-city`,
  //find-count-by-inquiri
  FindCountByInquiry = `notification/find-count-by-inquiri`,
  //Last-Flyer-id
  LastFlyerId = `notification/last-flyer-identification`,

  NotificationxPropertyFilter2 = `notification-x-property/filter`,
}

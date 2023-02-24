export interface IJob {
  id: string;
  jobKey: string;
  shippingDate: Date;
  priority: string;
  status: string;
  jobsType: string;
  recordNumber?: any;
  knowledge?: any;
  text: string;
  userOrigin: string;
  registryNumber: string;
  folioNumber?: any;
  shippingDate2: Date;
  shippingWay?: any;
  steeringWheelNumber?: any;
  cityIssuesOfficeNumber?: any;
}

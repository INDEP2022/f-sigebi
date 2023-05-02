import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule-delivery',
  templateUrl: './schedule-delivery.component.html',
  styles: [],
})
export class ScheduleDeliveryComponent implements OnInit {
  showAssetsDetail: boolean = true;
  save: boolean = false;
  //detalle de la solicitud
  data: any;
  //lista de los bienes
  dataAssets: any = [];

  constructor() {}

  ngOnInit(): void {}

  finish(): void {}

  getAssetDta(event: any) {}

  getListAssetsData(event: any): void {}
}

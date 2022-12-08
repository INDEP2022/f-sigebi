import { Component, DoCheck, OnInit } from '@angular/core';

@Component({
  selector: 'app-prepare-requests',
  templateUrl: './prepare-requests.component.html',
  styleUrls: ['./prepare-requests.component.scss'],
})
export class PrepareRequestsComponent implements OnInit, DoCheck {
  showAssetsDetail: boolean = true;

  //datos para los detalle de bienes
  data: any;
  // dotos para la lista de bienes tab
  dataAssets: any;

  //finalizar proceso
  save: boolean = false;

  examplesRequestList: any;
  examplesListAssets: any;

  constructor() {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    if (this.save === true) {
      console.log(this.examplesRequestList);
      console.log(this.examplesListAssets);
    }
  }

  finish() {
    this.save = true;

    /*setTimeout(() => {
      console.log(this.examplesRequestList);

    },2000)*/
  }

  getAssetDta(event?: any) {
    console.log('datos del detalle de bienes');
    this.examplesRequestList = event;
  }

  getListAssetsData(event: any) {
    console.log('lista de bienes');
    this.examplesListAssets = event;
  }
}

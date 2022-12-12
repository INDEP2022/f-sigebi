import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictate-assets',
  templateUrl: './dictate-assets.component.html',
  styles: [],
})
export class DictateAssetsComponent implements OnInit {
  showAssetsDetail: boolean = true;

  //datos de los detalles de la solicitud
  data: any;
  //enviar guadar
  save: boolean = false;
  //datos de la lista de bienes
  dataAssets: any[] = [];

  constructor() {}

  ngOnInit(): void {}

  finish(): void {}

  getAssetDta(event: any): void {}

  getListAssetsData(event: any): void {}
}

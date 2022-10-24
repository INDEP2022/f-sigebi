import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_OF_ASSETS_COLUMNS } from '../classification-assets.columns';

var data = [
  {
    id: 1,
    noManagement: '8905184',
    assetsDescripTransfer: 'VEHICULO NISSAN, MODELO TSUMA',
    assetsDescripSAE: '',
    typeAsset: 'VEHICULO',
    fraction: '8703.24.01',
    quantityTransfer: '1',
    ligieUnitMeasure: 'PIEZA',
    transferUnitMeasure: 'PIEZA',
    uniqueKey: '1244',
    physicalState: 'NUEVO',
    conservationState: '',
    destinyLigie: 'VENTA',
    destinyTransfer: 'VENTA',
  },
  {
    id: 2,
    noManagement: '8751658',
    assetsDescripTransfer: 'VEHICULO TOYOTA, MODELO SPRINT',
    assetsDescripSAE: '',
    typeAsset: 'VEHICULO',
    fraction: '8703.00.01',
    quantityTransfer: '1',
    ligieUnitMeasure: 'PIEZA',
    transferUnitMeasure: 'PIEZA',
    uniqueKey: '1211',
    physicalState: 'NUEVO',
    conservationState: '',
    destinyLigie: 'VENTA',
    destinyTransfer: 'VENTA',
  },
];

@Component({
  selector: 'app-classification-assets-tab',
  templateUrl: './classification-assets-tab.component.html',
  styles: [],
})
export class ClassificationAssetsTabComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Bienes de la Solicitud';
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  assetsId: any = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: REQUEST_OF_ASSETS_COLUMNS,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    this.paragraphs = data;
    /*  this.exampleService.getAll(this.params.getValue()).subscribe(
      response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    ); */
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  rowSelected(event: any) {
    this.assetsId = event.data.id;
    console.log(this.assetsId);
  }
}

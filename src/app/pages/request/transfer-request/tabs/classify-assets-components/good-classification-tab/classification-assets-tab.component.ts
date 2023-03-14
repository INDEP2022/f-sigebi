import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
  implements OnInit, OnChanges
{
  @Input() dataObject: any;
  @Input() requestObject: any;
  @Input() typeDoc: any = '';
  title: string = 'Bienes de la Solicitud';
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: any[] = [];
  assetsId: any = '';
  detailArray: any;
  totalItems: number = 0;

  constructor(private goodService: GoodService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeDoc);

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: REQUEST_OF_ASSETS_COLUMNS,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.requestObject);
    if (this.requestObject) {
      this.tablePaginator();
    }
  }

  tablePaginator() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    //this.paragraphs = data;
    this.params.value.addFilter('requestId', this.requestObject.id);
    this.goodService.getAll(this.params.getValue().getParams()).subscribe({
      next: resp => {
        debugger;
        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
    });
  }

  rowSelected(event: any) {
    this.assetsId = event.data.id;
    console.log(this.assetsId);
    this.detailArray = event.data;
  }
}

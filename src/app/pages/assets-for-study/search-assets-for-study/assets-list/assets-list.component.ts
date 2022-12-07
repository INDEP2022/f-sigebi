import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../common/constants/table-settings';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../core/shared/base-page';
import { ASSETS_LIST_FILTERED_COLUMNS } from './columns/assets-list-filtered.columns';
import { ASSETS_LIST_SELECTED_COLUMNS } from './columns/assets-list-selected.columns';

var data = [
  {
    id: 1,
    noAsset: 1234,
    noInventory: 4545,
    classifier: 'classificador',
    descripTransfer: 'descripcion de la transferente',
    quantityTransfer: 15,
    unitTransfer: 'kilos',
    descriptIndep: 'descripcion indep',
    quantityIndep: 15,
    unitIndep: 'Kilos',
    descriptWarehouse: 'descripcion del almacen',
    quantityWarehouse: 20,
    unitWarehouse: 'Kilos',
    statePhysicWarehouse: 'Buen estado',
    stateConsercationWarehouse: 'Optimo',
    warehouse: 'Almacen',
    quantityForStudy: 0,
  },
  {
    id: 2,
    noAsset: 1234,
    noInventory: 4545,
    classifier: 'classificador',
    descripTransfer: 'descripcion de la transferente',
    quantityTransfer: 15,
    unitTransfer: 'kilos',
    descriptIndep: 'descripcion indep',
    quantityIndep: 15,
    unitIndep: 'Kilos',
    descriptWarehouse: 'descripcion del almacen',
    quantityWarehouse: 20,
    unitWarehouse: 'Kilos',
    statePhysicWarehouse: 'Buen estado',
    stateConsercationWarehouse: 'Optimo',
    warehouse: 'Almacen',
    quantityForStudy: 0,
  },
];

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styles: [],
})
export class AssetsListComponent extends BasePage implements OnInit, OnChanges {
  @Input() searchForm: any;
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  listAssetsSelected: any[] = [];

  settings2 = TABLE_SETTINGS;
  paragraphs2: any[] = []; //= new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  columns = ASSETS_LIST_SELECTED_COLUMNS;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: ASSETS_LIST_FILTERED_COLUMNS,
    };

    this.settings2 = {
      ...TABLE_SETTINGS,
      selectMode: 'multi',
      columns: ASSETS_LIST_SELECTED_COLUMNS,
    };
    this.settings2.actions = null;

    this.columns.input = {
      ...this.columns.input,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          this.paragraphs2.map(x => {
            if (x.id == data.row.id) {
              x.quantityForStudy = data.quantity;
            }
          });
        });
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchForm != null) {
      this.searchListOfAssetForStudy();
    }
  }

  searchListOfAssetForStudy() {
    console.log(this.searchForm);
    this.paragraphs = data;
  }

  addListForStudy(): void {
    this.paragraphs2 = this.listAssetsSelected;
    console.log(this.paragraphs2);
  }

  selectAssets(event: any): void {
    this.listAssetsSelected = event.selected;
  }

  forStudySelected(event: any): void {
    console.log(event);
  }
}

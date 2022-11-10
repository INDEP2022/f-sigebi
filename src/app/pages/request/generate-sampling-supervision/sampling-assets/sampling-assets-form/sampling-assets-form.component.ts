import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { UploadExpedientFormComponent } from '../upload-expedient-form/upload-expedient-form.component';
import { LIST_ASSETS_COLUMN } from './columns/list-assets-columns';
import { LIST_ASSETS_COPIES_COLUMN } from './columns/list-assets-copies';
import { LIST_WAREHOUSE_COLUMN } from './columns/list-warehouse-columns';

var data = [
  {
    id: 1,
    noWarehouse: '410',
    nameWarehouse: 'ALMACEN PRUEBA LAR',
    state: 'CIUDAD DE MEXICO',
    address:
      'PRIVADA DE LOS REYES, LOS REYS, 27, AZCAPOTZALCO, CIUDAD DE MEXICO',
    postalCode: '02010',
  },
];

var data2 = [
  {
    noInventory: '1',
    noManagement: '011',
    noSiab: '0',
    address: 'FUNDA PARA VOLANTE',
    regionalDelegation: 'METROPOLITANA',
    quantity: '2',
    unity: 'PIEZA',
  },
  {
    noInventory: '2',
    noManagement: '031',
    noSiab: '3',
    address: 'FUNDA PARA VOLANTE',
    regionalDelegation: 'METROPOLITANA',
    quantity: '1',
    unity: 'PIEZA',
  },
];

@Component({
  selector: 'app-sampling-assets-form',
  templateUrl: './sampling-assets-form.component.html',
  styleUrls: ['./sampling-assets-form.component.scss'],
})
export class SamplingAssetsFormComponent extends BasePage implements OnInit {
  dateForm: ModelForm<any>;
  searchForm: ModelForm<any>;
  showSearchForm: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  displaySearchAssetsBtn: boolean = false;
  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_ASSETS_COLUMN,
  };
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs2: any[] = [];
  totalItems2: number = 0;
  listAssetsSelected: any[] = [];

  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_ASSETS_COPIES_COLUMN,
  };
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs3: any[] = [];
  totalItems3: number = 0;
  listAssetsCopiedSelected: any[] = [];

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_WAREHOUSE_COLUMN,
    };
    this.initDateForm();
    this.initSearchForm();
  }

  initDateForm() {
    this.dateForm = this.fb.group({
      initialDate: [null],
      finalDate: [null],
    });
    this.paragraphs = data;
    this.paragraphs2 = data2;
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      noWarehouse: [null],
      postalCode: [null],
      nameWarehouse: [null],
      address: [null],
    });
  }

  selectWarehouse(event: any): any {
    this.displaySearchAssetsBtn = event.isSelected ? true : false;
  }

  selectAssts(event: any) {
    this.listAssetsSelected = event.selected;
  }

  addAssets() {
    this.paragraphs3 = this.listAssetsSelected;
    console.log(this.paragraphs3);
  }

  selectAsstsCopy(event: any) {
    this.listAssetsCopiedSelected = event.selected;
  }

  uploadExpedient() {
    //if (this.listAssetsCopiedSelected.length == 0) return;
    let config: ModalOptions = {
      initialState: {
        data: '',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadExpedientFormComponent, config);
  }

  close(): void {}
}

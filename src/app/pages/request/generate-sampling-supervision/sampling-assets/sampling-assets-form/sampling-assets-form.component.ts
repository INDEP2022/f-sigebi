import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';
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

  jsonToCsv = JSON_TO_CSV;

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

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService
  ) {
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
      nameWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
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
    this.openModals(UploadExpedientFormComponent, '');
  }

  uploadImages(): void {
    //if (this.listAssetsCopiedSelected.length == 0) return;
    this.openModals(UploadImagesFormComponent, '');
  }

  exportCsv() {
    const filename: string = 'Nombre del archivo';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  close(): void {}

  turnForm() {
    Swal.fire({
      title: 'Confirmación Turnado',
      text: '¿Está seguro que la información es correcta para turnar?',
      icon: undefined,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Guardar solicitud');
      }
    });
  }

  openModals(component: any, data?: any): void {
    let config: ModalOptions = {
      initialState: {
        data: 'hola',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }
}

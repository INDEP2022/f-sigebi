import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { ShowDocumentsGoodComponent } from '../../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { listAssets } from '../../generate-formats-verify-noncompliance/store/actions';
import { Item } from '../../generate-formats-verify-noncompliance/store/item.module';
import { LIST_PAYMENT_VALIDATIONS } from '../../sampling-assets/sampling-assets-form/columns/list-validation';
import { LIST_VERIFY_NONCOMPLIANCE } from '../../sampling-assets/sampling-assets-form/columns/list-verify-noncompliance';

@Component({
  selector: 'app-assets-tab',
  templateUrl: './assets-tab.component.html',
  styleUrls: ['./assets-tab.component.scss'],
})
export class AssetsTabComponent extends BasePage implements OnInit {
  @Input() willSave: boolean = false;
  @Input() typeTask: string = '';
  @Input() idSample: number = 0;
  @Input() filterObject: any;
  bsModalRef: BsModalRef;
  assetsForm: ModelForm<any>;
  assetsArray: any[] = [];
  assetsSelected: Item[] = [];
  paragraphs3 = new LocalDataSource();
  jsonToCsv = JSON_TO_CSV;
  isReadonly: boolean = false;
  isCheckboxReadonly: boolean = false;
  checkboxTitle: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_VERIFY_NONCOMPLIANCE,
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private store: Store,
    private samplingService: SamplingGoodService,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getGoodsSampling();
    //this.setEnableInputs();
    //this.assetsArray = data;
    //this.paragraphs3 = data;
    //console.log(this.willSave);
    //this.changeSettingTable();
  }
  ngOnChanges() {
    if (this.filterObject) {
      console.log('f', this.filterObject);
      if (
        !this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.getGoodsSampling();
      }

      if (
        this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;
        this.getGoodsSampling();
      }

      if (
        this.filterObject.noManagement &&
        this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;
        this.getGoodsSampling();
      }

      if (
        !this.filterObject.noManagement &&
        this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;
        this.getGoodsSampling();
      }

      if (
        !this.filterObject.noManagement &&
        this.filterObject.noInventory &&
        this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;
        this.getGoodsSampling();
      }

      if (
        !this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;
        this.getGoodsSampling();
      }

      if (
        this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;
        this.getGoodsSampling();
      }

      if (
        this.filterObject.noManagement &&
        this.filterObject.noInventory &&
        this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;
        this.getGoodsSampling();
      }
    }
  }

  getGoodsSampling() {
    this.params.getValue()['filter.sampleId'] = this.idSample;
    this.samplingService.getSamplingGoods(this.params.getValue()).subscribe({
      next: response => {
        console.log('samplegfoods', response);
        this.paragraphs3.load(response.data);
      },
      error: error => {},
    });
  }

  initAssetForm(): void {
    this.assetsForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      description: [null],
      quantity: [null],
      unity: [null],
      resultEvaluation: [null],
      statusAsset: [null],
      quantityMissingDamaged: [null],
      observationsAsset: [null],
    });
  }
  changeSettingTable() {
    if (this.typeTask == 'payment-validatios') {
      this.settings3 = {
        ...TABLE_SETTINGS,
        actions: false,
        selectMode: 'multi',
        columns: LIST_PAYMENT_VALIDATIONS,
      };
    } else {
      this.settings3 = {
        ...TABLE_SETTINGS,
        actions: false,
        selectMode: 'multi',
        columns: LIST_VERIFY_NONCOMPLIANCE,
      };
    }
  }
  setEnableInputs(): void {
    if (this.typeTask === 'verify-warehouse-assets') {
      this.checkboxTitle = 'Localizado';
      this.isReadonly = true;
    } else if (this.typeTask === 'assets-classification') {
      this.isReadonly = true;
      this.checkboxTitle = 'Número Gestión';
      this.isCheckboxReadonly = true;
    } else if (this.typeTask === 'payment-validatios') {
      this.isReadonly = true;
    }
  }

  selectOne(event: any, data: any) {
    if (event.target.checked == true) {
      this.assetsSelected.push(data);
    } else {
      let index = this.assetsSelected.indexOf(
        this.assetsArray.find(x => x.id == data.id)
      );
      this.assetsSelected.splice(index, 1);
    }

    //cargar los datos al store
    this.store.dispatch(listAssets({ items: this.assetsSelected }));
  }

  goodsSamplingSelect(event: any) {
    this.assetsSelected = event.selected;
  }

  uploadExpedient() {
    if (this.assetsSelected.length > 0) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered',
      };

      config.initialState = {
        sampleGood: this.assetsSelected,
        typeDoc: 'good',
        process: 'sampling-assets',
        callback: (next: boolean) => {},
      };

      this.modalService.show(ShowDocumentsGoodComponent, config);
    } else {
      this.alert('warning', 'Acción Invalida', 'Seleccione un bien');
    }
    //if (this.assetsSelected.length == 0) return;
    //this.openModals(UploadExpedientFormComponent, '');
  }

  uploadImages(): void {
    if (this.assetsSelected.length > 0) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered',
      };

      config.initialState = {
        sampleGood: this.assetsSelected,
        typeDoc: 'good',
        process: 'sampling-assets',
        callback: (next: boolean) => {},
      };

      this.modalService.show(PhotographyFormComponent, config);
    } else {
      this.alert('warning', 'Acción Invalida', 'Seleccione un bien');
    }
    //if (this.listAssetsCopiedSelected.length == 0) return;
    //this.openModals(UploadImagesFormComponent, '');
  }

  generateReport() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.massiveGoodService.exportSampleGoods(params.getValue()).subscribe({
      next: response => {
        this.downloadExcel(response.base64File);
      },
      error: error => {
        this.alert('warning', 'Advertencia', 'Error al generar reporte');
      },
    });
  }

  downloadExcel(excel: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = 'Muestreo_Bienes.xlsx';
    downloadLink.click();
    this.alert('success', 'Acción Correcta', 'Archivo generado');
  }

  /*changeStatusGood(value: string) {
    if (this.assetsSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener selecionado al menos un Bien');
      return;
    }
    console.log(this.assetsSelected);
    console.log(this.paragraphs3);
    this.assetsSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      if (value == 'F') {
        this.paragraphs3[index].statusAsset = 'FALTANTE';
      } else if (value == 'D') {
        this.paragraphs3[index].statusAsset = 'DAÑADO';
      }
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.assetsSelected = [];
  }

  changeStatusGoodAproval(value: string) {
    if (this.assetsSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener seleccionado al menos un Bien');
      return;
    }
    console.log(this.assetsSelected);
    console.log(this.paragraphs3);
    this.assetsSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      if (value == 'A') {
        this.paragraphs3[index].statusEvaluation = 'APROBAR';
      } else if (value == 'R') {
        this.paragraphs3[index].statusEvaluation = 'RECHAZAR';
      }
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.assetsSelected = [];
  }

  
  exportCsv() {
    const filename: string = 'Nombre del archivo';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  //preguntar si el formulario y los datos que se guardaran son similare
  //para sampling-assets-form y este
  openModals(component: any, data?: any): void {
    let config: ModalOptions = {
      initialState: {
        data: '',
        typeComponent: 'verify-noncompliance',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  } */
}

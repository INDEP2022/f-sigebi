import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
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
import {
  LIST_APPROV_VIEW,
  LIST_VERIFY_NONCOMPLIANCE,
  LIST_VERIFY_VIEW,
} from '../../sampling-assets/sampling-assets-form/columns/list-verify-noncompliance';
import { EditGoodSampleComponent } from './edit-good-sample/edit-good-sample.component';

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
  paragraphsView = new LocalDataSource();
  paragraphsApprov = new LocalDataSource();
  jsonToCsv = JSON_TO_CSV;
  isReadonly: boolean = false;
  isCheckboxReadonly: boolean = false;
  checkboxTitle: string = '';
  columns = LIST_VERIFY_NONCOMPLIANCE;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodsModified: any = [];
  totalItems: number = 0;
  settings3 = {
    ...TABLE_SETTINGS,
    actions: {
      edit: true,
      delete: false,
      columnTitle: 'Acciones',
      position: 'right',
    },
    selectMode: 'multi',
  };

  settingsView = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: LIST_VERIFY_VIEW,
  };

  settingsApprov = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_APPROV_VIEW,
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
    console.log('typeTask', this.typeTask);
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsSampling());

    this.settings3.columns = LIST_VERIFY_NONCOMPLIANCE;
    this.columns.quantityBreak = {
      ...this.columns.quantityBreak,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setquantityBreak(data);
        });
      },
    };

    this.columns.statusGoodObservations = {
      ...this.columns.statusGoodObservations,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setStatusGoodObservations(data);
        });
      },
    };
  }
  ngOnChanges() {
    if (this.filterObject) {
      if (
        !this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
      }

      if (
        this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
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
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
      }

      if (
        !this.filterObject.noManagement &&
        this.filterObject.noInventory &&
        !this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
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
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
      }

      if (
        !this.filterObject.noManagement &&
        !this.filterObject.noInventory &&
        this.filterObject.descriptionAsset
      ) {
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
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
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
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
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
      }
    }

    if (this.filterObject == false) {
      this.params = new BehaviorSubject<ListParams>(new ListParams());
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsSampling());
    }
  }

  setquantityBreak(descriptionInput: any) {
    this.paragraphs3['data'].map((item: any) => {
      if (item.sampleGoodId === descriptionInput.data.sampleGoodId) {
        item.quantityBreak = descriptionInput.text;

        this.addGoodModified(item);
      }
    });
  }

  setStatusGoodObservations(descriptionInput: any) {
    this.paragraphs3['data'].map((item: any) => {
      if (item.sampleGoodId === descriptionInput.data.sampleGoodId) {
        item.statusGoodObservations = descriptionInput.text;

        this.addGoodModified(item);
      }
    });
  }

  addGoodModified(good: any) {
    const index = this.goodsModified.indexOf(good);
    if (index != -1) {
      this.goodsModified[index] = good;
      if (this.goodsModified[index].quantityBreak == '') {
        this.goodsModified[index].quantityBreak = null;
      }

      if (this.goodsModified[index].statusGoodObservations == '') {
        this.goodsModified[index].statusGoodObservations = null;
      }
    } else {
      this.goodsModified.push(good);
    }
  }

  getGoodsSampling() {
    if (this.typeTask == 'assets-approval')
      this.params.getValue()['filter.typeRestitution'] = 'EN ESPECIE';
    if (
      this.typeTask == 'verify-noncompliance' ||
      this.typeTask == 'assets-classification' ||
      this.typeTask == 'assets-classification-annexed'
    )
      this.params.getValue()['filter.evaluationResult'] = 'NO CUMPLE';

    if (this.typeTask == 'payment-validations')
      this.params.getValue()['filter.typeRestitution'] = 'NUMERARIO';
    this.params.getValue()['filter.sampleId'] = this.idSample;
    this.samplingService.getSamplingGoods(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs3.load(response.data);
        this.paragraphsView.load(response.data);
        this.paragraphsApprov.load(response.data);
        this.totalItems = response.count;
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
    } else if (this.typeTask === 'assets-classification-annexed') {
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

  missingInfo() {
    if (this.assetsSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea editar el bien?'
      ).then(question => {
        if (question.isConfirmed) {
          this.assetsSelected.map((item: any, i: number) => {
            let index = i + 1;
            const infoSampleGood = {
              sampleGoodId: item.sampleGoodId,
              goodState: 'FALTANTE',
            };

            this.samplingService.editSamplingGood(infoSampleGood).subscribe({
              next: () => {
                if (index == this.assetsSelected.length) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Bien actualizado correctamente'
                  );
                  this.params
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getGoodsSampling());
                }
              },
              error: () => {
                if (index == this.assetsSelected.length) {
                  this.alert(
                    'warning',
                    'Acción Invalida',
                    'No se pudo actualizar el bien'
                  );
                }
              },
            });
          });
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien'
      );
    }
  }

  damagedInfo() {
    if (this.assetsSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea editar el bien?'
      ).then(question => {
        if (question.isConfirmed) {
          this.assetsSelected.map((item: any, i: number) => {
            let index = i + 1;
            const infoSampleGood = {
              sampleGoodId: item.sampleGoodId,
              goodState: 'DAÑADO',
            };

            this.samplingService.editSamplingGood(infoSampleGood).subscribe({
              next: () => {
                if (index == this.assetsSelected.length) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Bien actualizado correctamente'
                  );
                  this.params
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getGoodsSampling());
                }
              },
              error: () => {
                if (index == this.assetsSelected.length) {
                  this.alert(
                    'warning',
                    'Acción Invalida',
                    'No se pudo actualizar el bien'
                  );
                }
              },
            });
          });
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien'
      );
    }
  }

  saveInfoGood() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea editar los bienes?'
    ).then(question => {
      if (question.isConfirmed) {
        this.paragraphs3.getElements().then(data => {
          data.map((item: any, i: number) => {
            let index = i + 1;

            if (item.quantity >= item.quantityBreak) {
              this.samplingService.editSamplingGood(item).subscribe({
                next: () => {
                  if (index == data.length) {
                    this.alert(
                      'success',
                      'Acción Correcta',
                      'Bien actualizado correctamente'
                    );
                    this.params
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getGoodsSampling());
                  }
                },
                error: () => {
                  this.alert('error', 'Error', 'Error al actualizar el bien');
                },
              });
            } else {
              this.alert(
                'warning',
                'Acción Invalida',
                `La cantidad faltante o dañada es mayor a la cantidad en el bien ${item.goodId}`
              );
            }
          });
        });
      }
    });
  }

  editSampleGood(good: ISampleGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      callback: (next: boolean) => {
        if (next)
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getGoodsSampling());
      },
    };
    this.modalService.show(EditGoodSampleComponent, config);
  }

  approveGood() {
    if (this.assetsSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea editar el bien?'
      ).then(question => {
        if (question.isConfirmed) {
          this.assetsSelected.map((item: any) => {
            const infoSampleGood = {
              sampleGoodId: item.sampleGoodId,
              restitutionStatus: 'APROBAR',
              goodStatus: 'APROBADO_NUMERARIO',
            };

            this.samplingService.editSamplingGood(infoSampleGood).subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
                this.params
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getGoodsSampling());
              },
              error: error => {
                this.alert(
                  'warning',
                  'Acción Invalida',
                  'No se pudo actualizar el bien'
                );
              },
            });
          });
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien'
      );
    }
  }

  declineGood() {
    if (this.assetsSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea editar el bien?'
      ).then(question => {
        if (question.isConfirmed) {
          this.assetsSelected.map((item: any) => {
            const infoSampleGood = {
              sampleGoodId: item.sampleGoodId,
              restitutionStatus: 'RECHAZAR',
              goodStatus: 'RECHAZADO_NUMERARIO',
            };

            this.samplingService.editSamplingGood(infoSampleGood).subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
                this.params
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getGoodsSampling());
              },
              error: error => {
                this.alert(
                  'warning',
                  'Acción Invalida',
                  'No se pudo actualizar el bien'
                );
              },
            });
          });
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien'
      );
    }
  }
}

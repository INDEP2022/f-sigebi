import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';
import { EditSampleGoodComponent } from '../edit-sample-good/edit-sample-good.component';
import { LIST_ASSETS_COLUMN } from './columns/list-assets-columns';
import { LIST_ASSETS_COPIES_COLUMN } from './columns/list-assets-copies';
import { LIST_DEDUCTIVES_COLUMNS } from './columns/list-deductivas-column';
import { LIST_WAREHOUSE_COLUMN } from './columns/list-warehouse-columns';

@Component({
  selector: 'app-sampling-assets-form',
  templateUrl: './sampling-assets-form.component.html',
  styleUrls: ['./sampling-assets-form.component.scss'],
})
export class SamplingAssetsFormComponent extends BasePage implements OnInit {
  @ViewChild('table2', { static: false }) table2: any;
  dateForm: ModelForm<any>;
  searchForm: ModelForm<any>;
  showSearchForm: boolean = true;
  loadingGoods: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any = [];
  totalItems: number = 0;
  sampleId: number = 0;
  jsonToCsv = JSON_TO_CSV;

  loadingGoodInv: boolean = false;
  displaySearchAssetsBtn: boolean = false;
  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_ASSETS_COLUMN,
  };
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs2 = new LocalDataSource();
  totalItems2: number = 0;
  listAssetsSelected: any[] = [];

  settings3 = {
    ...TABLE_SETTINGS,
    actions: {
      edit: true,
      delete: false,
      columnTitle: 'Acciones',
      position: 'right',
    },
    selectMode: 'multi',
    columns: LIST_ASSETS_COPIES_COLUMN,
  };
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs3 = new LocalDataSource();
  totalItems3: number = 0;
  listAssetsCopiedSelected: any[] = [];

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: '',
  };
  columns4 = LIST_DEDUCTIVES_COLUMNS;
  paragraphsDeductivas: any[] = [{}];

  delegationId: string = '';
  storeSelected: any = {};

  selectTransferent = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private domicilieService: GoodDomiciliesService,
    private goodsqueryService: GoodsQueryService,
    private authService: AuthService,
    private goodService: GoodService,
    private transferentService: TransferenteService,
    private goodsInvService: GoodsInvService,
    private samplingGoodService: SamplingGoodService,
    private delegationService: RegionalDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.delegationId = this.getRegionalDelegationId();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_WAREHOUSE_COLUMN,
    };

    this.initDateForm();
    this.initSearchForm();

    this.settings4.columns = LIST_DEDUCTIVES_COLUMNS;

    this.columns4.observation = {
      ...this.columns4.observation,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.deductivesObservations(data);
        });
      },
    };
    this.columns4.selected = {
      ...this.columns4.selected,
      onComponentInitFunction: this.deductiveSelected.bind(this),
    };

    this.getTransferent(new ListParams());
    //this.paragraphsDeductivas = data;
  }

  initDateForm() {
    this.dateForm = this.fb.group({
      initialDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      transferent: [null],
    });
    //this.paragraphs = data;
    //this.paragraphs2 = data2;
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      id: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      code: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      nameWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  selectWarehouse(event: any): any {
    this.displaySearchAssetsBtn = event.isSelected ? true : false;
    this.storeSelected = event.data;
  }

  goodSearch() {
    const startPeriod = this.dateForm.get('initialDate').value;
    const endPeriod = this.dateForm.get('finalDate').value;

    if (startPeriod && endPeriod) {
      this.params2
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoods());
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'Se debe capturar una fecha de periodo inicial y final'
      );
    }
  }

  selectAssts(event: any) {
    this.listAssetsSelected = event.selected;
    console.log('this.listAssetsSelected', this.listAssetsSelected);
  }

  addAssets() {
    if (this.listAssetsSelected.length > 0) {
      this.listAssetsSelected.map(item => {
        const sampligGood: ISampleGood = {
          sampleGoodId: 243,
          sampleId: this.sampleId,
          goodId: item.managementNumber,
          goodSiabNumber: item.goodSiabNumber,
          inventoryNumber: item.inventoryNumber,
          version: 1,
          description: item.descriptiveValue,
          quantity: item.transactionQuantity,
          unit: item.uomCode,
          subInventoryCode: item.subinventoryCode,
          locatorId: item.locatorId,
          inventoryItemId: item.inventoryItemId,
          tranferRequest: item.transferRequest,
          authorityId: item.authorityId,
          transfereeFile: item.transferFile,
          keyUniqueSat: item.satUniqueKey,
          typeFile: item.fileType,
          tradeNumber: item.jobNumber,
          type: item.type,
          subType: item.ssubType,
          sSubtype: item.ssubType,
          ssSubtype: item.sssubType,
          transfereeId: item.entTransferentId,
          requestDate: moment(item.requestDate).format('YYYY-MM-DD'),
          fileNumber: item.fileNumber,
          fileDate: moment(item.fileDate).format('YYYY-MM-DD'),
        };
        this.samplingGoodService.createSamplingGood(sampligGood).subscribe({
          next: response => {
            this.params3
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getSampligGoods());
          },
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Selecciona bienes para el muestreo'
      );
    }
  }

  getSampligGoods() {
    this.loadingGoods = true;
    this.params3.getValue()['filter.sampleId'] = this.sampleId;
    this.samplingGoodService
      .getSamplingGoods(this.params3.getValue())
      .subscribe({
        next: response => {
          const showInfo = response.data.map(async item => {
            const nameTransferent: any = await this.getNameTransferent(
              Number(item.transfereeId)
            );
            item.nameTransferent = nameTransferent;
            return item;
          });

          Promise.all(showInfo).then(info => {
            this.loadingGoods = false;
            this.paragraphs3.load(info);
            this.totalItems3 = info.length;
          });
        },
        error: error => {
          this.loadingGoods = false;
        },
      });
  }

  selectAsstsCopy(event: any) {
    this.listAssetsCopiedSelected = event.selected;
  }

  uploadExpedient() {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.onLoadToast(
        'info',
        'Se tiene que tener seleccionado al menos un registro'
      );
      return;
    }
    this.openModals(
      UploadExpedientFormComponent,
      this.listAssetsCopiedSelected
    );
  }

  uploadImages(): void {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.onLoadToast(
        'info',
        'Se tiene que tener seleccionado al menos un registro'
      );
      return;
    }
    this.openModals(UploadImagesFormComponent, this.listAssetsCopiedSelected);
  }

  exportCsv() {
    const title = 'Muestreo de Bienes para Supervisión';
    const filename: string = 'MuestreoBienesSupervision';
    //this.jsonToCsv = this.generateJsonExcel();
    //console.log(this.jsonToCsv)
    //{type: 'csv'}
    this.excelService.export(this.jsonToCsv, { filename });
  }

  search() {
    if (
      this.searchForm.get('id').value &&
      !this.searchForm.get('code').value &&
      !this.searchForm.get('nameWarehouse').value &&
      !this.searchForm.get('address').value
    )
      this.params.getValue()['filter.stockSiabNumber'] = `$eq:${
        this.searchForm.get('id').value
      }`;

    if (
      this.searchForm.get('code').value &&
      !this.searchForm.get('id').value &&
      !this.searchForm.get('nameWarehouse').value &&
      !this.searchForm.get('address').value
    )
      this.params.getValue()['filter.postalCode'] =
        this.searchForm.get('code').value;

    if (
      this.searchForm.get('nameWarehouse').value &&
      !this.searchForm.get('id').value &&
      !this.searchForm.get('code').value &&
      !this.searchForm.get('address').value
    )
      this.params.getValue()['filter.name'] =
        this.searchForm.get('nameWarehouse').value;

    if (
      this.searchForm.get('address').value &&
      !this.searchForm.get('id').value &&
      !this.searchForm.get('code').value &&
      !this.searchForm.get('nameWarehouse').value
    )
      this.params.getValue()['filter.descriptiveValue'] =
        this.searchForm.get('address').value;
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getCatAlmacenView();
    });
  }

  getRegionalDelegationId() {
    const id = this.authService.decodeToken().department;
    return id;
  }

  getCatAlmacenView() {
    this.params.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${this.delegationId}`;
    const filter = this.params.value;

    this.goodsqueryService.getCatStoresView(filter).subscribe({
      next: resp => {
        this.paragraphs = resp.data;
        this.totalItems = resp.count;

        this.loading = false;
      },
      error: error => {
        this.onLoadToast('info', 'No se encontraron registros');
        this.loading = false;
      },
    });
  }

  getGoods() {
    this.loadingGoodInv = true;
    this.params2.getValue()[
      'filter.organizationId'
    ] = `$eq:${this.storeSelected.organizationCode}`;
    this.params2.getValue()['filter.initialPeriod'] = `$btw:${
      this.dateForm.get('initialDate').value
    }, ${this.dateForm.get('finalDate').value}`;

    this.params2.getValue()['filter.finalPeriod'] = `$btw:${
      this.dateForm.get('initialDate').value
    }, ${this.dateForm.get('finalDate').value}`;

    this.goodsInvService
      .getSamplingGoodView(this.params2.getValue())
      .subscribe({
        next: async resp => {
          const showInfo = resp.data.map(async item => {
            const showNameTransferent: any = await this.getNameTransferent(
              item.entTransferentId
            );
            item.transferentName = showNameTransferent;

            const showNameDelegation: any = await this.getNameDelegation(
              item.delRegionalId
            );

            item.delegationName = showNameDelegation;
            return item;
          });

          Promise.all(showInfo).then(async info => {
            this.paragraphs2.load(info);
            this.loadingGoodInv = false;
            this.totalItems2 = resp.data.length;
            const checkExistSamplingOrder = await this.checkSamplingOrder();
            if (checkExistSamplingOrder) {
              this.params3
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getSampligGoods());
            }
          });
        },
        error: error => {
          this.loadingGoodInv = false;
        },
      });
  }

  getNameTransferent(transferentId: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(transferentId).subscribe({
        next: response => {
          resolve(response.nameTransferent);
        },
      });
    });
  }

  getNameDelegation(delegationId: number) {
    return new Promise((resolve, reject) => {
      this.delegationService.getById(delegationId).subscribe({
        next: response => {
          resolve(response.description);
        },
      });
    });
  }

  checkSamplingOrder() {
    return new Promise((resolve, reject) => {
      const initialDate = moment(this.dateForm.get('initialDate').value).format(
        'YYYY-MM-DD'
      );
      const finalDate = moment(this.dateForm.get('finalDate').value).format(
        'YYYY-MM-DD'
      );
      const params = new BehaviorSubject<ListParams>(new ListParams());

      params.getValue()['filter.startDate'] = initialDate;
      params.getValue()['filter.endDate'] = finalDate;

      this.samplingGoodService.getSample(params.getValue()).subscribe({
        next: response => {
          this.sampleId = response.data[0].sampleId;
          resolve(true);
        },
        error: error => {
          const sample: ISample = {
            sampleId: this.sampleId,
            regionalDelegationId: this.delegationId,
            startDate: initialDate,
            endDate: finalDate,
            speciesInstance: 'INSTANCIA_INICIADA',
            numeraryInstance: 'INSTANCIA_INICIADA',
            warehouseId: this.storeSelected.organizationCode,
            version: 1,
          };

          this.samplingGoodService.createSample(sample).subscribe({
            next: response => {
              this.sampleId = response.sampleId;
              resolve(true);
            },
            error: error => {
              this.alert('error', 'Error', 'Error al crear Muestreo');
            },
          });
        },
      });
    });
  }

  /*turnForm() {
    Swal.fire({
      title: 'Confirmación Turnado',
      text: '¿Está seguro que la información es correcta para turnar?',
      icon: undefined,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        const size = this.paragraphs3.length;
        const evaResult = this.paragraphs3.filter(x => x.resultTest != null);
        debugger;
        if (size == 0) {
          this.onLoadToast('info', 'No hay bienes agregados');
          return;
        }

        if (size != evaResult.length) {
          this.onLoadToast(
            'info',
            'Todos los bienes deben contar con un Resultado de Evaluación'
          );
          return;
        }

        const cumple = this.paragraphs3.filter(x => x.resultTest == 'CUMPLE');
        const noCumple = this.paragraphs3.filter(
          x => x.resultTest == 'NO CUMPLE'
        );
        if (cumple.length == size) {
          const deductivesSize = this.paragraphsDeductivas.length;
          const deductivesSelected = this.paragraphsDeductivas.filter(
            x => x.selected == true
          );

          if (deductivesSelected.length == 0) {
            //popBienesCumplen
            this.openModals(
              TurnModalComponent,
              '',
              'popBienesCumplen',
              'modal-lg'
            );
          } else {
            //confirmacionTurnado
            this.openModals(
              TurnModalComponent,
              '',
              'confirmacionTurnado',
              'modal-lg'
            );
          }
        } else {
          const deductivesSelected = this.paragraphsDeductivas.filter(
            x => x.selected == true
          );

          if (deductivesSelected.length == 0) {
            this.onLoadToast('info', 'Seleccione al menos una deductiva');
            return;
          } else {
            this.openModals(TurnModalComponent, '', 'popTurna', 'modal-lg');
          }
        }
      }
    });
  } */

  openModals(
    component: any,
    good?: any,
    type?: string,
    modalSize: string = 'modalSizeXL'
  ): void {
    let config: ModalOptions = {
      initialState: {
        good: good,
        typeModal: type,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: `${modalSize} modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  clean() {
    this.dateForm.reset();
    this.searchForm.reset();
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getCatAlmacenView();
    });
  }

  unselectGoodRows() {
    const a = this.table2.grid.getRows();
    a.map((item: any) => {
      item.isSelected = false;
    });
  }

  deductiveSelected(event: any) {
    event.toggle.subscribe((data: any) => {});
  }

  deductivesObservations(event: any) {}

  getTransferent(params: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    params['filter.typeTransferent'] = `$eq:NO`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        this.selectTransferent = new DefaultSelect(data.data, data.count);
      },
    });
  }

  editResultEvaluation(sampleGood: ISampleGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      sampleGood,
      callback: (next: boolean) => {
        if (next) {
          this.params3
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getSampligGoods());
        }
      },
    };

    this.modalService.show(EditSampleGoodComponent, config);
  }

  meetsGoods() {
    if (this.listAssetsCopiedSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea modificar el resultado de evaluación?'
      ).then(question => {
        if (question.isConfirmed) {
          this.listAssetsCopiedSelected.map(item => {
            const sampleGood: ISampleGood = {
              sampleGoodId: item.sampleGoodId,
              sampleId: item.sampleId,
              evaluationResult: 'CUMPLE',
            };

            this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Acción Correcta',
                  'Resultado de evaluación actualizado correctamente'
                );
                this.params3
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getSampligGoods());
              },
              error: error => {
                this.alert(
                  'error',
                  'Error',
                  'Error al actualizar el resultado de evaluación'
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
        'Se requiere seleccionar al menos un bien muestreo'
      );
    }
  }

  failsGoods() {
    if (this.listAssetsCopiedSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea modificar el resultado de evaluación?'
      ).then(question => {
        if (question.isConfirmed) {
          this.listAssetsCopiedSelected.map(item => {
            const sampleGood: ISampleGood = {
              sampleGoodId: item.sampleGoodId,
              sampleId: item.sampleId,
              evaluationResult: 'NO CUMPLE',
            };

            this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Acción Correcta',
                  'Resultado de evaluación actualizado correctamente'
                );
                this.params3
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getSampligGoods());
              },
              error: error => {
                this.alert(
                  'error',
                  'Error',
                  'Error al actualizar el resultado de evaluación'
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
        'Se requiere seleccionar al menos un bien muestreo'
      );
    }
  }

  removeGood() {
    if (this.listAssetsCopiedSelected.length > 0) {
      this.listAssetsCopiedSelected.map(item => {
        this.samplingGoodService
          .deleteSamplingGood(item.sampleGoodId)
          .subscribe({
            next: response => {
              this.alert(
                'success',
                'Acción Correcta',
                'Bien muestreo eliminado correctamente'
              );
              this.paragraphs3 = new LocalDataSource();
              this.params2
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getGoods());
            },
            error: error => {
              this.alert(
                'error',
                'Error',
                'Error al eliminar el bien muestreo'
              );
            },
          });
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar al menos un bien muestreo'
      );
    }
  }
}

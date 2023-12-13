import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { ShowDocumentsGoodComponent } from '../../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { EditDeductiveComponent } from '../edit-deductive/edit-deductive.component';
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
  showSample: boolean = false;
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
  nameDelegation: string = '';
  deductivesSel: IDeductive[] = [];
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
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs3 = new LocalDataSource();
  totalItems3: number = 0;
  listAssetsCopiedSelected: any[] = [];
  allDeductives: ISamplingDeductive[] = [];
  settings4 = {
    ...TABLE_SETTINGS,
    actions: {
      edit: true,
      delete: false,
      columnTitle: 'Acciones',
      position: 'right',
    },
  };
  columns4 = LIST_DEDUCTIVES_COLUMNS;
  paragraphsDeductivas = new LocalDataSource();

  delegationId: number = 0;
  storeSelected: any = {};
  sampleInfo: ISample;
  selectTransferent = new DefaultSelect();
  addressWarehouse: string = '';
  nameWarehouse: string = '';
  nameTransferente: string = '';
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
    private delegationService: RegionalDelegationService,
    private massiveGoodService: MassiveGoodService,
    private deductiveService: DeductiveVerificationService,
    private router: Router,
    private goodsQueryService: GoodsQueryService,
    private taskService: TaskService
  ) {
    super();

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: LIST_WAREHOUSE_COLUMN,
    };
  }

  ngOnInit(): void {
    this.delegationId = Number(this.getRegionalDelegationId());

    this.initDateForm();
    this.initSearchForm();
    this.getTransferent(new ListParams());
    this.settings4.columns = LIST_DEDUCTIVES_COLUMNS;

    this.columns4.selected = {
      ...this.columns4.selected,
      onComponentInitFunction: this.deductiveSelected.bind(this),
    };

    this.getTransferent(new ListParams());
  }

  getSampleDeductives() {
    this.params.getValue()['filter.sampleId'] = `$eq:${this.sampleId}`;
    this.samplingGoodService
      .getAllSampleDeductives(this.params.getValue())
      .subscribe({
        next: response => {
          this.allDeductives = response.data;
          this.getDeductives(response.data);
        },
        error: () => {
          this.getDeductivesNew();
        },
      });
  }

  getDeductives(deductivesRelSample: ISamplingDeductive[]) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.deductiveService.getAll(params.getValue()).subscribe({
      next: response => {
        const infoDeductives = response.data.map(item => {
          deductivesRelSample.map(deductiveEx => {
            if (deductiveEx.deductiveVerificationId == item.id) {
              item.observations = deductiveEx.observations;
              item.selected = true;
            }
          });
          return item;
        });
        this.paragraphsDeductivas.load(infoDeductives);
      },
      error: error => {},
    });
  }

  getDeductivesNew() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.deductiveService.getAll(params.getValue()).subscribe({
      next: response => {
        this.paragraphsDeductivas.load(response.data);
      },
      error: error => {},
    });
  }

  initDateForm() {
    this.dateForm = this.fb.group({
      initialDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
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
    const transferent = this.dateForm.get('transferent').value;
    if (transferent) {
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
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar una transferente'
      );
    }
  }

  selectAssts(event: any) {
    this.listAssetsSelected = event.selected;
  }

  addAssets() {
    if (this.listAssetsSelected.length > 0) {
      this.listAssetsSelected.map(item => {
        const sampligGood: ISampleGood = {
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

            this.params2
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getGoods());

            this.getSampleDeductives();
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
    if (this.listAssetsCopiedSelected.length > 0) {
      this.openModals(
        ShowDocumentsGoodComponent,
        this.listAssetsCopiedSelected
      );
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar al menos un bien'
      );
    }
  }

  uploadImages(): void {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.onLoadToast(
        'info',
        'Se tiene que tener seleccionado al menos un registro'
      );
      return;
    }
    this.openModals(PhotographyFormComponent, this.listAssetsCopiedSelected);
  }

  exportCsv() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${this.sampleId}`;
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

  search() {
    const id = this.searchForm.get('id').value;
    const code = this.searchForm.get('code').value;
    const nameWarehouse = this.searchForm.get('nameWarehouse').value;
    const address = this.searchForm.get('address').value;
    const transferent = this.dateForm.get('transferent').value;

    if (id) this.params.getValue()['filter.organizationCode'] = id;
    if (code) this.params.getValue()['filter.postalCode'] = code;
    if (nameWarehouse) this.params.getValue()['filter.name'] = nameWarehouse;
    if (address) this.params.getValue()['filter.address1'] = address;
    //if (transferent)
    //this.params.getValue()['filter.organizationCode'] = transferent;

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
        this.alert('warning', 'Acción Invalida', 'No se encontraron almacenes');
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

    this.samplingGoodService
      .getSamplingGoodFilter(this.params2.getValue())
      .subscribe({
        next: resp => {
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

              const deductivesRelSample: any =
                await this.checkExistDeductives();
              if (deductivesRelSample == false) {
                this.getDeductivesNew();
              } else {
                this.params4
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getDeductives(deductivesRelSample));
              }
            }
          });
        },
        error: error => {
          this.alert(
            'warning',
            'Datos no Encontrados',
            'No hay bienes relacionados a el almacén seleccionado'
          );
          this.loadingGoodInv = false;
          this.paragraphs2 = new LocalDataSource();
        },
      });
  }

  checkExistDeductives() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.sampleId'] = `$eq:${this.sampleId}`;
      this.samplingGoodService
        .getAllSampleDeductives(params.getValue())
        .subscribe({
          next: response => {
            resolve(response.data);
          },
          error: error => {
            resolve(false);
          },
        });
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

      const transferent = this.dateForm.get('transferent').value;
      const params = new BehaviorSubject<ListParams>(new ListParams());

      params.getValue()['filter.startDate'] = initialDate;
      params.getValue()['filter.endDate'] = finalDate;
      params.getValue()['filter.transfereeId'] = `$eq:${transferent}`;

      this.samplingGoodService.getSample(params.getValue()).subscribe({
        next: response => {
          this.sampleId = response.data[0].sampleId;
          this.getInfoSample(response.data[0].sampleId);
          resolve(true);
        },
        error: () => {
          const sample: ISample = {
            regionalDelegationId: this.delegationId,
            startDate: initialDate,
            endDate: finalDate,
            speciesInstance: 'INSTANCIA_INICIADA',
            numeraryInstance: 'INSTANCIA_INICIADA',
            warehouseId: this.storeSelected.organizationCode,
            version: 1,
            transfereeId: this.dateForm.get('transferent').value,
          };

          this.samplingGoodService.createSample(sample).subscribe({
            next: response => {
              this.sampleId = response.sampleId;
              this.getInfoSample(this.sampleId);
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

  getInfoSample(idSample: number) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${idSample}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: async response => {
        const delegationName: any = await this.getNameDelegation(
          response.data[0].regionalDelegationId
        );

        if (delegationName) {
          this.nameDelegation = delegationName;
          const transferent: any = await this.getNameTransferent(
            response.data[0].transfereeId
          );

          if (transferent) this.nameTransferente = transferent;
        }

        response.data[0].startDate = moment(response.data[0].startDate).format(
          'DD/MM/YYYY'
        );
        response.data[0].endDate = moment(response.data[0].endDate).format(
          'DD/MM/YYYY'
        );
        response.data[0].creationDate = moment(
          response.data[0].creationDate
        ).format('DD/MM/YYYY');

        this.sampleInfo = response.data[0];
        this.showWarehouseInfo();
        this.showSample = true;
      },
    });
  }

  showWarehouseInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.organizationCode'] = this.sampleInfo?.warehouseId;
    this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
      next: response => {
        this.addressWarehouse = response.data[0].address1;
        this.nameWarehouse = response.data[0].name;
      },
      error: error => {},
    });
  }

  openModals(
    component: any,
    good?: any,
    type?: string,
    modalSize: string = 'modalSizeXL'
  ): void {
    let config: ModalOptions = {
      initialState: {
        sampleGood: good,
        typeModal: type,
        typeDoc: 'good',
        process: 'sampling-assets',
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
    this.transferentService.getAll(params).subscribe({
      next: data => {
        this.selectTransferent = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectTransferent = new DefaultSelect();
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
          this.listAssetsCopiedSelected.map((item: any, i: number) => {
            let index = i + 1;

            const sampleGood: ISampleGood = {
              sampleGoodId: item.sampleGoodId,
              sampleId: item.sampleId,
              evaluationResult: 'CUMPLE',
            };

            this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
              next: () => {
                if (this.listAssetsCopiedSelected.length == index) {
                  this.alert(
                    'success',
                    'Acción Correcta',
                    'Resultado de evaluación actualizado correctamente'
                  );
                  this.params3
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getSampligGoods());
                }
              },
              error: () => {
                if (this.listAssetsCopiedSelected.length == index) {
                  this.alert(
                    'error',
                    'Error',
                    'Error al actualizar el resultado de evaluación'
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
          this.listAssetsCopiedSelected.map((item: any, i: number) => {
            let index = i + 1;
            const sampleGood: ISampleGood = {
              sampleGoodId: item.sampleGoodId,
              sampleId: item.sampleId,
              evaluationResult: 'NO CUMPLE',
            };

            this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
              next: () => {
                if (index == this.listAssetsCopiedSelected.length) {
                  this.alert(
                    'success',
                    'Acción Correcta',
                    'Resultado de evaluación actualizado correctamente'
                  );
                  this.params3
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getSampligGoods());
                }
              },
              error: () => {
                if (index == this.listAssetsCopiedSelected.length) {
                  this.alert(
                    'error',
                    'Error',
                    'Error al actualizar el resultado de evaluación'
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
            next: () => {
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
            error: () => {
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

  saveDeductives() {
    if (this.deductivesSel.length > 0) {
      const deleteDeductives = this.deductivesSel.filter((data: any) => {
        if (data.selected) return data;
      });

      if (deleteDeductives.length > 0) {
        const deleteVerification = deleteDeductives.map(item => {
          this.allDeductives.map(data => {
            if (item.id == data.deductiveVerificationId) {
              item.sampleDeductiveId = data.sampleDeductiveId;
            }
          });

          return item;
        });

        deleteVerification.map(item => {
          this.samplingGoodService
            .deleteSampleDeductive(item.sampleDeductiveId)
            .subscribe({
              next: () => {},
            });
        });
      }

      const addDeductives = this.deductivesSel.filter((data: any) => {
        if (data.selected == null) return data;
      });

      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea guardar las deductivas seleccionadas?'
      ).then(question => {
        if (question.isConfirmed) {
          addDeductives.map((item: any, i: number) => {
            let index = i + 1;
            const sampleDeductive: ISamplingDeductive = {
              sampleId: this.sampleId,
              deductiveVerificationId: item.id,
              indDedictiva: 'N',
              version: 1,
              observations: item.observations,
            };

            this.samplingGoodService
              .createSampleDeductive(sampleDeductive)
              .subscribe({
                next: () => {
                  if (addDeductives.length == index) {
                    this.alert(
                      'success',
                      'Acción Correcta',
                      'Deductivas agregadas correctamente'
                    );
                  }
                },
                error: () => {
                  if (addDeductives.length == index) {
                    this.alert(
                      'error',
                      'Error',
                      'Error al guardar la deductiva'
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
        'Se requiere seleccionar o deseleccionar una deductiva'
      );
    }
  }

  deductivesSelect(event: any) {
    this.deductivesSel.push(event.selected[0]);
  }

  editDeductive(deductive: IDeductive) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      deductive,
      callback: (next: boolean, deductive: IDeductiveVerification) => {
        if (next) {
          this.getSampleDeductives();
        }
      },
    };

    this.modalService.show(EditDeductiveComponent, config);
  }

  async deleteDeductive(deductiveDelete: ISamplingDeductive) {
    const checkExistDeductive: any = await this.checkExistDeductives();
    const _deductiveDelete = checkExistDeductive.map((deductive: any) => {
      if (deductive.deductiveVerificationId == deductiveDelete.id) {
        return deductive;
      }
    });

    const filterDeductive = _deductiveDelete.filter((item: any) => {
      return item;
    });

    if (filterDeductive.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea eliminar la deductiva?'
      ).then(question => {
        if (question.isConfirmed) {
          this.samplingGoodService
            .deleteSampleDeductive(filterDeductive[0].sampleDeductiveId)
            .subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Correcto',
                  'Deductiva eliminada correctamente'
                );
                this.params2
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getGoods());
              },
            });
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'La deductiva no ha sido seleccionada a el muestreo'
      );
    }
  }

  turnSampling() {
    this.paragraphs3.getElements().then(async data => {
      if (data.length > 0) {
        const resultEvaluation = data.map(item => {
          if (!item.evaluationResult) return item;
        });

        const filterEv = resultEvaluation.filter(item => {
          return item;
        });

        if (filterEv.length == 0) {
          const goodCump = data.map(item => {
            if (item.evaluationResult == 'CUMPLE') return item;
          });

          const filterGoodCump = goodCump.filter(item => {
            return item;
          });

          if (filterGoodCump.length == data.length) {
            //const deductivesSelect = await this.checkDeductives();
            const updateSample = this.updateSample('BIENES CUMPLEN');
            if (updateSample) {
              this.alertQuestion(
                'info',
                'Acción',
                'Todos los bienes cumplen con los resultados de evaluación y no ha seleccionado alguna deductiva'
              ).then(question => {
                if (question.isConfirmed) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Muestreo Cerrado correctamente'
                  );
                }
              });
            }
          } else {
            const deductivesSelect = await this.checkDeductives();
            if (deductivesSelect) {
              const updateSample = this.updateSample('BIENES NO CUMPLEN');
              if (updateSample) {
                this.alertQuestion(
                  'question',
                  'Confirmación',
                  '¿Esta seguro que la información es correcta para turnar?'
                ).then(async question => {
                  if (question.isConfirmed) {
                    this.createTaskSample();
                  }
                });
              }
            } else {
              this.alert(
                'warning',
                'Acción Invalida',
                'Selecciona una deductiva para continuar'
              );
            }
          }
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'Todos los bienes deben contar con un resultado de evaluación"'
          );
        }
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se requiere tener bienes en el muestreo'
        );
      }
    });

    /*this.router.navigate([
      'pages/request/generate-monitoring-sampling/verify-noncompliance',
    ]); */
  }

  checkDeductives() {
    return new Promise((resolve, reject) => {
      this.params.getValue()['filter.sampleId'] = `$eq:${this.sampleId}`;
      this.samplingGoodService
        .getAllSampleDeductives(this.params.getValue())
        .subscribe({
          next: response => {
            resolve(response.data);
          },
          error: () => {
            resolve(false);
          },
        });
    });
  }

  updateSample(status: string) {
    return new Promise((resolve, reject) => {
      const sample: ISample = {
        sampleId: this.sampleId,
        sampleStatus: status,
      };

      this.samplingGoodService.updateSample(sample).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  async createTaskSample() {
    const user: any = this.authService.decodeToken();
    let body: any = {};

    body['type'] = 'MUESTREO_BIENES';
    body['subtype'] = 'Generar_muestreo';
    body['ssubtype'] = 'TURNAR';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = user.username;
    task['assigneesDisplayname'] = user.username;
    task['creator'] = user.username;
    task['reviewers'] = user.username;

    task['idSampling'] = this.sampleId;
    task['title'] = `Muestreo Bienes: Clasificación de Bienes ${this.sampleId}`;
    task['idDelegationRegional'] = this.sampleInfo.regionalDelegationId;
    task['idTransferee'] = this.sampleInfo.transfereeId;
    task['processName'] = 'Clasificar_bienes';
    task['urlNb'] = 'pages/request/assets-clasification';
    body['task'] = task;

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de Tarea Correcta',
        `Se creó la tarea Muestreo Bienes: Clasificación de Bienes: ${this.sampleId}`
      );
    }
  }

  createTaskOrderService(body: any) {
    console.log('body', body);

    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  msgGuardado(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
      }
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { ISamplingOrderService } from 'src/app/core/models/ms-order-service/sampling-order-service.model';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';

import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ZonesService } from 'src/app/core/services/zones/zones.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { AnnexKFormComponent } from '../../../generate-sampling-supervision/generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { EditDeductiveComponent } from '../../../generate-sampling-supervision/sampling-assets/edit-deductive/edit-deductive.component';
import { LIST_DEDUCTIVES_COLUMNS } from '../../../generate-sampling-supervision/sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { LIST_ORDERS_COLUMNS } from './columns/list-orders-columns';

@Component({
  selector: 'app-generate-query',
  templateUrl: './generate-query.component.html',
  styleUrls: ['./generate-query.component.scss'],
})
export class GenerateQueryComponent extends BasePage implements OnInit {
  @ViewChild('table', { static: false }) table: any;
  title: string = 'Genera Consulta';
  orderServiceForm: ModelForm<any>;
  geographicalAreaSelected = new DefaultSelect();
  contractNumberSelected = new DefaultSelect();
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;
  storeSelected: any = null;
  deductives: any = [];
  allDeductives: any = [];
  showSampleInfo: boolean = false;
  reloadInfo: boolean = false;
  sampleOrderForm: FormGroup = new FormGroup({});
  deductivesSel: IDeductive[] = [];
  sampleOrderId: number = 0;
  sampleOrderInfo: ISamplingOrder;
  sendData: any[] = [];
  params4 = new BehaviorSubject<ListParams>(new ListParams());
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
  //Datos Anexo para pasar
  dataAnnex: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private zoneGeoService: ZoneGeographicService,
    private zones: ZonesService,
    private orderService: OrderServiceService,
    private authService: AuthService,
    private deleRegService: RegionalDelegationService,

    private transferentService: TransferenteService,
    private samplingGoodService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService,
    private sanitizer: DomSanitizer,
    private wcontentService: WContentService,
    private taskService: TaskService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ORDERS_COLUMNS,
    };
    this.initForm();
    this.initAnexForm();
    this.getgeographicalAreaSelect(new ListParams());
    this.settings4.columns = LIST_DEDUCTIVES_COLUMNS;

    //this.newSampleOrder();
  }

  initForm() {
    this.orderServiceForm = this.fb.group({
      geographicalArea: [null],
      samplingPeriod: [null, [Validators.required]],
      contractNumber: [null, [Validators.required]],
    });
  }

  initAnexForm() {
    this.sampleOrderForm = this.fb.group({
      idSamplingOrder: [null],
      factsrelevant: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      downloadbreaches: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      datebreaches: [null, [Validators.required]],
      agreements: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      daterepService: [null, [Validators.required]],
      nameManagersoul: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
    });
  }

  getDelegReg() {
    const delegation = this.authService.decodeToken();
    return delegation.department;
  }

  async searchOrders() {
    const checkExistSampleOrder: any = await this.checkExistSampleOrder();
    if (checkExistSampleOrder) {
      const deductivesRelSample: any = await this.checkExistDeductives();
      if (deductivesRelSample == false) {
        this.getDeductivesNew();
      } else {
        this.params4
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getDeductives(deductivesRelSample));
      }
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
        this.getData();
      });
    }
  }

  getData() {
    this.loading = true;
    const deleReg = this.getDelegReg();
    const body = {
      contractNumber: this.orderServiceForm.value.contractNumber,
      pdDate: moment(this.orderServiceForm.value.samplingPeriod).format(
        'YYYY-MM-DD'
      ),
      regionalDelegationId: deleReg,
    };
    this.orderService
      .getSamplingOrderView(body, this.params.getValue())
      .subscribe({
        next: response => {
          const result = response.data.map(async (item: any) => {
            const delegation: any = await this.getDelegationRegional(
              item.regionalDelegation
            );
            const transferent: any = await this.getTransferentName(
              item.transferent
            );
            item['delegationName'] = delegation;
            item['transferentName'] = transferent;
            return item;
          });

          Promise.all(result).then(data => {
            this.paragraphs = data;
            this.totalItems = response.count;
            this.loading = false;
          });
        },
        error: error => {},
      });
  }

  getTransferentName(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(id).subscribe({
        next: response => {
          resolve(response.nameTransferent);
        },
      });
    });
  }

  async addOrders(): Promise<void> {
    if (this.selectedRows.length > 0) {
      const checkExistSampleOrder: any = await this.checkExistSampleOrder();
      if (checkExistSampleOrder) this.addOrdersToSample();
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Seleccione al menos una orden de servico'
      );
    }
  }

  checkExistSampleOrder() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      /*params.getValue()['filter.dateCreation'] = moment(new Date()).format(
        'YYYY-MM-DD'
      ); */
      params.getValue()['filter.periodSampling'] = moment(
        this.orderServiceForm.get('samplingPeriod').value
      ).format('YYYY-MM-DD');

      params.getValue()['filter.numberContract'] =
        this.orderServiceForm.get('contractNumber').value;
      this.orderService.getAllSampleOrder(params.getValue()).subscribe({
        next: response => {
          this.sampleOrderId = response.data[0].idSamplingOrder;
          response.data[0].dateCreation = moment(
            response.data[0].dateCreation
          ).format('DD/MM/YYYY');
          this.sampleOrderInfo = response.data[0];
          this.showSampleInfo = true;
          resolve(true);
        },
        error: async () => {
          const createOrder: any = await this.newSampleOrder();
          if (createOrder) resolve(true);
        },
      });
    });
  }

  addOrdersToSample() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea agregar las ordenes de servicio a el muestreo?'
    ).then(question => {
      if (question.isConfirmed) {
        this.selectedRows.map((item: any, i: number) => {
          let index = i + 1;
          const data: ISamplingOrderService = {
            orderServiceId: item.orderServiceId,
            sampleOrderId: this.sampleOrderId,
            creationDate: moment(new Date()).format('YYYY-MM-DD'),
            modificationDate: moment(new Date()).format('YYYY-MM-DD'),
            userCreation: this.authService.decodeToken().username,
            userModification: this.authService.decodeToken().username,
            version: 1,
          };

          this.orderService.createSamplingOrderService(data).subscribe({
            next: () => {
              if (this.selectedRows.length == index) {
                this.alert(
                  'success',
                  'Correcto',
                  'Ordenes se servicio agregadas al muestreo'
                );
                this.reloadInfo = true;
              }
            },
            error: () => {
              if (this.selectedRows.length == index) {
                this.alert(
                  'error',
                  'Error',
                  'No se pudo guardar la orden de servicio'
                );
              }
            },
          });
        });
      }
    });
  }

  rowsSelected(event: any) {
    this.selectedRows = event.selected;
  }

  getContractNumberSelect(numbContract: any) {
    this.contractNumberSelected = new DefaultSelect([numbContract]);
  }

  getgeographicalAreaSelect(params: ListParams) {
    this.zoneGeoService.getAll(params).subscribe({
      next: resp => {
        this.geographicalAreaSelected = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
      error: () => {
        this.geographicalAreaSelected = new DefaultSelect();
      },
    });
  }

  zoneGeographChange(event: any) {
    if (event == undefined) {
      this.geographicalAreaSelected = new DefaultSelect();
      this.contractNumberSelected = new DefaultSelect();
    } else {
      const value = { contractNumber: event.contractNumber };
      this.getContractNumberSelect(value);
    }
  }

  async openAnnexK() {
    const deductivesSelect = await this.checkDeductives();
    if (deductivesSelect) {
      const infoOrderSample: any = await this.getSampleOrder();
      if (infoOrderSample.idStore) {
        this.openModal(
          AnnexKFormComponent,
          '',
          'generate-query',
          this.storeSelected
        );
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Debe seleccionar un almacén para generar el Anexo K'
        );
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Selecciona una deductiva para firmar el anexo K'
      );
    }
  }

  async turnSampling() {
    if (this.sampleOrderId > 0) {
      const checkExistOrderInSample = await this.getSamplingOrder();
      if (checkExistOrderInSample) {
        const checkExistDeductives = await this.checkExistDeductives();
        if (checkExistDeductives) {
          if (this.sampleOrderInfo.idcontentk) {
            this.alertQuestion(
              'question',
              'Confirmación',
              '¿Esta seguro que la información es correcta para turnar?'
            ).then(question => {
              if (question.isConfirmed) {
                this.generateTask();
              }
            });
          } else {
            this.alert(
              'warning',
              'Advertencia',
              'Ha agregado deductivas al muestreo, debe generar el Anexo K'
            );
          }
        } else {
          this.alertQuestion(
            'question',
            'Confirmación',
            'No ha seleccionado alguna deductiva para las ordenes de servicio. ¿Esta de acuerdo que la información es correcta para Finalizar el muestreo?'
          ).then(async question => {
            if (question.isConfirmed) {
              /*const updateSampleOrder = await this.updateSampleOrder(
                'MUESTREO_TERMINA'
              ); */
            }
          });
        }
      } else {
        this.alert(
          'warning',
          'Advertencia',
          'Se requiere agregar una orden de servicio al muestreo'
        );
      }
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'Se requiere generar un muestreo de orden de servicio para continuar'
      );
    }
  }

  getSamplingOrder() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.sampleOrderId'] = `$eq:${this.sampleOrderId}`;
      this.orderService.getAllSamplingOrderService(params).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  updateSampleOrder(statusSample: string) {
    return new Promise((resolve, reject) => {
      const sampleOrder: ISamplingOrder = {
        idSamplingOrder: this.sampleOrderId,
      };
    });
  }

  async generateTask() {
    const user: any = this.authService.decodeToken();

    let body: any = {};

    body['userProcess'] = user.username;
    body['type'] = 'MUESTREO_ORDENES';
    body['subtype'] = 'verificar_almacen';
    body['ssubtype'] = 'TURNAR';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = user.username;
    task['assigneesDisplayname'] = user.username;
    task['creator'] = user.username;
    task['reviewers'] = user.username;

    task['idSamplingOrder'] = this.sampleOrderId;
    task[
      'title'
    ] = `Muestreo Ordenes de Servicio: Revisión Resultados ${this.sampleOrderId}`;
    task['idDelegationRegional'] = this.sampleOrderInfo.idDelegationRegional;
    task['idStore'] = this.sampleOrderInfo.idStore;
    task['processName'] = 'captura_resultados';
    task['urlNb'] =
      'pages/request/generate-sampling-service-orders/results-capture';
    body['task'] = task;

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de Tarea Correcta',
        `Muestreo Ordenes de Servicio: Revisión Resultados ${this.sampleOrderId}`
      );
    }
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: response => {
          console.log('response', response);
          resolve(true);
        },
        error: error => {
          console.log('error', error);
          resolve(false);
        },
      });
    });
  }

  openModal(
    component: any,
    data?: any,
    typeAnnex?: string,
    store?: any,
    annexData?: any
  ) {
    let config: ModalOptions = {
      initialState: {
        data: data,
        store: store,
        typeAnnex: typeAnnex,
        annexData: annexData,
        idSampleOrder: this.sampleOrderId,
        callback: (typeDocument: number, typeSign: string) => {
          if (typeDocument && typeSign) {
            this.showReportInfo(typeDocument, typeSign, 'sign-k-order-sample');
            //this.showReportInfo(
            //typeDocument,
            //typeSign,
            //'sign-annex-assets-classification'
            //);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }

  showReportInfo(typeDocument: number, typeSign: string, typeAnnex: string) {
    const idTypeDoc = typeDocument;
    const orderSampleId = this.sampleOrderId;
    const typeFirm = typeSign;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        orderSampleId,
        typeFirm,
        typeAnnex,
        callback: (next: boolean) => {
          if (next) {
            this.checkExistSampleOrder();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  getDelegationRegional(id: number) {
    return new Promise((resolve, reject) => {
      this.deleRegService.getById(id).subscribe({
        next: resp => {
          resolve(resp.description);
        },
      });
    });
  }

  newSampleOrder() {
    return new Promise((resolve, reject) => {
      const body: ISamplingOrder = {
        dateCreation: moment(new Date()).format('YYYY-MM-DD'),
        dateModification: moment(new Date()).format('YYYY-MM-DD'),
        userCreation: this.authService.decodeToken().username,
        userModification: this.authService.decodeToken().username,
        idDelegationRegional: +this.authService.decodeToken().department,
        dateturned: moment(new Date()).format('YYYY-MM-DD'),
        numberContract: this.orderServiceForm.get('contractNumber').value,
        periodSampling: moment(
          this.orderServiceForm.get('samplingPeriod').value
        ).format('YYYY-MM-DD'),
      };
      this.orderService.createSampleOrder(body).subscribe({
        next: resp => {
          this.sampleOrderId = resp.data.idSamplingOrder;
          resp.data.dateCreation = moment(resp.data.dateCreation).format(
            'DD/MM/YYYY'
          );
          this.sampleOrderInfo = resp.data;
          this.showSampleInfo = true;
          resolve(true);
        },
        error: () => {
          this.alert('error', 'Error', 'Error al crear la orden de muestreo');
          resolve(false);
        },
      });
    });
  }

  getStoreSelected(event: any) {
    this.storeSelected = event;
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

  getSampleOrder() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.idSamplingOrder'] = `$eq:${this.sampleOrderId}`;
      this.orderService.getAllSampleOrder(params).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
      });
    });
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
              orderSampleId: this.sampleOrderId,
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
                /*this.params2
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getGoods()); */
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

  checkExistDeductives() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.orderSampleId'] = `$eq:${this.sampleOrderId}`;
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

  deductivesSelect(event: any) {
    this.deductivesSel.push(event.selected[0]);
  }

  getSampleDeductives() {
    this.params.getValue()[
      'filter.orderSampleId'
    ] = `$eq:${this.sampleOrderId}`;
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

  getDeductivesNew() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.deductiveService.getAll(params.getValue()).subscribe({
      next: response => {
        this.paragraphsDeductivas.load(response.data);
      },
      error: error => {},
    });
  }

  checkDeductives() {
    return new Promise((resolve, reject) => {
      this.params.getValue()[
        'filter.orderSampleId'
      ] = `$eq:${this.sampleOrderId}`;
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

  showAnexK() {
    this.wcontentService.obtainFile(this.sampleOrderInfo.idcontentk).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PreviewDocumentsComponent, config);
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

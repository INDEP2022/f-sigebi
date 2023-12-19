import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
import { ISamplingOrderService } from 'src/app/core/models/ms-order-service/sampling-order-service.model';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { ZonesService } from 'src/app/core/services/zones/zones.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { AnnexKComponent } from '../annex-k/annex-k.component';
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
  sampleOrderForm: FormGroup = new FormGroup({});

  SampleOrderId: number = 0;
  sampleOrderInfo: ISamplingOrder;
  sendData: any[] = [];
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
    private samplinggoodService: SamplingGoodService,
    private transferentService: TransferenteService
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
      params.getValue()['filter.dateCreation'] = moment(new Date()).format(
        'YYYY-MM-DD'
      );
      params.getValue()['filter.periodSampling'] = moment(
        this.orderServiceForm.get('samplingPeriod').value
      ).format('YYYY-MM-DD');

      params.getValue()['filter.numberContract'] =
        this.orderServiceForm.get('contractNumber').value;
      this.orderService.getAllSampleOrder(params.getValue()).subscribe({
        next: response => {
          this.SampleOrderId = response.data[0].idSamplingOrder;
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
            sampleOrderId: this.SampleOrderId,
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

  openAnnexK() {
    this.deductives;
    const deductivesSelected = this.deductives.filter(
      (x: any) => x.selected == true
    );

    if (deductivesSelected.length == 0) {
      this.onLoadToast(
        'info',
        'Para generar el Anexo K es necesario seleccionar alguna deductiva'
      );
      return;
    }
    if (this.storeSelected == null) {
      this.onLoadToast(
        'info',
        'Debe seleccionar un almacén para generar el Anexo K'
      );
      return;
    }

    const annextForm = this.sampleOrderForm.getRawValue();
    this.openModal(
      AnnexKComponent,
      '',
      'generate-query',
      this.storeSelected,
      annextForm
    );
  }

  async turnSampling() {
    this.allDeductives = await this.getAllDeductives();
    const sampleOrder: any = await this.getSampleOrder();
    const totalDeductives = this.allDeductives.length;
    const noSelectedDeductives: any = this.allDeductives.filter(
      (x: any) => x.indDedictiva == 'N'
    ).length;
    let message = '';

    if (noSelectedDeductives == totalDeductives) {
      message =
        'No ha seleccionado alguna deductiva para las ordenes de servicio.';
    } else {
      if (sampleOrder.idcontentk == null) {
        this.onLoadToast(
          'info',
          'Ha agregado deductivas al muestreo, debe generar el Anexo K'
        );
        return;
      }
    }
    this.turnModal(message);
  }

  save() {}

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
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
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
        idSamplingOrder: 4,
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
          this.SampleOrderId = resp.data.idSamplingOrder;
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

  getDeductives(event: any) {
    this.deductives = event;
  }

  getAllDeductives() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.orderSampleId'] = `$eq:${this.SampleOrderId}`;
      this.samplinggoodService
        .getAllSampleDeductives(params)
        .pipe(
          catchError((e: any) => {
            if (e.status == 400) {
              return of({ data: [], count: 0 });
            }
            throw e;
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp.data);
          },
        });
    });
  }

  getSampleOrder() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.idSamplingOrder'] = `$eq:${this.SampleOrderId}`;
      this.orderService.getAllSampleOrder(params).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
      });
    });
  }

  turnModal(message: string) {
    Swal.fire({
      title: 'Confirmación',
      html:
        'Esta seguro de enviar la información a turnar? <br/><br/>' +
        `<p style="color:red;">${message}<p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        let lsEstatusMuestreo = '';
        if (message == null || message == '') {
          lsEstatusMuestreo = 'MUESTREO_NO_CUMPLE';
        } else {
          lsEstatusMuestreo = 'MUESTREO_TERMINA';
        }
        const lsDelReg = '';
        const lsUsuario = '';
        const lsUsuarioSAE = '';

        Swal.fire('Turnado', 'El muestreo fue turnado', 'success');
      }
    });
  }
}

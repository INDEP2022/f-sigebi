import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
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

  sampleOrderForm: FormGroup = new FormGroup({});
  /**
   * La orden de servicio se crea en una vista anterior
   * se utiliza para crear le muestreo orden servicio
   * se utiliza para crear deductivas
   */
  SampleOrderId: number = 3;

  sendData: any[] = [];
  //Datos Anexo para pasar
  dataAnnex: any;

  private zoneGeoService = inject(ZoneGeographicService);
  private zones = inject(ZonesService);
  private orderService = inject(OrderServiceService);
  private authService = inject(AuthService);
  private deleRegService = inject(RegionalDelegationService);
  private samplinggoodService = inject(SamplingGoodService);

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
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

    //obtener muestreo orden
    //create a muestreo de orden solo una ves cuando se inicializa el componente
    //this.newSampleOrder();
  }

  initForm() {
    this.orderServiceForm = this.fb.group({
      geographicalArea: [null],
      samplingPeriod: [null],
      contractNumber: ['SAE/00084/2018'],
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

  searchOrders() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData(data);
    });
  }

  getData(params: ListParams) {
    this.loading = true;
    const deleReg = this.getDelegReg();
    const body = {
      contractNumber: this.orderServiceForm.value.contractNumber,
      pdDate: moment(this.orderServiceForm.value.samplingPeriod).format(
        'YYYY-MM-DD'
      ),
      regionalDelegationId: deleReg,
    };
    const page = params.page;
    const limit = params.limit;
    this.orderService
      .getSamplingOrderView(body, page, limit)
      .pipe(
        catchError((e: any) => {
          if (e.status == 400) return of({ data: [], count: 0 });
          return e;
        })
      )
      .subscribe({
        next: resp => {
          const result = resp.data.map(async (item: any) => {
            const delegation: any = await this.getDelegationRegional(
              item.regionalDelegation
            );
            item['delegationName'] = delegation;
          });

          Promise.all(result).then(() => {
            this.paragraphs = resp.data;
            this.totalItems = resp.count;
            this.loading = false;
          });
        },
      });
  }

  addOrders(): void {
    if (this.selectedRows.length == 0) {
      this.onLoadToast('info', 'Seleccione al menos una orden de servicio');
      return;
    }
    this.sendData = this.selectedRows;
    setTimeout(() => {
      this.selectedRows = [];
      const table = this.table.grid.getRows();
      for (let i = 0; i < table.length; i++) {
        const element = table[i];
        element.isSelected = false;
      }
    }, 500);
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
        console.log(resp);
        this.geographicalAreaSelected = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
    });
  }

  zoneGeographChange(event: any) {
    if (event == undefined) {
      this.geographicalAreaSelected = new DefaultSelect();
      this.contractNumberSelected = new DefaultSelect();
    } else {
      console.log(event);
      const value = { contractNumber: event.contractNumber };
      this.getContractNumberSelect(value);
    }
  }

  openAnnexK() {
    this.deductives;
    const deductivesSelected = this.deductives.filter(
      (x: any) => x.selected == true
    );
    console.log(deductivesSelected);

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
    const body: ISamplingOrder = {
      idSamplingOrder: 3,
      dateCreation: moment(new Date()).format('YYYY-MM-DD'),
      dateModification: moment(new Date()).format('YYYY-MM-DD'),
      userCreation: this.authService.decodeToken().username,
      userModification: this.authService.decodeToken().username,
      idDelegationRegional: +this.authService.decodeToken().department,
      dateturned: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.orderService.createSampleOrder(body).subscribe({
      next: resp => {
        console.log(resp);
        this.SampleOrderId = resp.data.id;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getStoreSelected(event: any) {
    console.log(event);
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

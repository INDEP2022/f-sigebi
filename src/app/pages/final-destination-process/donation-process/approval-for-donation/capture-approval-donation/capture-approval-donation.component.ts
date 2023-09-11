import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';

import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { ModalApprovalDonationComponent } from './../modal-approval-donation/modal-approval-donation.component';
import { COPY } from './columns-approval-donation';
@Component({
  selector: 'app-capture-approval-donation',
  templateUrl: './capture-approval-donation.component.html',
  styles: [
    `
      @media screen and (max-width: 767px) {
        #column {
          border-right: 0px !important;
        }
      }
    `,
  ],
})
export class CaptureApprovalDonationComponent
  extends BasePage
  implements OnInit
{
  regisForm: FormGroup;
  siabForm: FormGroup;
  foolio: number;
  loading3: boolean = false;
  Exportdate: boolean = false;
  status: string = '';
  selectedGooodsValid: any[] = [];
  totalItems2: number = 0;
  dataDetailDonation: any;
  dataDetailDonationGood: LocalDataSource = new LocalDataSource();

  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());

  bsValueToYear: Date = new Date();

  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;

  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  estatus: string;
  selectedRow: IGood;
  fileNumber: number = 0;
  columnFilters: any = [];
  columnFilters2: any = [];

  settings2;
  userName: string = '';
  // @Input() getDetailComDonation: Function;
  // @Input() idActa: number | string;
  type = 'COMPDON';
  eventDonacion: IGoodDonation;
  origin = 'FMCOMDONAC_1';
  donationGood: IGoodDonation;
  paramsScreen: IParamsDonac = {
    origin: '',
    recordId: '',
    area: '',
  };
  data = EXAMPLE_DATA;
  info = [
    {
      id: 0,
      title: 'CONSULTA BIENES',
      color: 'grey',
    },
    {
      id: 1,
      title: 'COM. EXTERIOR KG',
      color: 'brackground-color: green',
    },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private donationService: DonationService
  ) {
    super();
    // this.settings = { ...this.settings, actions: false };
    // this.settings.columns = COLUMNS_APPROVAL_DONATION;
    // this.settings = {
    //   ...this.settings,
    //   hideSubHeader: false,
    //   actions: false,
    //   columns: { ...COLUMNS_APPROVAL_DONATION },
    //   noDataMessage: 'No se encontrarón registros',
    // };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      // selectedRowIndex: -1,
      // mode: 'external',
      columns: {
        ...COPY,
      },
      rowClassFunction: (row: any) => {
        return 'bg-light text-black';
      },
      // noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsScreen.recordId = paramsQuery['recordId'] ?? null;
        // this.paramsScreen.cveEvent = paramsQuery['cveEvent'] ?? null;
        this.paramsScreen.area = paramsQuery['area'] ?? null;
        if (this.origin == 'FMCOMDONAC_1') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
        }
        if (
          this.origin != null &&
          this.paramsScreen.recordId != null &&
          this.paramsScreen.area != null
        ) {
          console.log(this.paramsScreen);
        }
      });
    this.getComerDonation();
    this.configDatePicker();
    this.initForm();
    this.regisForm.get('type').setValue(this.type);
  }

  initForm() {
    this.regisForm = this.fb.group({
      type: [null, []],
      area: [null, [Validators.pattern(STRING_PATTERN)]],
      year: [this.bsValueToYear, []],
      folio: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(4)],
      ],
      captureDate: [null, []],
      keyEvent: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
    this.regisForm.get('area').setValue(this.paramsScreen.area);
  }
  // lv_TRAN      Varchar2(4);
  // lv_TIPO      Varchar2(4);
  // lv_AREA      Varchar2(10);
  // lv_CONS      Varchar2(10);
  // lv_TIPO_ACTA INDICADORES_PARAMETRO.TIPO_ACTA% type;
  // lv_FOLIO     Number;

  createDon(donationGood: IGoodDonation) {
    this.loading = true;
    const folio = this.regisForm.value.folio;
    const acta = this.regisForm.value.type;
    let year = this.regisForm.value.year;
    const area = this.regisForm.value.area;
    let folio_ = folio.toString().padStart(4, '0');
    this.foolio = folio_;

    // this.eventComDonacion.cveActa =
    //   this.eventComDonacion.tipo +
    //   '/' +
    //   this.global.regi +
    //   '/' +
    //   this.eventComDonacion.anio +
    //   '/' +
    //   this.global.cons;

    const cveActa = `${acta}/${area}/${year}/${folio_}/${this.type}`;
    console.log('cveActa -->', cveActa);
    this.donationService.createD(donationGood).subscribe({
      next: resp => {
        console.log('guardado');
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  getComerDonation() {
    const params = new ListParams();
    params['filter.actId'] = this.paramsScreen.recordId;
    this.donationService.getEventComDonation(params).subscribe({
      next: (data: any) => {
        this.eventDonacion = data;
        this.fileNumber = data.fileNumber;
        this.estatus = data.estatusAct;
        console.log(this.eventDonacion);
        this.getDetailDonation();
      },
      error: () => {
        console.error('error');
      },
    });
  }

  ubicaGood() {
    if (this.eventDonacion.estatusAct === 'CERRADA') {
      this.alert(
        'warning',
        'El Evento está cerrado, no se pueden consultar bienes',
        ''
      );
      return;
    } else {
      this.alertQuestion('warning', '', '¿Desea continuar con  proceso?').then(
        question => {
          if (question.isConfirmed) {
            this.consultgoods();
          } else {
            // goBlock('DETALLE_EVENT_COM_DON');
            if (this.dataDetailDonation.noBien === null) {
              this.alert('warning', 'No hay bienes a validar.', '');
            } else {
              // PUP_CARGA_BIENES;
            }
          }
        }
      );
    }
  }
  eventdetailDefault: any = null;
  consultgoods(provider?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };

    let modalRef = this.modalService.show(
      ModalApprovalDonationComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any[]) => {
      console.log('aaaa', next);

      // this.dataTableGood.load(next);
      // this.dataTableGood.refresh();
      this.eventdetailDefault = next;
      // this.status = next.statusAct;
    });
  }

  configDatePicker() {
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.minModeToYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onSubmit() {}

  openModal(title: string, op: string, subTitle: string = '') {
    const initialState: ModalOptions = {
      initialState: {
        title,
        op,
        subTitle,
      },
    };
    this.bsModalRef = this.modalService.show(
      ModalApprovalDonationComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  goBackDonation() {
    this.router.navigate(['/pages/general-processes/scan-documents'], {
      queryParams: {
        // origin: this.origin,
        // acta: this.actaRecepttionForm.get('type').value,
      },
    });
  }
  ValidGoods(): void {
    console.log('this.bienes1 -->');

    //   if (this.dataRecepcion.length === 0) {
    //     this.alertInfo('warning', 'No Hay Ningún Bien a Comparar', '');
    //     return;
    //   }

    //   this.contador = 0;
    //   this.vTotalB = '';

    //   for (const bien of this.dataRecepcion) {
    //     console.log('entra al for ', bien);
    //     if (bien != null) {
    //       console.log('Entra al if y al for');
    //       this.contador++;

    //       if (this.contador === 1) {
    //         this.vTotalB = bien.numberGood.toString();
    //       } else {
    //         this.vTotalB = bien.numberGood + ', ' + this.vTotalB;
    //       }
    //     }
    //   }

    //   console.log('this.bienes -->', this.dataRecepcion);
    //   console.log('Contador ', this.contador);

    //   if (this.contador > 0) {
    //     this.onLoadToast(
    //       'success',
    //       'Se Encontraron ' + this.contador + ' No. Bien',
    //       'Que Son: ' + this.vTotalB
    //     );
    //     console.log('SE ENCONTRARON:', this.contador, 'QUE SON:', this.vTotalB);
    //   } else {
    //     this.alertInfo('warning', 'No Existe el Bien de Gastos', '');
    //   }
  }
  getDetailDonation() {
    const params = new ListParams();
    params['filter.recordId'] = this.paramsScreen.recordId;
    this.donationService.getEventComDonationDetail(params).subscribe({
      next: data => {
        console.log(data);
      },
      error: () => console.error('no hay detalle acta'),
    });
  }
  async getDetailProceedingsDevollution(id: any) {
    this.loading3 = true;

    let params: any = {
      ...this.paramsList2.getValue(),
      ...this.columnFilters2,
    };
    params['filter.recordId'] = this.paramsScreen.recordId;
    return new Promise((resolve, reject) => {
      this.donationService.getEventComDonationDetail(params).subscribe({
        next: data => {
          let result = data.data.map((item: any) => {
            item['description'] = item.good ? item.good.description : null;
          });

          Promise.all(result).then(item => {
            this.dataDetailDonation = data.data;
            this.dataDetailDonationGood.load(this.dataDetailDonation);
            this.dataDetailDonationGood.refresh();
            this.totalItems2 = data.count;
            console.log('data', data);
            this.loading3 = false;
            this.Exportdate = true;
            //this.disabledBtnEscaneo = true;
          });
        },
        error: error => {
          this.dataDetailDonation = [];
          this.dataDetailDonationGood.load([]);
          this.loading3 = false;
        },
      });
    });
  }
  rowsSelected(event: any) {
    this.selectedGooodsValid = event.selected;
  }
  exportToExcel() {}
  agregarCaptura() {}
  searchEventos() {}
  cerrarEvento() {}
  clean() {}
}

const EXAMPLE_DATA = [
  {
    ref: 1,
    goods: 33321,
    goodsDescrip: 'Bien Integrado',
    quantity: 7,
    unit: 'KILOGRAMO',
    status: 'ADM',
    proceedings: 1245454,
    targetTag: 'DONACION',
    transfNumb: 120,
    desTransf: 'SAT',
    clasifNumb: 778,
    process: 'TRANSFERENT',
    warehouseNumb: 28730,
    warehouse: 'DRCS ALMA',
    warehouseLocat: 'DCRS ALMA',
    coordAdmin: 'DELELGACIÓN REG.',
  },
];

export interface IParamsDonac {
  origin: string;
  recordId: string;
  area: string;
}

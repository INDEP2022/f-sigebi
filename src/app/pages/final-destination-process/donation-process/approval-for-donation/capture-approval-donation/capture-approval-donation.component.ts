import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ModalApprovalDonationComponent } from './../modal-approval-donation/modal-approval-donation.component';
import { COLUMNS_APPROVAL_DONATION } from './columns-approval-donation';
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
  dataTableGood_: any[] = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  dataTableGood: LocalDataSource = new LocalDataSource();
  bsValueToYear: Date = new Date();
  goods: IGood[] = [];
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  estatus: string;
  selectedRow: IGood;
  columnFilters: any = [];
  columnFilters2: any = [];
  statusGood_: any;
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
    private GoodprocessService_: GoodprocessService,
    private statusGoodService: StatusGoodService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private donationService: DonationService
  ) {
    super();
    // this.settings = { ...this.settings, actions: false };
    // this.settings.columns = COLUMNS_APPROVAL_DONATION;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS_APPROVAL_DONATION },
      noDataMessage: 'No se encontrarón registros',
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
    // this.openModal('Seleccione el Área a Trabajar', 'select-area');
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

  getComerDonation() {
    const params = new ListParams();
    params['filter.actId'] = this.paramsScreen.recordId;
    this.donationService.getEventComDonation(params).subscribe({
      next: (data: any) => {
        this.eventDonacion = data;
        this.getGoodsByStatus(data.fileNumber);
        this.estatus = data.estatusAct;
        console.log(this.eventDonacion);
        this.getDetailDonation();
      },
      error: () => {
        console.error('error');
      },
    });
  }

  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  addSelect() {}
  addAll() {}
  removeAll() {}
  removeSelect() {}

  async selectData(event: { data: IGood; selected: any }) {
    this.selectedRow = event.data;
    // console.log('select RRR', this.selectedRow);

    await this.getStatusGoodService(this.selectedRow.status);
    this.selectedGooods = event.selected;
    this.changeDetectorRef.detectChanges();
  }
  async getStatusGoodService(status: any) {
    this.statusGoodService.getById(status).subscribe({
      next: async (resp: any) => {
        console.log('datapruebaJess', resp);
        this.statusGood_ = resp.description;
        // this.statusGoodForm.get('statusGood').setValue(resp.description)
      },
      error: err => {
        this.statusGood_ = '';
        // this.statusGoodForm.get('statusGood').setValue('')
      },
    });
  }

  getGoodsByStatus(id: number) {
    this.loading = true;
    this.dataTableGood_ = [];
    this.dataTableGood.load(this.dataTableGood_);
    this.dataTableGood.refresh();
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    // console.log('1412212', params);
    params['sortBy'] = `goodId:DESC`;
    this.donationService.getEventComDonationDetail(params).subscribe({
      next: data => {
        this.goods = data.data;

        // console.log('Bienes', this.bienes);

        let result = data.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FMCOMDONAC_1',
            pNumberGood: item.goodId,
          };
          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          if (item.recordId) {
            item.di_disponible = 'N';
          }
          item['quantity'] = item.amount;
          item['di_acta'] = item.recordId;
          item['id'] = item.goodId;
          // const acta: any = await this.getActaGoodExp(item.id, item.fileNumber);
          // // console.log('acta', acta);
          // item['acta_'] = acta;
        });

        Promise.all(result).then(item => {
          this.dataTableGood_ = this.goods;
          this.dataTableGood.load(this.goods);
          this.dataTableGood.refresh();
          // Define la función rowClassFunction para cambiar el color de las filas en función del estado de los bienes
          this.totalItems = data.count;
          this.loading = false;
          // // console.log(this.bienes);
        });
      },
      error: error => {
        this.loading = false;
        this.dataTableGood.load([]);
        this.dataTableGood.refresh();
        this.totalItems = 0;
      },
    });
  }
  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.GoodprocessService_.getScreenGood(body).subscribe({
        next: async (state: any) => {
          if (state.data) {
            // console.log('di_disponible', state);
            resolve('S');
          } else {
            // console.log('di_disponible', state);
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
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
  exportToExcel() {}
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

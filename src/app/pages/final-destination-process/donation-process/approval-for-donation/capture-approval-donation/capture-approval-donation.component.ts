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
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
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
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
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
  dataTableGood_: any[] = [];
  Exportdate: boolean = false;
  status: string = '';
  loading2: boolean = false;
  totalItems2: number = 0;
  dataDetailDonation: any;
  dataDetailDonationGood: LocalDataSource = new LocalDataSource();
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
  fileNumber: number = 0;
  columnFilters: any = [];
  columnFilters2: any = [];
  statusGood_: any;
  settings2;
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
    // this.settings = {
    //   ...this.settings,
    //   hideSubHeader: false,
    //   actions: false,
    //   columns: { ...COLUMNS_APPROVAL_DONATION },
    //   noDataMessage: 'No se encontrarón registros',
    // };
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      // selectMode: 'multi',
      selectedRowIndex: -1,
      mode: 'external',
      // columns: { ...GOODSEXPEDIENT_COLUMNS_GOODS },
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelectedValid(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelectValid(instance),
        },
        recordId: {
          title: 'Ref.',
          type: 'number',
          sort: false,
        },
        goodNumber: {
          title: 'No. Bien',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good.goodNumber;
          },
        },
        description: {
          title: 'Descripción del Bien',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.description;
          },
        },
        quantity: {
          title: 'Cantidad',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.quantity;
          },
        },
        unit: {
          title: 'Unidad',
          type: 'string',
          sort: false,
        },
        status: {
          title: 'Estatus',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.status;
          },
        },
        noExpediente: {
          title: 'No. Expediente',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.noExpediente;
          },
        },
        noEtiqueta: {
          title: 'Etiqueta Destino',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.noEtiqueta;
          },
        },
        idNoWorker1: {
          title: 'No. Tranf.',
          type: 'string',
          sort: false,
          // valuePrepareFunction: (cell: any, row: any) => {
          //   return row.proceeding?.idNoWorker1;
          // },
        },
        idExpWorker1: {
          title: 'Des. Tranf.',
          type: 'string',
          sort: false,
          // valuePrepareFunction: (cell: any, row: any) => {
          //   return row.proceeding?.idExpWorker1;
          // },
        },
        noClasifBien: {
          title: 'No. Clasif.',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.noClasifBien;
          },
        },
        procesoExtDom: {
          title: 'Proceso',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.procesoExtDom;
          },
        },
        // warehouseNumb: {
        //   title: 'No. Alma.',
        //   type: 'number',
        //   sort: false,
        // },
        // warehouse: {
        //   title: 'Almacén',
        //   type: 'string',
        //   sort: false,
        // },
        // warehouseLocat: {
        //   title: 'Ubica. Almacén ',
        //   type: 'string',
        //   sort: false,
        // },
        // coordAdmin: {
        //   title: 'Coord. Admin.',
        //   type: 'string',
        //   sort: false,
        // },
        // select: {
        //   title: 'Selec.',
        //   type: 'custom',
        //   renderComponent: CheckboxElementComponent,
        //   onComponentInitFunction(instance: any) {
        //     instance.toggle.subscribe((data: any) => {
        //       data.row.to = data.toggle;
        //     });
        //   },
        //   sort: false,
        // },
        // noDataMessage: 'No se encontrarón registros',
      },
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
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
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }
  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
      console.log(this.selectedGooods);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }
  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
      console.log(this.selectedGooodsValid);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
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
    this.loading2 = true;

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
            this.loading2 = false;
            this.Exportdate = true;
            //this.disabledBtnEscaneo = true;
          });
        },
        error: error => {
          this.dataDetailDonation = [];
          this.dataDetailDonationGood.load([]);
          this.loading2 = false;
        },
      });
    });
  }
  rowsSelected(event: any) {
    this.selectedGooodsValid = event.selected;
  }

  getComerDonation() {
    const params = new ListParams();
    params['filter.actId'] = this.paramsScreen.recordId;
    this.donationService.getEventComDonation(params).subscribe({
      next: (data: any) => {
        this.eventDonacion = data;
        this.fileNumber = data.fileNumber;
        this.getGoodsByStatus(this.fileNumber);
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
  addAll() {
    if (this.eventdetailDefault == null) {
      this.alert(
        'warning',
        'No existe un Acta en la cual Asignar el Bien.',
        'Debe capturar un acta.'
      );
      return;
    } else {
      if (this.status == 'CERRADA') {
        this.alert(
          'warning',
          'El Acta ya esta Cerrada, no puede Realizar Modificaciones a esta',
          ''
        );
        return;
      } else {
        if (this.dataTableGood_.length > 0) {
          this.loading2 = true;
          let result = this.dataTableGood_.map(async _g => {
            // console.log(_g);

            if (_g.di_disponible == 'N') {
              return;
            }

            if (_g.di_disponible == 'S') {
              _g.di_disponible = 'N';
              let valid = this.dataDetailDonation.some(
                (goodV: any) => goodV.goodId == _g.id
              );

              this.Exportdate = true;
              // await this.updateBienDetalle(_g.id, 'ADM');
              await this.createDET(_g);
            }
          });
          Promise.all(result).then(async item => {
            this.getGoodsByStatus(Number(this.eventDonacion.fileId));
            await this.getDetailProceedingsDevollution(
              this.eventdetailDefault.id
            );
            //this.actasDefault = null;
          });
        }
      }
    }
  }
  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      numberProceedings: this.eventdetailDefault.id,
      numberGood: good.goodNumber,
      amount: good.quantity,
      received: null,
      approvedXAdmon: null,
      approvedDateXAdmon: null,
      approvedUserXAdmon: null,
      dateIndicatesUserApproval: null,
      numberRegister: null,
      reviewIndft: null,
      correctIndft: null,
      idftUser: null,
      idftDate: null,
      numDelegationIndft: null,
      yearIndft: null,
      monthIndft: null,
      idftDateHc: null,
      packageNumber: null,
      exchangeValue: null,
    };

    await this.saveGoodDetail(obj);

    // let obj_: any = {
    //   id: good.id,
    //   goodId: good.id,
    //   status: await this.getScreenStatus(good),
    // };
    // // UPDATE BIENES
  }
  async saveGoodDetail(body: any) {
    return new Promise((resolve, reject) => {
      this.donationService.createAdmonDonation(body).subscribe({
        next: data => {
          // this.alert('success', 'Bien agregado correctamente', '');
          resolve(true);
          this.Exportdate = true;
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }
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
    params['filter.recordId'] = this.paramsScreen.recordId;
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
      // this.eventdetailDefault = next;
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

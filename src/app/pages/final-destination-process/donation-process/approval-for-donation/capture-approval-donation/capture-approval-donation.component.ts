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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';

import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
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
  statusGood_: any;
  dataTableGood_: any[] = [];
  totalItems: number = 0;
  loading3: boolean = false;
  Exportdate: boolean = false;
  status: string = '';
  totalItems2: number = 0;
  dataDetailDonation: any;
  dataDetailDonationGood: LocalDataSource = new LocalDataSource();
  excelLoading: boolean = false;
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  bsValueToYear: Date = new Date();
  TOTAL_REPORTE: number = 0;
  BIEN_ERROR: number = 0;
  SUM_BIEN: number = 0;
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  dataTableGood: LocalDataSource = new LocalDataSource();
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
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef,
    private statusGoodService: StatusGoodService
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
        proposalKey: {
          title: 'Ref.',
          type: 'number',
          sort: false,
        },
        goodNumber: {
          title: 'No. Bien',
          type: 'number',
          sort: false,
        },
        description: {
          title: 'Descripción del Bien',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.description;
          },
        },
        quantity: {
          title: 'Cantidad',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.quantity;
          },
        },
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

  createDon(donationGood: IGoodDonation) {
    this.loading = true;
    const folio = this.regisForm.value.folio;
    const acta = this.regisForm.value.type;
    let year = this.regisForm.value.year;
    const area = this.regisForm.value.area;
    let folio_ = folio.toString().padStart(4, '0');
    this.foolio = folio_;
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
    modalRef.content.onSave.subscribe((next: any[] = []) => {
      console.log('aaaa', next);
      this.selectedGooodsValid = next;
      this.addSelect();
      this.dataDetailDonationGood.load(next);
      this.dataDetailDonationGood.refresh();

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
        this.dataDetailDonation = data.data;
        this.dataDetailDonationGood.load(this.dataDetailDonation);
        this.dataDetailDonationGood.refresh();
        this.totalItems2 = data.count;
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

  exportToExcel(): void {
    this.excelLoading = true;
    if (this.dataDetailDonationGood != null) {
      this.donationService.getExcel().subscribe({
        next: data => {
          this.excelLoading = false;
          this.alert(
            'warning',
            'El archivo se esta generando, favor de esperar la descarga',
            ''
          );
          // this.fullService.generatingFileFlag.next({
          //   progress: 99,
          //   showText: true,
          // });
          // console.log(response.data)
          this.downloadDocument('-Detalle-Donacion', 'excel', data.base64File);
          // this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
        },
      });
    } else {
      this.excelLoading = false;
      this.alert('warning', 'No hay Datos para Exportar', '');
    }
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.excelLoading = true;
    this.alert('success', 'El Reporte se ha Descargado', '');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // this.fullService.generatingFileFlag.next({
    //   progress: 100,
    //   showText: false,
    // });

    return bytes.buffer;
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
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  async addSelect() {
    if (this.selectedGooods.length > 0) {
      if (this.dataDetailDonation.recordId == null) {
        this.alert(
          'warning',
          'No Existe un Acta en la cual Asignar el Bien.',
          'Debe capturar un acta.'
        );
        return;
      } else {
        if (this.estatus == 'CERRADA') {
          this.alert(
            'warning',
            'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
            ''
          );
          return;
        } else {
          // console.log('aaa', this.goods);
          let result = this.selectedGooods.map(async (good: any) => {
            if (good.di_acta != null) {
              this.alert(
                'warning',
                `Ese Bien ya se Encuentra en el Acta ${good.di_acta}`,
                'Debe Capturar un Acta.'
              );
            } else if (good.di_disponible == 'N') {
              this.onLoadToast(
                'warning',
                `El Bien ${good.id} tiene un Estatus Inválido para ser Asignado a algún Acta`
              );
              return;
            } else {
              // console.log('GOOD', good);
              this.loading = true;

              if (!this.dataDetailDonation.some((v: any) => v === good)) {
                let indexGood = this.dataTableGood_.findIndex(
                  _good => _good.id == good.id
                );

                this.Exportdate = true;
                console.log('indexGood', indexGood);
                if (indexGood != -1)
                  this.dataTableGood_[indexGood].di_disponible = 'N';
                // await this.updateBienDetalle(good.id, 'ADM');
                await this.createDET(good);
              }
            }
          });
          Promise.all(result).then(async item => {
            //ACTUALIZA EL COLOR
            this.dataTableGood_ = [];
            this.dataDetailDonationGood.load(this.dataTableGood_);
            this.dataDetailDonationGood.refresh();
            await this.getDetailProceedingsDevollution(
              this.dataDetailDonation.recordId
            );
          });
          //this.actasDefault = null;
        }
      }
    }
    // else {
    //   this.alert('warning', 'Seleccione Primero el Bien a Asignar.', '');
    // }
  }
  removeSelect() {
    if (this.estatus == 'CERRADA') {
      this.alert(
        'warning',
        'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
        ''
      );
      return;
    } else {
      // console.log('this.actasDefault ', this.actasDefault);

      if (this.dataDetailDonation == null) {
        this.alert(
          'warning',
          'Debe Especificar/Buscar el Acta para Despues Eliminar el Bien de Esta.',
          ''
        );
        return;
      } else if (this.selectedGooodsValid.length == 0) {
        this.alert(
          'warning',
          'Debe Seleccionar un Bien que Forme Parte del Acta Primero',
          'Debe Capturar un Acta.'
        );
        return;
      } else {
        this.loading = true;
        if (this.selectedGooodsValid.length > 0) {
          // this.goods = this.goods.concat(this.selectedGooodsValid);
          let result = this.selectedGooodsValid.map(async good => {
            console.log('good', good);
            this.dataDetailDonation = this.dataDetailDonation.filter(
              (_good: any) => _good.id != good.id
            );
            let index = this.dataTableGood_.findIndex(
              g => g.id === good.numberGood
            );
            // await this.updateBienDetalle(good.numberGood, 'CNE');
            // await this.deleteDET(good);
            // this.selectedGooods = [];
            //ACTUALIZA COLOR
            this.dataTableGood_ = [];
            this.dataTableGood.load(this.dataTableGood_);
            this.dataTableGood.refresh();
          });

          Promise.all(result).then(async item => {
            await this.getDetailProceedingsDevollution(
              this.dataDetailDonation.recordId
            );
            // this.getGoodsByStatus(Number(this.fileNumber));
          });
          this.Exportdate = false;
          this.selectedGooodsValid = [];
        }
      }
    }
  }

  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      numberProceedings: this.paramsScreen.recordId,
      numberGood: good.goodId,
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
  }
  async saveGoodDetail(body: any) {
    return new Promise((resolve, reject) => {
      this.donationService.createAdmonDonation(body).subscribe({
        next: data => {
          // this.alert('success', 'Bien agregado correctamente', '');
          resolve(true);
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }
  removeAll() {}

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

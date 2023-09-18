import { DatePipe } from '@angular/common';
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
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { CreateActaComponent } from '../create-acta/create-acta.component';
import { FindActaComponent } from '../find-acta/find-acta.component';
import { ModalApprovalDonationComponent } from './../modal-approval-donation/modal-approval-donation.component';
import { COPY } from './columns-approval-donation';
interface NotData {
  id: number;
  reason: string;
}
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
  ngGlobal: any;
  delete: boolean = true;
  deleteG: boolean = true;
  goods: any[] = [];
  dataTableGood_: any[] = [];
  totalItems: number = 0;
  loading3: boolean = false;
  Exportdate: boolean = false;
  status: string = '';
  idAct: number = 0;
  disabledBtnActas: boolean = true;
  totalItems2: number = 0;
  activeRadio: boolean = true;
  cveActa: string = '';
  goodError: IDonationGoodError[];
  dataDetailDonation: any;
  data1: any;
  data: LocalDataSource = new LocalDataSource();
  consec: string = '';
  idsNotExist: NotData[] = [];
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
  origin2: 'FCONGENRASTREADOR';
  fileNumber: number = 0;
  columnFilters: any = [];
  columnFilters2: any = [];
  settings2;
  to: string = '';
  annio: string = '';
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodService: GoodService,
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef,
    private statusGoodService: StatusGoodService,
    private datePipe: DatePipe,
    private usersService: UsersService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private globalVarService: GlobalVarsService
  ) {
    super();

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
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES) {
            console.log('GLOBAL ', this.ngGlobal.REL_BIENES);
          }
        },
      });
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
          this.origin2 = paramsQuery['origin2'] ?? null;
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
      observaElimina: [null],
      observaciones: [null],
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
    this.idAct = Number(this.paramsScreen.recordId.match(/[0-9]+/)[0]);
    this.donationService.getByIdEvent(this.idAct).subscribe({
      next: (data: any) => {
        this.eventDonacion = data;
        this.fileNumber = data.fileNumber;
        this.estatus = data.estatusAct;
        console.log(this.eventDonacion);
        if (this.estatus != 'ABIERTA') {
          this.delete = false;
          // this.generarClave(this.regisForm.value.area, )
        }
        const ultimosCincoDigitos = data.cveAct.slice(-5);
        const anio = parseInt(ultimosCincoDigitos.substring(0, 2), 10);
        const mesNumero = parseInt(ultimosCincoDigitos.substring(3, 5), 10);
        if (
          isNaN(anio) ||
          isNaN(mesNumero) ||
          anio < 0 ||
          mesNumero < 1 ||
          mesNumero > 12
        ) {
          return null;
        }

        const mesesTexto = [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ];

        const mesTexto = mesesTexto[mesNumero - 1];
        const fechaActual = new Date();
        const sigloActual = Math.floor(fechaActual.getFullYear() / 100) * 100;
        const anioCompleto = anio < 100 ? sigloActual + anio : anio;
        this.regisForm.get('year').setValue(anioCompleto);
        this.regisForm.get('folio').setValue(data.folioUniversal);
        this.regisForm.get('keyEvent').setValue(data.cveAct);
        this.regisForm.get('captureDate').setValue(mesTexto);
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

  generarClave(lvArea: number, lvCons: number, anio: number): string {
    // Validamos que los datos sean del tipo correcto
    // if (typeof lvArea !== "number" || typeof lvCons !== "number" || typeof anio !== "number") {
    //   throw new Error("Los datos ingresados no son del tipo correcto");
    // }
    const clave = `${lvArea.toString().padStart(2, '0')}${lvCons
      .toString()
      .padStart(4, '0')}${anio.toString().padStart(4, '0')}`;
    return clave;
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
        this.totalItems = data.count;
        this.TOTAL_REPORTE = this.totalItems;
        this.SUM_BIEN = this.dataDetailDonation.reduce(
          (accumulator: any, object: any) => {
            return accumulator + parseFloat(object.amount);
          },
          0
        );
        console.log(this.SUM_BIEN);
        this.dataDetailDonation.map((item: any) => {
          this.goodError = item;
          const counter = this.goodError.length;
          this.BIEN_ERROR = counter;
          console.log(this.SUM_BIEN);
        });
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
            this.TOTAL_REPORTE = this.totalItems2;
            this.SUM_BIEN = this.dataDetailDonation.reduce(
              (accumulator: any, object: any) => {
                return accumulator + parseFloat(object.amount);
              },
              0
            );
            console.log(this.SUM_BIEN);
            this.dataDetailDonation.map((item: any) => {
              this.goodError = item;
              const counter = this.goodError.length;
              this.BIEN_ERROR = counter;
              console.log(this.goodError);
            });
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
                await this.updateBienDetalle(good.id, 'ADM');
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
          'Debe Seleccionar un Bien que Forme Parte del Evento Primero',
          'Debe Capturar un Evento.'
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
              g => g.id === good.goodId
            );
            await this.updateBienDetalle(good.numberGood, 'ROP');
            await this.deleteDET(good);
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
  async updateBienDetalle(idGood: string | number, status: string) {
    this.goodService.updateStatusActasRobo(idGood, status).subscribe({
      next: data => {
        console.log(data);
        this.getDetailProceedingsDevollution(idGood);
      },
      error: () => (this.loading = false),
    });
  }
  async deleteDET(good: any) {
    console.log(good);
    const valid: any = await this.getGoodsDelete(good.numberGood);
    if (valid != null) {
      let obj: any = {
        numberGood: good.numberGood,
        numberProceedings: this.eventdetailDefault.id,
      };

      await this.deleteDetailProcee(obj);
    }
  }
  async deleteDetailProcee(params: any) {
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService.deleteDetailProcee(params).subscribe({
        next: data => {
          console.log('data', data);
          // this.loading2 = false;
          resolve(true);
        },
        error: error => {
          // this.loading2 = false;
          resolve(false);
        },
      });
    });
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
  async getGoodsDelete(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.goodService
        .getByExpedient_(Number(this.fileNumber), params)
        .subscribe({
          next: data => {
            resolve(true);
          },
          error: error => {
            resolve(null);
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
  cleanActa() {
    this.regisForm.reset();
    this.dataTableGood.load([]);
    this.dataDetailDonationGood.load([]);
    this.eventDonacion = null;
    this.estatus = null;
    this.selectedGooods = [];
    this.Exportdate = false;
  }

  searchActas(actas?: string) {
    this.consec = null;
    actas = this.cveActa;
    const expedienteNumber = this.fileNumber;
    const actaActual = this.eventDonacion;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      actas,
      actaActual,
      expedienteNumber,
    };

    let modalRef = this.modalService.show(FindActaComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      if (next) {
        this.alert(
          'success',
          'Se Cargó la Información del Evento',
          next.cveAct
        );
      }
      // Limpiar formulario una vez consulte
      this.regisForm.reset();
      //this.formScan.reset();
      this.eventDonacion = next;

      const dateElabora =
        next.elaborationDate != null ? new Date(next.elaborationDate) : null;
      const formattedfecElaborate =
        dateElabora != null ? this.formatDate(dateElabora) : null;

      const dateActa =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecActa =
        dateActa != null ? this.formatDate(dateActa) : null;

      const dateCapture =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecCapture =
        dateCapture != null ? this.formatDate(dateCapture) : null;

      // this.fCreate = this.datePipe.transform(
      //   next.dateElaborationReceipt,
      //   'dd/MM/yyyy'
      // );
      this.to = this.datePipe.transform(
        this.regisForm.controls['year'].value,
        'MM/yyyy'
      );

      this.estatus = next.estatusAct;
      if (this.estatus == 'CERRADA') {
        //this.disabledBtnCerrar = false;
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
        //this.disabledBtnCerrar = true;
      }
      console.log('acta NEXT ', next);
      this.paramsScreen.recordId = next.actId;
      this.paramsScreen.area = next.noDelegation1;
      this.regisForm.patchValue({
        folio: next.folioUniversal,
        type: this.type,
        keyEvent: next.cveAct,
        mes: next.captureDate,
        year: next.elaborationDate,
        testigoOne: next.witness1,
        testigoTree: next.witness2,
        elaboradate: formattedfecElaborate,
        captureDate: formattedfecActa,
        fechacap: formattedfecCapture,
      });

      this.paramsScreen = {
        origin: 'FMCOMDONAC_1',
        recordId: String(this.eventDonacion.actId),
        area: String(this.authService.decodeToken().department),
      };
      //this.data1 = next.statusProceedings;
      //this.formScan.get('scanningFoli').patchValue(next.universalFolio);
      // Pasar clave a esta función
      this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);

      await this.getDetailProceedingsDevollution(this.eventDonacion.actId);
    });
    modalRef.content.cleanForm.subscribe(async (next: any) => {
      if (next) {
        this.cleanActa();
      }
    });
  }
  generarDatosDesdeUltimosCincoDigitos(
    claveActa: string
  ): { anio: number; mes: string } | null {
    // Verificar que la longitud de la clave sea la esperada
    if (claveActa.length < 5) {
      return null; // Clave no válida
    }

    const ultimosCincoDigitos = claveActa.slice(-4);
    const anio = parseInt(ultimosCincoDigitos.substring(0, 2), 10);
    const mesNumero = parseInt(ultimosCincoDigitos.substring(3, 5), 10);
    if (
      isNaN(anio) ||
      isNaN(mesNumero) ||
      anio < 0 ||
      mesNumero < 1 ||
      mesNumero > 12
    ) {
      return null;
    }

    const mesesTexto = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const mesTexto = mesesTexto[mesNumero - 1];
    const fechaActual = new Date();
    const sigloActual = Math.floor(fechaActual.getFullYear() / 100) * 100;
    const anioCompleto = anio < 100 ? sigloActual + anio : anio;

    this.regisForm.patchValue({
      year: anioCompleto,
      mes: mesTexto,
    });

    return { anio: anioCompleto, mes: mesTexto };
  }

  agregarCaptura() {
    // const testigoOne = this.regisForm.get('testigoOne').value;
    // const testigoTree = this.regisForm.get('testigoTree').value;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      delegationToolbar: this.delegationToolbar,
      fileNumber: this.fileNumber,
      expedient: this.fileNumber,
      // testigoTree,
      // testigoOne,
    };

    let modalRef = this.modalService.show(CreateActaComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.alert(
          'success',
          'Se Cargó la Información del Evento',
          next.cveAct
        );
      }

      this.totalItems2 = 0;
      this.eventdetailDefault = next;
      this.estatus = next.estatusAct;
      if (this.estatus == 'CERRADA') {
        //this.disabledBtnCerrar = false;
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
        //this.disabledBtnCerrar = true;
      }
      //Se limpia el campo de folio de escaneo cuando se genera nueva acta
      // this.formScan.reset();

      // Const formato de fecha
      const dateElabora =
        next.elaborationDate != null ? new Date(next.elaborationDate) : null;
      const formattedfecElaborate =
        dateElabora != null ? this.formatDate(dateElabora) : null;

      const dateActa =
        next.datePhysicalReception != null
          ? new Date(next.datePhysicalReception)
          : null;
      const formattedfecActa =
        dateActa != null ? this.formatDate(dateActa) : null;

      const dateCapture =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecCapture =
        dateCapture != null ? this.formatDate(dateCapture) : null;

      this.regisForm.patchValue({
        acta: next.actId,
        consec: next.numeraryFolio,
        type: next.actType,
        cveActa: next.cveAct,
        respConv: next.elaborated,
        testigoOne: next.witness1,
        testigoTree: next.witness2,
        observaciones: next.observations,
        elaboradate: formattedfecElaborate,
        fechaact: formattedfecActa,
        fechacap: formattedfecCapture,
      });

      this.data1 = next.estatusAct;
      // Se mapea Mes  y año al crear nueva acta
      this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);

      await this.getDetailProceedingsDevollution(this.eventdetailDefault.id);
    });
    // console.log(this.authService.decodeToken());
  }
  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter(
      'elaborated',
      this.authService.decodeToken().preferred_username,
      SearchFilter.EQ
    );
    return this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: (value: any) => {
        const data = value.data[0].usuario;
        if (data) this.delegationToolbar = data.delegationNumber;

        // console.log('SI', value);
      },
      error(err) {
        console.log('NO');
      },
    });
  }

  // Cammbiar formato de fecha

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  async cerrarActa() {
    if (this.eventDonacion != null) {
      if (this.eventDonacion.estatusAct == 'CERRADA') {
        this.alertInfo('warning', 'El Evento ya se Encuentra Cerrada', '');
        return;
      }
      if (this.dataDetailDonationGood.count() == 0) {
        this.alertInfo(
          'warning',
          'Para Cerrar un Evento debe Contener al Menos un Bien, por favor Registra este en la Pantalla de Actas.',
          ''
        );
        return;
      }

      const toolbar_user = this.authService.decodeToken().preferred_username;
      const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;

      if (
        cadena != 0 &&
        this.authService.decodeToken().preferred_username == toolbar_user
      ) {
        null;
      } else {
        this.alertQuestion(
          'question',
          '¿Seguro que Desea Realizar el Cierre de esta Evento?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            let obj: any = {
              cveAct: this.eventDonacion.actId,
              elaborationDate: this.eventDonacion.elaborationDate,
              estatusAct: 'CERRADA',
              elaborated: this.authService.decodeToken().preferred_username,
              witness1: this.eventDonacion.witness1,
              witness2: this.eventDonacion.witness2,
              actType: 'COMPDON',
              observations: this.eventDonacion.observations,
              registreNumber: null,
              numDelegation1: null,
              numDelegation2: null,
              identifier: null,
              label: null,
              folioUniversal: this.eventDonacion.folioUniversal,
              closeDate: null,
            };
            this.donationService.putEvent(obj, this.idAct).subscribe({
              next: async data => {
                this.loading = false;

                let obj = {
                  pActaNumber: this.idAct,
                  pStatusActa: 'CERRADA',
                  pVcScreen: 'FMCOMDONAC_1',
                  pUser: this.authService.decodeToken().preferred_username,
                };

                await this.updateGoodEInsertHistoric(obj);

                this.alertInfo('success', 'El Evento Ha Sido Cerrado', '');
                this.alert('success', 'Evento Cerrado', '');
                this.data1 = 'CERRADA';
                //this.disabledBtnCerrar = false;
                this.disabledBtnActas = false;
                this.dataTableGood.refresh();
                await this.getDetailProceedingsDevollution(
                  this.eventdetailDefault.actId
                );
              },
              error: error => {
                this.alert('error', 'Ocurrió un Error al Cerrar el Evento', '');
              },
            });
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'No Existe Ningún Evento a Cerrar.',
        // 'El Usuario no está autorizado para cerrar acta',
        ''
      );
    }
  }
  updateGoodEInsertHistoric(obj: {
    pActaNumber: any;
    pStatusActa: string;
    pVcScreen: string;
    pUser: string;
  }) {
    //throw new Error('Method not implemented.');
  }

  validaGood() {
    if (this.eventDonacion.estatusAct === 'CERRADA') {
      this.alert(
        'warning',
        'El Evento está cerrado, no se pueden validar bienes',
        ''
      );
      return;
    } else if (this.eventdetailDefault !== null) {
      this.alert('warning', 'No hay Bienes a validar', '');
      return;
    } else {
      this.donationService.getApprove(this.params.getValue()).subscribe({
        next: data => {
          console.log(this.dataDetailDonation);
          console.log(data.data);
        },
      });
    }
  }

  findRast() {
    this.data.load([]);
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FMCOMDONAC_1' },
    });
  }
  loadGood(data: any[]) {
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodService.getById(good.No_bien).subscribe({
        next: response => {
          this.goods.push({
            ...JSON.parse(JSON.stringify(response)).data[0],
            avalaible: null,
          });
          console.log(this.goods);
          this.addStatus();
          /* this.validGood(JSON.parse(JSON.stringify(response)).data[0]); */ //!SE TIENE QUE REVISAR
        },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({
              id: good.goodNumber,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
      }
    });
  }
  addStatus() {
    /* this.data.load(this.goods); */
    this.paginator();
    this.data.refresh();
  }

  paginator(noPage: number = 1, elementPerPage: number = 10) {
    const indiceInicial = (noPage - 1) * elementPerPage;
    const indiceFinal = indiceInicial + elementPerPage;

    let paginateData = this.goods.slice(indiceInicial, indiceFinal);
    this.data.load(paginateData);
  }
}

export interface IParamsDonac {
  origin: string;
  recordId: string;
  area: string;
}

export interface IDonationGoodError {
  goodId: number;
  description: string;
}

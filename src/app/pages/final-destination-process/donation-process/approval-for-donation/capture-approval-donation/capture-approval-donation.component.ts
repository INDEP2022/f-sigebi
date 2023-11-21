import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
import {
  IExportDetail,
  IGoodDonation,
} from 'src/app/core/models/ms-donation/donation.model';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
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
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { GOOD_TRACKER_ORIGINS } from 'src/app/pages/general-processes/goods-tracker/utils/constants/origins';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DonAuthorizaService } from '../../donation-authorization-request/donation-authorization-request/service/don-authoriza.service';
import { CreateActaComponent } from '../create-acta/create-acta.component';
import { FindActaComponent } from '../find-acta/find-acta.component';
import { GoodErrorComponent } from '../good-error/good-error.component';
import { RopIdComponent } from '../rop-id/rop-id.component';
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
  delForm: FormGroup;
  siabForm: FormGroup;
  foolio: number;
  statusGood_: any;
  deleteO: boolean = false;
  goods: any[] = [];
  files: any = [];
  radio: boolean = false;
  bienesVaild: boolean = false;
  changeDescription: string;
  dataTableGood_: any[] = [];
  body: IExportDetail;
  valueChange: number = 0;
  totalItems: number = 0;
  errorSumInvalidos: number = 0;
  errorSumValidos: number = 0;
  deleteG: boolean = false;
  loading3: boolean = false;
  Exportdate: boolean = false;
  inputVisible: boolean = false;
  status: string = '';
  idAct: number = 0;
  disabledBtnActas: boolean = true;
  totalItems2: number = 0;
  activeRadio: boolean = true;
  cveActa: string = '';
  goodError: IDonationGoodError[];
  dataDetailDonation: any;
  data1: any;
  consec: string = '';
  dataDetailDonationGood: LocalDataSource = new LocalDataSource();
  excelLoading: boolean = false;
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  bsValueToYear: Date = new Date();
  TOTAL_REPORTE: number = 0;
  BIEN_ERROR: number = 0;
  SUM_BIEN: number = 0;
  validChange: number = 0;
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  dataTableGood: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  estatus: string;
  selectedRow: IGood;
  origin2: 'FCONGENRASTREADOR';
  fileNumber: number = 0;
  $trackedGoods = this.store.select(getTrackedGoods);
  columnFilters: any = [];
  columnFilterDetail: any = [];
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

  @ViewChild('file') file: any;
  donationGood: IGoodDonation;
  paramsScreen: IParamsDonac = {
    origin: '',
  };
  goodsList: ITrackedGood[] = [];
  get good(): ITrackedGood[] {
    return this.goodsList;
  }
  @Input() set good(good: ITrackedGood[]) {
    if (good.length > 0) {
      this.goodsList = good;
    } else {
      this.goodsList = [];
    }
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef,
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
    private donAuthorizaService: DonAuthorizaService,
    private store: Store
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        title: 'Acciones',
        edit: false,
        add: false,
        delete: false,
      },
      selectedRowIndex: -1,
      mode: 'external',
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
      rowClassFunction: (row: any) => {
        if (row.data.error === 0) {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
  }

  ngOnInit(): void {
    this.dataDetailDonationGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'des_error':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilterDetail[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilterDetail[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDetailProceedingsDevollution(localStorage.getItem('actaId'));
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() =>
        this.getDetailProceedingsDevollution(localStorage.getItem('actaId'))
      );
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        if (this.origin == 'FMCOMDONAC_1') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          this.origin2 = paramsQuery['origin2'] ?? null;
        }
        if (this.origin !== null) {
          console.log('traigo parametros');
          this.isValidOrigin();
        }
      });
    this.initForm();
  }
  oadGoods() {
    this.donAuthorizaService.loadGoods.next(true);
  }
  enableButtons() {
    if (this.regisForm.get('activeRadio').value !== null) {
      this.radio = true;
    }
  }

  initForm() {
    this.regisForm = this.fb.group({
      type: [null, []],
      area: [null, [Validators.pattern(STRING_PATTERN)]],
      year: [null, []],
      folio: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(4)],
      ],
      captureDate: [null, []],
      keyEvent: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      observaciones: [null],
      activeRadio: [null],
    });
    this.delForm = this.fb.group({
      observaElimina: [null, [Validators.required]],
    });
    this.getComerDonation();
    this.configDatePicker();
  }

  createDon(donationGood: IGoodDonation) {
    this.loading = true;
    const folio = this.regisForm.value.folio;
    // const acta = this.regisForm.value.type;
    let year = this.regisForm.value.year;
    const area = this.regisForm.value.area;
    let folio_ = folio.toString().padStart(4, '0');
    this.foolio = folio_;
    const cveActa = `${'COMPDON'}/${area}/${year}/${folio_}/${this.type}`;
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
    this.idAct = Number(localStorage.getItem('actaId'));
    this.donationService.getByIdEvent(this.idAct).subscribe({
      next: (data: any) => {
        this.eventDonacion = data;
        this.fileNumber = data.fileNumber;
        this.regisForm.get('type').setValue('COMPDON');
        this.regisForm.get('area').setValue(localStorage.getItem('area'));
        this.estatus = this.eventDonacion.estatusAct;
        console.log(this.eventDonacion);
        if (this.estatus != 'ABIERTA') {
          this.deleteO = true;
          // this.generarClave(this.regisForm.value.area, )
        }
        this.deleteO = false;
        const ultimosCincoDigitos = this.eventDonacion.cveAct.slice(-5);
        const anio = parseInt(ultimosCincoDigitos.substring(0, 2), 10);
        // const mesNumero = parseInt(ultimosCincoDigitos.substring(3, 5), 10);
        if (isNaN(anio)) {
          return null;
        }
        const fechaActual = new Date();
        const sigloActual = Math.floor(fechaActual.getFullYear() / 100) * 100;
        const anioCompleto = anio < 100 ? sigloActual + anio : anio;
        this.regisForm.get('year').setValue(anioCompleto);
        this.regisForm.get('folio').setValue(data.folioUniversal);
        this.regisForm.get('keyEvent').setValue(this.eventDonacion.cveAct);
        this.regisForm
          .get('captureDate')
          .setValue(localStorage.getItem('captureDate'));
        this.getDetailProceedingsDevollution(this.idAct);
        this.regisForm.get('observaciones').setValue(data.observations);
      },
      error: () => {
        console.error('error');
      },
    });
  }
  isGoodSelectedT(_good: ITrackedGood) {
    const exists = this.selectedGooods.find(
      good => good.goodNumber == _good.goodNumber
    );
    return exists ? true : false;
  }

  private isValidOrigin() {
    return (
      this.origin !== null &&
      Object.values(GOOD_TRACKER_ORIGINS).includes(
        this.origin as unknown as GOOD_TRACKER_ORIGINS
      )
    );
  }

  ubicaGood() {
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden consultar bienes',
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
            if (this.dataDetailDonation.length === 0) {
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
    if (
      typeof lvArea !== 'number' ||
      typeof lvCons !== 'number' ||
      typeof anio !== 'number'
    ) {
      throw new Error('Los datos ingresados no son del tipo correcto');
    }
    const clave = `${this.type}${lvArea.toString().padStart(2, '0')}${lvCons
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

  // getDetailDonation(actaId: string | number) {
  //   const params = new ListParams();
  //   params['filter.recordId'] = actaId;
  //   params['filter.good.status'] = 'DON';
  //   this.donationService.getEventComDonationDetail(params).subscribe({
  //     next: data => {
  //       console.log(data);
  //       this.dataDetailDonation = data.data;
  //       this.dataDetailDonationGood.load(this.dataDetailDonation);
  //       this.dataDetailDonationGood.refresh();
  //       this.totalItems = data.count;
  //     },
  //     error: () => console.error('no hay detalle acta'),
  //   });
  // }
  async getDetailProceedingsDevollution(id: any) {
    this.loading3 = true;
    let params: any = {
      ...this.paramsList2.getValue(),
      ...this.columnFilters2,
    };
    params['filter.recordId'] = `$eq:${this.idAct}`;
    return new Promise((resolve, reject) => {
      this.donationService.getEventComDonationDetail(params).subscribe({
        next: data => {
          let result: any[] = [];
          result = data.data.map((item: any) => {
            item['description'] = item.good ? item.good.description : null;
            this.BIEN_ERROR += item['error'];
            this.SUM_BIEN += item['cant'] = item.good ? item.good.cant : null;
            const status = (item['status'] = item.good
              ? item.good.status
              : null);
            if (status === null) {
              this.errorSumInvalidos += status;
            } else {
              this.errorSumValidos += status;
            }
          });

          Promise.all(result).then(items => {
            this.dataDetailDonation = data.data;
            console.log(this.dataDetailDonation);
            this.dataDetailDonationGood.load(this.dataDetailDonation);
            this.dataDetailDonationGood.refresh();
            this.totalItems2 = data.count;
            this.TOTAL_REPORTE = this.totalItems2;

            console.log('data', data);
            this.loading3 = false;
            this.Exportdate = true;
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
  exportAll(): void {
    this.body = {
      recordId: this.idAct,
      typeActa: 'COMPDON',
      delegationId: Number(localStorage.getItem('noDelegation1')),
      nombre_transferente: null,
    };

    this.getEventComDonationExcel(this.body);
  }

  getEventComDonationExcel(body: IExportDetail): void {
    this.excelLoading = true;
    if (this.dataDetailDonationGood != null) {
      this.donationService.getExcel(body).subscribe({
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
    this.alert('success', 'El reporte se ha descargado', '');
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
          'No existe un evento en la cual asignar el bien.',
          'Debe capturar un evento.'
        );
        return;
      } else {
        if (this.estatus == 'CERRADA') {
          this.alert(
            'warning',
            'El evento ya está cerrado, no puede realizar modificaciones',
            ''
          );
          return;
        } else {
          // console.log('aaa', this.goods);
          let result = this.selectedGooods.map(async (good: any) => {
            if (good.di_acta != null) {
              this.alert(
                'warning',
                `Ese bien ya se encuentra en el evento ${good.di_acta}`,
                'Debe capturar un evento.'
              );
            } else if (this.dataDetailDonation.error === 1) {
              this.onLoadToast(
                'warning',
                `El bien ${good.id} tiene un estatus Inválido para ser asignado a algún evento`
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
                this.dataTableGood_[indexGood].error = 1;
                await this.createDET(good);
                await this.updateBienDetalle(good.goodId, 'CPD');
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
    this.inputVisible = true;
    // this.elementRef.nativeElement = this.delForm.get('observaElimina').value;
    // this.elementRef.nativeElement.focus();
    if (this.estatus == 'CERRADA') {
      this.alert(
        'warning',
        'El evento ya está cerrado, no puede realizar modificaciones',
        ''
      );
      return;
    } else {
      // console.log('this.actasDefault ', this.actasDefault);
      if (this.dataDetailDonation == null) {
        this.alert(
          'warning',
          'Debe especificar/buscar el evento para despues eliminar el bien.',
          ''
        );
        return;
      }
      if (this.selectedGooodsValid.length == 0) {
        this.alert(
          'warning',
          'Debe seleccionar un bien que Forme parte del evento primero',
          'Debe capturar un evento.'
        );
        return;
      } else if (this.delForm.get('observaElimina').value === null) {
        this.alert(
          'warning',
          'Debe llenar las obervaciones de la eliminación primero',
          ''
        );
        return;
      } else {
        this.alertQuestion(
          'question',
          '¿Seguro que desea eliminar el bien del evento?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            this.loading = true;
            if (this.selectedGooodsValid.length > 0) {
              // this.goods = this.goods.concat(this.selectedGooodsValid);
              let result = this.selectedGooodsValid.map(async good => {
                console.log('good', good);
                this.dataDetailDonation = this.dataDetailDonation.filter(
                  (_good: any) => _good.id != good.goodId
                );
                let index = this.dataTableGood_.findIndex(
                  g => g.id === good.goodId
                );

                await this.updateBienDetalle(good.goodId, 'ROP');
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
        });
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
    const valid: any = await this.getGoodsDelete(good.goodId);
    if (valid != null) {
      let obj: any = {
        recordId: this.idAct,
        goodId: good.goodId,
        amount: good.amount,
        received: 0,
        exchangeValue: this.regisForm.get('activeRadio').value | 0,
        registrationId: good.registreNumber,
      };

      await this.deleteDetailProcee(obj);
    }
  }
  async deleteDetailProcee(params: any) {
    return new Promise((resolve, reject) => {
      this.donationService.putDetailDona(params).subscribe({
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
      recordId: this.idAct,
      goodId: good.goodId,
      amount: good.amount,
      received: 1,
      exchangeValue: this.regisForm.get('activeRadio').value | 0,
      registrationId: good.registrationId,
    };

    await this.saveGoodDetail(obj);
  }
  async saveGoodDetail(body: any) {
    return new Promise((resolve, reject) => {
      this.donationService.createDetail(body).subscribe({
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
            this.inputVisible = true;
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
    this.idAct = 0;
    this.TOTAL_REPORTE = 0;
    this.BIEN_ERROR = 0;
    this.SUM_BIEN = 0;
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
      if (next) {
        this.alert(
          'success',
          'Se cargó la información del evento',
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

      this.to = this.datePipe.transform(
        this.regisForm.controls['year'].value,
        'yyyy'
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
      this.idAct = next.actId;
      this.regisForm.patchValue({
        folio: next.folioUniversal,
        type: this.type,
        area: localStorage.getItem('area'),
        keyEvent: next.cveAct,
        mes: next.captureDate,
        year: next.captureDate,
        testigoOne: next.witness1,
        testigoTree: next.witness2,
        elaboradate: formattedfecElaborate,
        captureDate: formattedfecActa,
        fechacap: formattedfecCapture,
      });
      this.paramsScreen = {
        origin: 'FMCOMDONAC_1',
      };
      this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);
      await this.getDetailProceedingsDevollution(next.actId);
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
          'Se cargó la información del Evento',
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

      // this.data1 = next.estatusAct;
      // Se mapea Mes  y año al crear nueva acta
      this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);

      await this.getDetailProceedingsDevollution(next.actId);
    });
    // console.log(this.authService.decodeToken());
  }
  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter(
      'elaborated',
      this.authService.decodeToken().username,
      SearchFilter.EQ
    );
    return this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: (value: any) => {
        const data = value.data[0].username;
        if (data) this.delegationToolbar = data.delegationNumber;

        console.log('SI', this.delegationToolbar);
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
        this.alert('warning', 'el evento ya se encuentra cerrado', '');
        return;
      }
      if (this.dataDetailDonationGood.count() == 0) {
        this.alert(
          'warning',
          'Para cerrar un evento debe contener al menos un bien.',
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
          '¿Seguro que desea realizar el cierre de ésta evento?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            let obj: any = {
              actId: this.idAct,
              cveAct: this.eventDonacion.cveAct,
              elaborationDate: this.eventDonacion.elaborationDate,
              estatusAct: 'CERRADA',
              elaborated: this.authService.decodeToken().preferred_username,
              witness1: this.eventDonacion.witness1,
              witness2: this.eventDonacion.witness2,
              actType: 'COMPDON',
              observations: this.eventDonacion.observations,
              registreNumber: null,
              noDelegation1: this.authService.decodeToken().department,
              fileId: this.eventDonacion.fileId,
              noDelegation2: null,
              identifier: this.eventDonacion.identifier,
              folioUniversal: this.eventDonacion.folioUniversal,
              closeDate: new Date(),
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

                this.alert('success', 'El evento Ha sido cerrado', '');
                this.alert('success', 'Evento cerrado', '');
                this.data1 = 'CERRADA';
                //this.disabledBtnCerrar = false;
                this.disabledBtnActas = false;
                this.dataTableGood.refresh();
                await this.getDetailProceedingsDevollution(this.idAct);
              },
              error: error => {
                this.alert('error', 'Ocurrió un error al cerrar el evento', '');
              },
            });
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'No existe ningún evento a cerrar.',
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
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden validar bienes',
        ''
      );
      return;
    }
    if (this.dataDetailDonationGood.count() == 0) {
      this.alert('warning', 'No hay bienes a validar', '');
      return;
    } else {
      this.donationService.getApprove(this.params.getValue()).subscribe({
        next: data => {
          console.log(this.dataDetailDonation);
          console.log(data.data);
          this.alert(
            'success',
            `Bienes válidos ${this.errorSumValidos}, Bienes inválidos ${this.errorSumInvalidos}`,
            ''
          );
        },
      });
    }
  }
  findRast() {
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden validar bienes',
        ''
      );
      return;
    }
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FMCOMDONAC_1' },
    });
  }

  searchGoodError(provider?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };
    let modalRef = this.modalService.show(GoodErrorComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        console.log(next);
      }
    });
  }
  actualizarActa() {
    if (this.idAct === null) {
      this.alertInfo('warning', 'Debe seleccionar un evento', '');
      return;
    }
    if (this.estatus === 'CERRADA') {
      this.alertInfo('warning', 'No puede actualizar un evento cerrado', '');
      return;
    }
    this.selectedGooodsValid.forEach(good => {
      let obj: any = {
        recordId: this.idAct,
        goodId: good.goodId,
        amount: good.amount,
        received: 1,
        exchangeValue: this.regisForm.get('activeRadio').value | 0,
        registrationId: good.registrationId,
      };
      this.updateBienDetalle(good.goodId, 'CPD');
      // delete this.eventdetailDefault.numDelegation1Description;
      // delete this.eventdetailDefault.numDelegation2Description;
      // delete this.eventdetailDefault.numTransfer_;
      this.donationService.putDetailDona(obj).subscribe({
        next: async data => {
          this.alertInfo('success', 'Se actualizó el evento correctamente', '');
          await this.generaRepote();
        },
        error: error => {
          this.alert('error', 'Ocurrió un error al actualizar el evento', '');
          // this.loading = false
        },
      });
    });
  }
  generaRepote() {}
  actualizarEvento() {
    const toolbar_user = this.authService.decodeToken().username;
    const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;

    if (
      cadena != 0 &&
      this.authService.decodeToken().username == toolbar_user
    ) {
      null;
    } else {
      let obj: any = {
        cveAct: this.eventDonacion.cveAct,
        elaborationDate: this.eventDonacion.elaborationDate,
        estatusAct: 'CERRADA',
        elaborated: this.authService.decodeToken().username,
        witness1: this.eventDonacion.witness1,
        witness2: this.eventDonacion.witness2,
        actType: 'COMPDON',
        observations: this.eventDonacion.observations,
        registreNumber: null,
        noDelegation1: localStorage.getItem('area'),
        fileId: this.eventDonacion.fileId,
        noDelegation2: null,
        identifier: this.eventDonacion.identifier,
        folioUniversal: this.eventDonacion.folioUniversal,
        closeDate: null,
      };
      this.donationService.putEvent(obj, this.idAct).subscribe({
        next: async data => {
          this.loading = false;

          let obj = {
            pActaNumber: this.idAct,
            pStatusActa: 'ABIERTA',
            pVcScreen: 'FMCOMDONAC_1',
            pUser: this.authService.decodeToken().username,
          };

          await this.updateGoodEInsertHistoric(obj);

          // this.alertInfo('success', 'El Evento Ha Sido Actualizado', '');
          this.alert('success', 'evento actualizado', '');
          this.data1 = 'ABIERTA';
          //this.disabledBtnCerrar = false;
          this.disabledBtnActas = false;
          this.dataTableGood.refresh();
          await this.getDetailProceedingsDevollution(this.idAct);
        },
        error: error => {
          console.log('error', 'Ocurrió un Error al actualizar el evento', '');
        },
      });
    }
  }
  searchRopaId(rop?: string) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      rop,
    };

    let modalRef = this.modalService.show(RopIdComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      if (next) {
        this.alert(
          'success',
          'Se actualizó la información del Bien',
          next.goodId
        );
      }
      await this.updateGood(next.goodId);
    });
  }
  updateGood(goodId: number) {}
}

export interface IParamsDonac {
  origin: string;
}

export interface IDonationGoodError {
  goodId: number;
  des_error: string;
}

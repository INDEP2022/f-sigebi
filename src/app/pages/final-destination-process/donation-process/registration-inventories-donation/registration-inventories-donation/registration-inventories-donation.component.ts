import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { ListDonationComponent } from '../list-donation/list-donation.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-registration-inventories-donation',
  templateUrl: './registration-inventories-donation.component.html',
  styles: [
    `
      .br-card {
        border: 1px solid #545b62 !important;
      }
    `,
  ],
})
export class RegistrationInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  loadingGood: boolean = false;
  columnFilters: any = [];
  goods: any[] = [];
  ngGlobal: IGlobalVars = null;
  totalItems2: number = 0;

  rel_bienes: any;
  total: any;

  selectedRows: any[] = [];

  flagConf: boolean = false;
  flagGenera: boolean = false;
  flagFilter: boolean = false;
  flagGoods: boolean = false;
  flagTracker: boolean = false;
  flagTrigger: boolean = false;

  V_PANTALLA = 'FDONAC_DIRECT';
  V_ESTATUS_FINAL: string;

  V_CONT: number;

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private goodprocessService: GoodprocessService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private globalVarsService: GlobalVarsService,
    private router: Router,
    private statusXScreenService: StatusXScreenService,
    private historyGoodService: HistoryGoodService,
    private authService: AuthService,
    private goodTrackerService: GoodTrackerService,
    private donationService: DonationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      selectMode: 'multi',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: COLUMNS,
    };
    //this.filterTable();
  }

  ngOnInit(): void {
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          //console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES != null) {
            this.rel_bienes = this.ngGlobal.REL_BIENES;
            console.log('REL_BIENES ', this.rel_bienes);
            //this.backRastreador(this.ngGlobal.REL_BIENES);
            //console.log('BackRastreador-> ', this.ngGlobal.REL_BIENES);
            if (Number(this.rel_bienes) != 0) {
              this.backRastreador(this.rel_bienes);
            }
          }
        },
      });
    this.initForm();
    this.filterTable();
    //let number = 0;
    //this.statusXPantalla();
  }

  filterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodId':
                field = 'filter.noBien';
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'associatedFileNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'unit':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'sssubType':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'delAdmin':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'storeNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.listGoods();
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.listGoods());
  }

  initForm() {
    this.form = this.fb.group({
      requestId: [null, [Validators.maxLength(11)]],
      doneeId: [null, [Validators.maxLength(11)]],
      donee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
      justification: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      state: [null, [Validators.pattern(STRING_PATTERN)]],
      municipality: [null, [Validators.pattern(STRING_PATTERN)]],
      direction: [null, [Validators.pattern(STRING_PATTERN)]],
      requestDate: [null, [Validators.pattern(STRING_PATTERN)]],
      requestTypeId: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2)],
      ],
      authorizeCve: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(40)],
      ],
      authorizeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      clasifGoodId: [null, [Validators.pattern(STRING_PATTERN)]],
      authorizeType: [
        'T',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2)],
      ],

      sunQuantity: [null, [Validators.pattern(STRING_PATTERN)]],
      sunStatus: [null, [Validators.pattern(STRING_PATTERN)]],
      representative: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.form.get('authorizeCve').disable();
    this.form.get('authorizeDate').disable();
    this.form.get('authorizeType').disable();

    this.form.get('authorizeDate').valueChanges.subscribe({
      next: () => this.validateDateAuthorize(),
    });

    this.form.get('requestDate').valueChanges.subscribe({
      next: () => this.validateDateRequest(),
    });

    this.formTable = this.fb.group({
      totalGoods: [null, [Validators.required]],
    });
  }

  validateDateAuthorize() {
    const dateInit = this.form.get('requestDate').value;
    const dateEnd = this.form.get('authorizeDate').value;

    if (!dateEnd || dateEnd == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date2 < date1) {
      this.onLoadToast(
        'warning',
        'La Fecha de Autorización es menor a la Fecha de Solicitud.',
        ''
      );
    }
  }

  validateDateRequest() {
    const dateInit = this.form.get('requestDate').value;
    const dateEnd = this.form.get('authorizeDate').value;

    if (!dateEnd) return;
    if (!dateInit || dateInit == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date1 > date2) {
      this.onLoadToast(
        'warning',
        'La Fecha de Solicitud no puede mayor a la de autorización.',
        ''
      );
    }
  }

  dateTimeTypeString(date: string): number {
    let time: string = date.split('T')[0].split('-').join('/');
    return new Date(time).getTime();
  }

  dateTimeTypeDate(date: Date): number {
    let time: string = this.datePipe.transform(date, 'yyyy/MM/dd');
    return new Date(time).getTime();
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  callFilterDonation() {
    window.open(
      './pages/parameterization/filters-of-goods-for-donation',
      '_blank'
    );
  }

  callRastreador() {
    //window.open('./pages/general-processes/goods-tracker', '_blank');
    this.loadFromGoods();
  }

  authorize() {
    const { authorizeCve, authorizeDate, authorizeType } = this.form.value;
    const type = ['D', 'A'];
    if (!type.includes(authorizeType)) {
      this.onLoadToast('warning', 'Se Debe Especificar el Tipo de Trámite', '');
      return;
    }
    if (!authorizeCve || !authorizeDate) {
      this.onLoadToast(
        'warning',
        'Se Debe Ingresar la Clave y/o Fecha de Autorización.',
        ''
      );
      return;
    }
    this.form.get('sunStatus').patchValue('ADA');
    if (this.selectedRows.length > 0) {
      const _params: any = this.params;
      _params._value[`filter.screenKey`] = `$eq:FDONAC_DIRECT`;
      _params._value[`filter.status`] = `$eq:${this.selectedRows[0].estatus}`;
      //_params._value[`filter.status`] = `$eq:${this.selectedRows[0].estatus}`;
      console.log('Params Const-> ', _params);
      console.log('Params Const-> ', _params._value);
      console.log('thisParams-selectedRows->', this.selectedRows);
      this.statusXPantalla(_params._value);
    }

    this.flagConf = false;
    this.flagFilter = false;
    this.flagGoods = false;
    this.flagTracker = false;
    this.flagGenera = false;
    this.flagTrigger = false;
    this.alert('success', '', 'La Solicitud ha Sido Autorizada.');
  }

  getBienes() {
    this.loadingGood = true;
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: () => {
    //     this.listGoods();
    //   },
    // });
    this.listGoods();
  }

  listGoods() {
    this.goods = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('Params Filter-> ', params);
    this.loading = true;
    this.goodprocessService.getAvailableGoods(params).subscribe({
      next: response => {
        console.log('getAvailableGoods-> ', response);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data != null && response.data != undefined) {
            console.log('ingresa data -> ');
            let dataB = {
              noBien: response.data[i].noBien,
              description: response.data[i].description,
              cantidad: response.data[i].cantidad,
              noExpediente: response.data[i].noExpediente,
              unidad: response.data[i].unidad,
              sssubtipo: response.data[i].sssubtipo,
              delAdministra: response.data[i].delAdministra,
              almacen: response.data[i].almacen,
              estatus: response.data[i].estatus,
            };
            console.log('data ', dataB);
            this.goods.push(dataB);
            this.data.load(this.goods);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          }
        }
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  resetForm() {
    this.form.reset();
    this.form.get('authorizeCve').disable();
    this.form.get('authorizeDate').disable();
    this.form.get('authorizeType').disable();
    this.form.get('authorizeType').patchValue('T');
  }

  openModal(context?: Partial<ListDonationComponent>) {
    let config: ModalOptions = {
      initialState: {
        ...context,
        callback: (next: boolean, data: any) => {
          if (next) {
            this.form.patchValue(data);
            if (data.requestId) {
              this.form.get('requestId').patchValue(data.requestId.id);
            }
            if (data.doneeId) {
              this.form.get('doneeId').patchValue(data.doneeId.id);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListDonationComponent, config);
  }

  async loadFromGoods() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    // const selfState = await this.eventPreparationService.getState();
    // this.eventPreparationService.updateState({
    //   ...selfState,
    //   eventForm: this.eventForm,
    //   lastLot: Number(this.lotSelected.id) ?? -1,
    //   lastPublicLot: this.lotSelected.publicLot ?? 1,
    //   executionType: this.onlyBase ? 'base' : 'normal',
    // });
    console.log('Asyng Global-> ', global);

    localStorage.setItem('rastreador', '2');
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FDONAC_DIRECT',
      },
    });
  }

  selectRows(rows: any[]) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRows = rows;
      console.log('Rows Selected->', this.selectedRows);
      console.log('SelectRows', this.selectedRows[0].noBien);
      this.flagGenera = true;
    } else {
      this.flagGenera = false;
      this.selectedRows = [];
    }
    this.totalItems2 = this.selectedRows.length;
  }

  generateRequest() {
    if (this.form.get('doneeId').value == null) {
      this.alert(
        'warning',
        '',
        'No se Puede Generar la Solicitud sin Bienes Seleccionados, ni Donatario Especificado.'
      );
    } else {
      //Falta por integrar
      this.ActualizacionInventario();
    }
  }

  ActualizacionInventario() {}

  statusXPantalla(params?: _Params) {
    this.statusXScreenService.getList(params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp statusXPantalla-> ', resp);
          if (resp.data[0] != undefined) {
            this.V_ESTATUS_FINAL = resp.data[0].statusNewGood;
            console.log('V_ESTATUS_FINAL-> ', this.V_ESTATUS_FINAL);
            this.updateGoods(this.V_ESTATUS_FINAL);
          }
        }
      },
      error => {
        this.V_ESTATUS_FINAL = null;
        console.log('Error', error);
        //this.alert('error', '', error.error.message);
        this.updateGoods(this.V_ESTATUS_FINAL);
      }
    );
  }

  updateGoods(status: string) {
    if (status == null || status == '') {
      this.V_ESTATUS_FINAL = 'ADA';
    }
    for (let i = 0; i < this.selectedRows.length; i++) {
      this.putStatusGoods(this.selectedRows[i].noBien, this.V_ESTATUS_FINAL);
    }
  }

  putStatusGoods(good: number, status: string) {
    this.goodService.putStatusGood(good, status).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          console.log('putStatusGoods-> ', resp);
        }
        let token = this.authService.decodeToken();
        let parmas = {
          propertyNum: this.selectedRows[0].noBien,
          status: this.V_ESTATUS_FINAL,
          changeDate: new Date(),
          userChange: token.name.toUpperCase(),
          statusChangeProgram: 'FDONAC_DIRECT',
          reasonForChange: 'Automatico de Donaciones Directas',
        };
        this.goodsSave(parmas);
      },
      error: err => {
        console.log('Error putStatusGoods-> ', err);
      },
    });
  }

  goodsSave(params: any) {
    this.historyGoodService.PostStatus(params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('goodsSave-> ', resp);
          window.scrollTo(0, 0);
          this.listGoods();
        }
      },
      error => {
        console.log('Error goodsSave-> ', error);
      }
    );
  }

  getBlkCtlGood(cve: string, good: number) {
    this.goodprocessService.getBlkCtrlGood(cve, good).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getBlkCtlGood->', resp);
        }
      },
      error => {
        this.alert(
          'error',
          '',
          'El Bien no es Consistente, Existe en Otra Solicitud, o el Estatus es Inválido.'
        );
        console.log('Error ->');
      }
    );
  }

  goodtrackertmp(goodNum: number) {
    this.goodTrackerService.getGoodTrackerTmp(goodNum).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('goodtrackertmp-> ', resp);

        for (let i = 0; i < resp.count; i++) {
          resp.data[i].goodNumber,
            console.log('resp data GoodNumber-> ', resp.data[i].goodNumber);
          /**Insertar servicio Blk Ctl Good */
          this.getBlkCtlGood('FDONAC_DIRECT', resp.data[i].goodNumber); //Falta por Validar
          //this.totalItems = this.goodsColumns.length;
        }
        this.deleteGoodTracker(this.rel_bienes);
      }
    });
  }

  backRastreador(global: any) {
    this.goodTrackerService.PaInsGoodtmptracker(global).subscribe({
      next: response => {
        //console.log('respuesta TMPTRAKER', response);
        this.totalItems = response.count;
        console.log('total resp backRastreador ', response.count);
        //this.totalItems = this.totalItems + response.count;
        //console.log('count items -> ', this.totalItems);
        for (let i = 0; i < response.count; i++) {
          console.log('response bk', response.data[i].goodNumber);
          this.goodtrackertmp(response.data[i].goodNumber);
        }
      },
    });
  }

  deleteGoodTracker(id: number) {
    this.goodTrackerService.deleteTrackerGood(id).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp deleteGoodTracker-> ', resp);
      }
    });
  }

  solicitudDonacionBien(requestId: number) {
    this.donationService.getDonationRequest(requestId).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp solicitudDonacionBien-> ', resp);
          this.V_CONT = resp.count;
          console.log('V_Count ->', this.V_CONT);
        }
      },
      error => {
        console.log('Error solicitudDonacionBien');
        this.V_CONT = 0;
      }
    );
  }

  register() {
    const { requestId, doneeId, requestDate, justification } = this.form.value;
    if (
      requestId != null &&
      doneeId != null &&
      requestDate != null &&
      justification != null
    ) {
      this.solicitudDonacionBien(requestId);
      if (this.V_CONT > 0) {
        /** True - False campos */
        this.flagConf = true;
        this.flagFilter = false;
        this.flagGoods = false;
        this.flagTracker = false;
        this.flagGenera = false;
        this.form.get('authorizeType').enable();
        this.form.get('authorizeCve').enable();
        this.form.get('authorizeDate').enable();
      } else {
        this.alert(
          'warning',
          '',
          'Para Poder Autorizar la Solicitud es Necesario que se Tengan Bienes Registrados.'
        );
      }
    } else {
      this.alert(
        'warning',
        '',
        'Para Poder Autorizar la Solicitud es Necesario Haber Generado un Paquete Previamente Además de que los Campos Solicitud, Donatario, Fecha de Solicitud y Justificación Tengan Valor.'
      );
    }
  }
}

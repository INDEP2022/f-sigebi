/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import { IDepositaryAppointments } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import {
  IPaymentsGensDepositary,
  IRefPayDepositary,
  ISendSirSaeBody,
  ITotalAmountRefPayments,
  ITotalIvaPaymentsGens,
} from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { QueryRelatedPaymentsService } from '../services/query-related-payments.service';
import {
  PAY_BANK_COLUMNS,
  RECEIVED_PAYS_COLUMNS,
} from './columns/query-related-payment.columns';
import {
  ERROR_GOOD_NULL,
  ERROR_GOOD_PARAM,
  NOT_FOUND_GOOD,
  NOT_FOUND_GOOD_APPOINTMENT,
  NOT_FOUND_GOOD_DESCRIPTION,
  NOT_FOUND_PAYMENTS_BANK,
  NOT_FOUND_PAYMENTS_BANK_TOTALS,
  NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS,
  NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS_TOTALS,
} from './utils/query-related-payments-depositaries.messages';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-query-related-payments-depositories',
  templateUrl: './query-related-payments-depositories.component.html',
  styleUrls: ['./query-related-payments-depositories.component.scss'],
})
export class QueryRelatedPaymentsDepositoriesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  public formDepositario: FormGroup;
  public formBienDetalle: FormGroup;
  public noBienReadOnly: number = null;
  // Tables data Pagos Bancos
  tableSettingsPagosBanco = { ...TABLE_SETTINGS };
  dataPagosBanco: IRefPayDepositary[] = [];
  dataTablePayBanks: LocalDataSource = new LocalDataSource();
  paramsPayBanks = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsPayBanks: number = 0;
  totalAmountPayBanks: number = 0;
  loadingTablePayBanks: boolean = false;
  // Tables data Pagos Recibidos
  tableSettingsPagosRecibidos = { ...TABLE_SETTINGS };
  dataPagosRecibidos: IPaymentsGensDepositary[] = [];
  dataTableReceivedPays: LocalDataSource = new LocalDataSource();
  paramsReceivedPays = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsReceivedPays: number = 0;
  totalAmountWithoutIva: number = 0;
  totalAmountIva: number = 0;
  totalAmountActualPay: number = 0;
  loadingTableReceivedPays: boolean = false;
  // Data
  sendSirsae: ISendSirSaeBody;
  depositaryAppointment: IDepositaryAppointments;
  good: IGood;
  payIdSelected: IRefPayDepositary;
  // Loading
  loadingAppointment: boolean = false;
  loadingGood: boolean = false;
  loadingGoodAccount: boolean = false;
  loadingSirsaeProcess: boolean = false;
  // Send Sirsae
  totalItemsSirsae: number = 0;
  currentItemSirsae: number = 0;
  currentPageSirsae: number = 0;
  errorSirSae: number = 0;
  // Errores de Sirsae
  errorsSirsae: any[] = [];
  screenKey: string = 'FCONDEPODISPAGOS';
  origin: string = null;
  noBienParams: number = null;

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  goods = new DefaultSelect<IGood>();
  goodSelect: IGood;

  constructor(
    private fb: FormBuilder,
    private svQueryRelatedPaymentsService: QueryRelatedPaymentsService,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private personService: PersonService,
    private service: GoodFinderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.noBienParams = params['goodNumber']
          ? Number(params['goodNumber'])
          : null;
        this.origin = params['origin'] ?? null;
        console.log(params);
      });
    this.errorsSirsae = [];
    this.loadingSirsaeProcess = false;
    this.loadingGoodAccount = false;
    this.prepareForm();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      if (!isNaN(Number(id))) {
        this.noBienReadOnly = Number(id);
        this.form.get('noBien').setValue(this.noBienReadOnly);
        // this.validGoodNumberInDepositaryAppointment();
        let param = new ListParams();
        param.text = this.form.value.noBien;
        this.getGoodsSheard(param, true);
      } else {
        this.alert('warning', 'No. de bien', ERROR_GOOD_PARAM);
      }
    }
    // Pagos Bancos
    this.tableSettingsPagosBanco.actions = {
      columnTitle: '',
      position: '',
      add: false,
      edit: false,
      delete: false,
    };
    this.tableSettingsPagosBanco.columns = { ...PAY_BANK_COLUMNS };
    // Pagos recibidos
    this.tableSettingsPagosRecibidos.actions = {
      columnTitle: '',
      position: '',
      add: false,
      edit: false,
      delete: false,
    };
    this.tableSettingsPagosRecibidos.columns = { ...RECEIVED_PAYS_COLUMNS };
    this.startTablePaymentBank();
    this.startTablePaymentReceive();
  }

  startTablePaymentBank() {
    this.dataPagosBanco = [];
    this.dataTablePayBanks.load([]);
    this.totalItemsPayBanks = 0;
    this.totalAmountPayBanks = 0;
    this.dataTablePayBanks.reset();
    this.loadingTablePayBanks = false;
  }

  startTablePaymentReceive() {
    this.dataPagosRecibidos = [];
    this.dataTableReceivedPays.load([]);
    this.totalItemsReceivedPays = 0;
    this.totalAmountWithoutIva = 0;
    this.totalAmountIva = 0;
    this.totalAmountActualPay = 0;
    this.dataTableReceivedPays.reset();
    this.loadingTableReceivedPays = false;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ], //*
      cveContrato: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ], //*
      nombramiento: [{ value: '', disabled: false }, [Validators.maxLength(6)]], //*
      fecha: [{ value: '', disabled: true }, [Validators.maxLength(11)]], //*
      contraprestaciones: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(11)],
      ], //*
    });
    this.formDepositario = this.fb.group({
      idDepositario: [
        { value: '', disabled: false },
        [Validators.required, Validators.maxLength(30)],
      ], //*
      depositario: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ], //*
    });
    this.formBienDetalle = this.fb.group({
      idBien: [
        { value: '', disabled: false },
        [Validators.maxLength(11), Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ], //*
      descripcion: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ], //*
      cantidad: [{ value: '', disabled: false }, [Validators.maxLength(21)]], //*
      estatus: [{ value: '', disabled: false }, [Validators.maxLength(3)]], //*
      estatusDescription: [
        { value: '', disabled: false },
        [Validators.maxLength(300)],
      ], //*
    });
  }

  btnExportarExcel(): any {
    console.log('Exportar Excel');
    // SE MANDA AL BACK PARA OBTENER EL REPORTE
    if (this.form.get('noBien').valid) {
      if (!this.noBienReadOnly) {
        this.alert(
          'warning',
          'No. de bien',
          'Carga la información del bien primero para continuar'
        );
        return;
      }
      this.loadingGoodAccount = true;
      this.svQueryRelatedPaymentsService
        .getExportExcell(this.noBienReadOnly)
        .subscribe({
          next: res => {
            this.downloadFile(
              res,
              `ESTADO_DE_CUENTA_DEL_BIEN_${
                this.noBienReadOnly
              }_${new Date().getTime()}`
            );
          },
          error: err => {
            this.loadingGoodAccount = false;
            this.alert(
              'warning',
              'No. de bien',
              NOT_FOUND_GOOD(
                err.error.message && err.status != 400
                  ? err.error.message
                  : 'Error en el servidor'
              )
            );
          },
        });
    } else {
      this.alert('warning', 'No. de bien', ERROR_GOOD_NULL);
    }
  }

  downloadFile(base64: any, fileName: any) {
    const linkSource = `data:file/csv;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName + '.csv';
    downloadLink.target = '_blank';
    this.loadingGoodAccount = false;
    downloadLink.click();
    downloadLink.remove();
  }

  btnEnviarSIRSAE(): any {
    if (!this.dataPagosBanco[0] && !this.depositaryAppointment) {
      return;
    }
    if (this.loadingSirsaeProcess) {
      return;
    }
    console.log('Envíar a SIRSAE');
    this.form.get('noBien').disable();
    this.startSirsaeValues();
    this.sendSirsaeGetPayDepositories();
  }

  closeSendSirsae() {
    this.startSirsaeValues();
    this.loadingSirsaeProcess = false;
  }

  startSirsaeValues() {
    this.errorsSirsae = [];
    this.loadingSirsaeProcess = true;
    this.totalItemsSirsae = 0;
    this.currentItemSirsae = 0;
    this.currentPageSirsae = 1;
    this.errorSirSae = 0;
  }

  btnImprimir(): any {
    console.log('Imprimir');
    // LLAMAR PANTALLA FCONDEPOREPINGXBIEN - ordenes de ingreso x bien en depositaria
    // PASAR SOLO EL NO. DE bIEN
    // this.alert('info', 'LLAMAR PANTALLA FCONDEPOREPINGXBIEN', '');
    if (this.form.get('noBien').valid) {
      if (!this.noBienReadOnly) {
        this.alert(
          'warning',
          'No. de bien',
          'Carga la información del bien primero para continuar'
        );
        return;
      }
      this.svQueryRelatedPaymentsService.setGoodParamGood(
        this.noBienReadOnly,
        this.screenKey,
        this.depositaryAppointment.contractKey,
        this.depositaryAppointment.personNumber.id.toString(),
        this.good.description
      ); // Set good param
      this.router.navigate(
        ['/pages/juridical/depositary/income-orders-depository-goods'],
        {
          queryParams: {
            origin: this.screenKey,
            origin2: this.origin,
            p_bien: this.noBienReadOnly,
          },
        }
      );
    } else {
      this.alert('warning', 'No. de bien', ERROR_GOOD_NULL);
    }
  }

  btnActualizarPago(): any {
    console.log('Actualizar Pago');
    // LLAMAR PANTALLA FCARGAPAGOSDEP - Carga Pagos Depositarias
    // PENDIENTE DE MANDAR PARAMETROS
    // this.alert('info', 'LLAMAR PANTALLA FCARGAPAGOSDEP', '');
    this.router.navigate(['/pages/juridical/depositary/depository-fees'], {
      queryParams: {
        origin: this.screenKey,
        origin2: this.origin,
        p_bien: this.noBienReadOnly,
      },
    });
  }

  async validGoodNumberInDepositaryAppointment() {
    if (this.form.get('noBien').valid) {
      this.loadingAppointment = true;
      this.noBienReadOnly = this.form.get('noBien').value;
      // const params = new FilterParams();
      // params.removeAllFilters();
      // params.addFilter('goodNumber', this.noBienReadOnly);
      // params.addFilter('revocation', 'N');
      let params = new ListParams();
      params['filter.goodNum'] = this.noBienReadOnly;
      params['filter.revocation'] = 'N';
      console.log(params);
      await this.svQueryRelatedPaymentsService
        .getGoodAppointmentDepositaryByNoGood(params)
        .subscribe({
          next: res => {
            this.loadingAppointment = false;
            this.depositaryAppointment = res.data[0];
            this.setDataDepositaryAppointment(); // Set data depositary
            if (this.depositaryAppointment.personNum) {
              const params = new FilterParams();
              params.removeAllFilters();
              params.addFilter('id', this.depositaryAppointment.personNum);
              this.personService.getAllFilters().subscribe({
                next: res => {
                  console.log(res);
                  this.depositaryAppointment.personNumber = res.data[0];
                  if (this.depositaryAppointment.personNumber.id) {
                    this.setDataDepositary(); // Set data Person
                  }
                },
                error: err => {
                  console.log(err);
                },
              });
            }
            this.startTablePaymentBank();
            this.startTablePaymentReceive();
            this.getGoodData();
          },
          error: err => {
            this.loadingAppointment = false;
            this.alert(
              'warning',
              'No. de bien',
              NOT_FOUND_GOOD_APPOINTMENT(
                err.error.message && err.status != 400
                  ? err.error.message
                  : 'Error en el servidor'
              )
            );
          },
        });
    } else {
      this.alert('warning', 'No. de bien', ERROR_GOOD_NULL);
    }
  }

  async getGoodData() {
    this.loadingGood = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('goodId', this.noBienReadOnly);
    await this.svQueryRelatedPaymentsService
      .getGoodDataByFilter(params.getParams())
      .subscribe({
        next: res => {
          this.good = res.data[0]; // Set data good
          this.setDataGood();
          this.getStatusGoodByNoGood();
          this.loadingGood = false;
          // this.getDataPaymentsInBank();
          this.paramsPayBanks
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDataPaymentsInBank());
        },
        error: err => {
          this.loadingGood = false;
          this.alert(
            'warning',
            'No. de bien',
            NOT_FOUND_GOOD(
              err.error.message && err.status != 400
                ? err.error.message
                : 'Error en el servidor'
            )
          );
        },
      });
  }

  getGoodsSheard(params: ListParams, getByValue: boolean = false) {
    //Provisional data
    console.log(params);
    // this.searchTabForm.controls['noBien'].disable();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.loading = true;
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    if (!isNaN(parseFloat(params.text)) && isFinite(+params.text)) {
      if (params.text != undefined && params.text != '') {
        data.addFilter('id', params.text, SearchFilter.EQ);
      }
    } else {
      if (params.text != undefined && params.text != '') {
        data.addFilter('description', params.text, SearchFilter.ILIKE);
      }
    }
    this.service.getAll2(data.getParams()).subscribe({
      next: data => {
        this.goods = new DefaultSelect(data.data, data.count);
        this.loading = false;
        console.log('DATA GOOD ', this.goods);
        if (getByValue == true) {
          // this.onChangeGood(this.goods.data[0]);
          this.form.get('noBien').setValue(this.goods.data[0].id);
          this.validGoodNumberInDepositaryAppointment();
        }
      },
      error: err => {
        this.goods = new DefaultSelect([], 0, true);
        this.loading = false;
      },
    });
  }
  onChangeGood(event: IGood) {
    console.log(event);
    this.goodSelect = event;
    this.goods = new DefaultSelect([event], 1, true);
    if (event) {
      this.validGoodNumberInDepositaryAppointment();
    } else {
      this.depositaryAppointment = null;
      this.form.reset();
      this.formDepositario.reset();
      this.formBienDetalle.reset();
      this.startTablePaymentBank();
      this.startTablePaymentReceive();
      this.closeSendSirsae();
    }
  }

  async getStatusGoodByNoGood() {
    let bodyRequest: IDescriptionByNoGoodBody = {
      goodNumber: this.noBienReadOnly,
    };
    await this.svQueryRelatedPaymentsService
      .getDescriptionGoodByNoGood(bodyRequest)
      .subscribe({
        next: res => {
          if (res.data.length > 0) {
            // let status = this.formBienDetalle.get('estatus').value;
            this.formBienDetalle
              .get('estatusDescription')
              .setValue(res.data[0].description);
          }
        },
        error: err => {
          this.onLoadToast(
            'warning',
            'Descripción del bien',
            NOT_FOUND_GOOD_DESCRIPTION(
              err.error.message && err.status != 400
                ? err.error.message
                : 'Error en el servidor'
            )
          );
        },
      });
  }

  setDataDepositaryAppointment() {
    this.form
      .get('nombramiento')
      .setValue(this.depositaryAppointment.appointmentNum);
    this.form
      .get('contraprestaciones')
      .setValue(
        this.formatTotalAmount(
          Number(this.depositaryAppointment.amountConsideration)
        )
      );
    this.form
      .get('cveContrato')
      .setValue(this.depositaryAppointment.contractKey);
    let fecha = this.datePipe.transform(
      this.depositaryAppointment.startContractDate,
      'dd/MM/yyyy'
    );
    this.form.get('fecha').setValue(fecha);
  }

  setDataDepositary() {
    this.formDepositario
      .get('idDepositario')
      .setValue(this.depositaryAppointment.personNumber.id);
    this.formDepositario
      .get('depositario')
      .setValue(this.depositaryAppointment.personNumber.name);
  }

  setDataGood() {
    this.formBienDetalle.get('idBien').setValue(this.good.goodId);
    this.formBienDetalle.get('descripcion').setValue(this.good.description);
    this.formBienDetalle.get('cantidad').setValue(this.good.quantity);
    this.formBienDetalle.get('estatus').setValue(this.good.status);
  }

  async getDataPaymentsInBank() {
    this.loadingTablePayBanks = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('noGood', this.noBienReadOnly);
    params.addFilter('amount', 0, SearchFilter.GTE);
    params['sortBy'] = 'payId:DESC';
    params.page = this.paramsPayBanks.value.page;
    params.limit = this.paramsPayBanks.value.limit;
    await this.svQueryRelatedPaymentsService
      .getRefPayDepositories(params.getParams())
      .subscribe({
        next: res => {
          this.dataPagosBanco = res.data;
          this.getTotalAmountPayments();
          this.totalItemsPayBanks = res.count || 0;
          this.dataTablePayBanks.load(res.data);
          this.dataTablePayBanks.refresh();
          this.loadingTablePayBanks = false;
        },
        error: err => {
          this.dataTablePayBanks.load([]);
          this.totalItemsPayBanks = 0;
          this.dataTablePayBanks.refresh();
          this.loadingTablePayBanks = false;
          this.alert(
            'warning',
            'Pagos recibidos en el banco',
            NOT_FOUND_PAYMENTS_BANK(
              err.error.message && err.status != 400
                ? err.error.message
                : 'Error en el servidor'
            )
          );
        },
      });
  }

  getTotalAmountPayments() {
    let params: ITotalAmountRefPayments = {
      goodNumber: this.noBienReadOnly,
      amount: 0,
    };
    this.svQueryRelatedPaymentsService
      .getRefPayDepositoriesTotals(params)
      .subscribe({
        next: res => {
          this.totalAmountPayBanks = parseFloat(res.data[0].totalamount);
        },
        error: err => {
          this.onLoadToast(
            'warning',
            'Suma del depósito de los pagos recibidos en el banco',
            NOT_FOUND_PAYMENTS_BANK_TOTALS(
              err.error.message && err.status != 400
                ? err.error.message
                : 'Error en el servidor'
            )
          );
        },
      });
  }

  selectRow(event: any, rowData: IRefPayDepositary) {
    if (event.isSelected) {
      if (rowData) {
        if (rowData.payId) {
          this.payIdSelected = rowData;
          this.paramsReceivedPays
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDataPaymentsDispersion());
        } else {
          this.payIdSelected = null;
          this.startTablePaymentReceive();
        }
      } else {
        this.payIdSelected = null;
        this.startTablePaymentReceive();
      }
    } else {
      this.payIdSelected = null;
      this.startTablePaymentReceive();
    }
  }

  async getDataPaymentsDispersion() {
    this.loadingTableReceivedPays = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('noGoods', this.noBienReadOnly);
    params.addFilter('payId', this.payIdSelected.payId);
    params['sortBy'] = 'payIdGens:DESC';
    params.page = this.paramsReceivedPays.value.page;
    params.limit = this.paramsReceivedPays.value.limit;
    await this.svQueryRelatedPaymentsService
      .getPaymentsGensDepositories(params.getParams())
      .subscribe({
        next: res => {
          this.dataPagosRecibidos = res.data;
          this.getTotalsPaymentsGens();
          this.totalItemsReceivedPays = res.count || 0;
          this.dataTableReceivedPays.load(res.data);
          this.dataTableReceivedPays.refresh();
          this.loadingTableReceivedPays = false;
        },
        error: err => {
          this.dataTableReceivedPays.load([]);
          this.totalItemsReceivedPays = 0;
          this.dataTableReceivedPays.refresh();
          this.loadingTableReceivedPays = false;
          this.alert(
            'warning',
            'Composición de pagos recibidos',
            NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS(
              err.error.message && err.status != 400
                ? err.error.message
                : 'Error en el servidor'
            )
          );
        },
      });
  }

  getTotalsPaymentsGens() {
    let params: ITotalIvaPaymentsGens = {
      goodNumber: this.noBienReadOnly,
      payId: this.payIdSelected.payId,
    };
    this.svQueryRelatedPaymentsService
      .getPaymentsGensDepositoriesTotals(params)
      .subscribe({
        next: res => {
          this.totalAmountWithoutIva = parseFloat(res.data[0].totalwiva);
          this.totalAmountIva = parseFloat(res.data[0].totaliva);
          this.totalAmountActualPay = parseFloat(res.data[0].totalpay);
        },
        error: err => {
          this.onLoadToast(
            'warning',
            'Sumas del monto sin iva, monto con iva y el pago actual de la composición de pagos recibidos',
            NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS_TOTALS(
              err.error.message && err.status != 400
                ? err.error.message
                : 'Error en el servidor'
            )
          );
        },
      });
  }

  formatTotalAmount(numberParam: number) {
    if (numberParam) {
      return new Intl.NumberFormat('es-MX').format(numberParam);
    } else {
      return '0.00';
    }
  }

  async sendSirsaeGetPayDepositories() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('noGood', this.noBienReadOnly);
    params.addFilter('amount', 0, SearchFilter.GTE);
    params['sortBy'] = 'payId:DESC';
    params.page = this.currentPageSirsae;
    params.limit = 10;
    await this.svQueryRelatedPaymentsService
      .getRefPayDepositories(params.getParams())
      .subscribe({
        next: res => {
          this.totalItemsSirsae = res.count;
          this.listResponseDataPayments(res.data);
        },
        error: err => {
          this.currentItemSirsae =
            this.currentItemSirsae + 10 > this.totalItemsSirsae
              ? this.totalItemsSirsae
              : this.currentItemSirsae + 10;
          this.currentPageSirsae++;
          if (this.currentItemSirsae < this.totalItemsSirsae) {
            this.listResponseDataPayments([]);
          } else if ((this.currentItemSirsae = this.totalItemsSirsae)) {
            // console.log(
            //   'FIN PROCESO',
            //   this.currentItemSirsae,
            //   this.currentPageSirsae,
            //   this.totalItemsSirsae,
            //   this.errorsSirsae
            // );
            this.loadingSirsaeProcess = false;
            this.form.get('noBien').enable();
          }
        },
      });
  }

  listResponseDataPayments(data: IRefPayDepositary[]) {
    if (data.length > 0) {
      this.sendSirsaeFunction(data.length, 0, data);
    } else {
      if (this.currentItemSirsae < this.totalItemsSirsae) {
        this.sendSirsaeGetPayDepositories();
      } else if ((this.currentItemSirsae = this.totalItemsSirsae)) {
        // console.log(
        //   'FIN PROCESO',
        //   this.currentItemSirsae,
        //   this.currentPageSirsae,
        //   this.totalItemsSirsae,
        //   this.errorsSirsae
        // );
        this.loadingSirsaeProcess = false;
        this.form.get('noBien').enable();
        if (this.errorSirSae > 0) {
          this.alert(
            'warning',
            'Ocurrió un error en el proceso, intente nuevamente',
            'Se mostrará un excel con detalles de los errores por cada registro procesado'
          );
        } else {
          this.alert('success', 'Proceso terminado ', '');
        }
      }
    }
  }

  async sendSirsaeFunction(
    dataLength: number,
    count: number,
    dataComplete: IRefPayDepositary[]
  ) {
    this.sendSirsae = {
      process: 1,
      appointment: Number(this.depositaryAppointment.appointmentNum),
      idorderincome: String(dataComplete[count].entryorderid),
      validSystem: dataComplete[count].validSystem,
      shipmentOi: dataComplete[count].sent_oi,
      peopleNumber: Number(dataComplete[count].client_id),
      idPay: dataComplete[count].payId,
    };
    console.log(this.sendSirsae);
    this.svQueryRelatedPaymentsService.sendSirsae(this.sendSirsae).subscribe({
      next: (res: any) => {
        this.currentItemSirsae++;
        let obj: any = {};
        obj = dataComplete[count];
        obj['errores'] = res.lstError ? res.lstError : 'Sin errores';
        obj['lstLot'] = res.lstLot ? res.lstLot : 'Sin errores';
        this.errorsSirsae.push(obj);
        if (dataLength == count + 1) {
          this.currentPageSirsae++;
          this.listResponseDataPayments([]);
        } else {
          count++;
          this.sendSirsaeFunction(dataLength, count, dataComplete);
        }
      },
      error: err => {
        this.errorSirSae++;
        this.currentItemSirsae++;
        let obj: any = {};
        obj = dataComplete[count];
        if (err.status == 500) {
          obj['errores'] = 'Error al procesar este registro';
          obj['lstLot'] = 'Realice el proceso nuevamente de envio SIRSAE';
        } else {
          obj['errores'] = err.error.message
            ? err.error.message.includes('duplicate key')
              ? 'Ya existe un registro en Sirsae de este pago'
              : 'Error en el Servidor'
            : 'Error en el Servidor';
          obj['lstLot'] = err.error.message
            ? err.error.message.includes('duplicate key')
              ? 'Ya existe un registro en Sirsae de este pago'
              : 'Error en el Servidor'
            : 'Error en el Servidor';
        }
        this.errorsSirsae.push(obj);
        if (dataLength == count + 1) {
          this.currentPageSirsae++;
          this.listResponseDataPayments([]);
        } else {
          count++;
          this.sendSirsaeFunction(dataLength, count, dataComplete);
        }
      },
    });
  }

  exportXlsx() {
    if (this.errorsSirsae.length == 0) {
      this.onLoadToast(
        'warning',
        'Ejecute el proceso de "Enviar Sirsae" primero',
        ''
      );
    }
    let dataChangeNames = this.setNombreData(this.errorsSirsae);
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(dataChangeNames, {
      filename: `Detalles_Envio_Sirsae${new Date().getTime()}`,
    });
  }

  setNombreData(data: any[]) {
    let dataSet: any[] = [];
    let payBankFields: any = PAY_BANK_COLUMNS;
    data.forEach(elementData => {
      let newObj: any = {};
      for (const key in elementData) {
        if (Object.prototype.hasOwnProperty.call(elementData, key)) {
          if (key == 'errores') {
            newObj['Error(es)'] = elementData[key];
          } else if (key == 'lstLot') {
            newObj['Detalle(s) Error(es)'] = elementData[key];
          } else {
            if (payBankFields[key]) {
              newObj[payBankFields[key as keyof typeof payBankFields].title] =
                elementData[key];
            }
          }
        }
      }
      dataSet.push(newObj);
    });
    return dataSet;
  }

  goBack() {
    if (this.origin == 'FCONDEPOCONCILPAG') {
      this.router.navigate([
        '/pages/juridical/depositary/payment-dispersion-process/conciliation-depositary-payments/' +
          this.noBienParams,
      ]);
    }
  }
}

import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { RequestNumeraryDetService } from 'src/app/core/services/ms-numerary/request-numerary-det.service';
import { TransRegService } from 'src/app/core/services/ms-numerary/transf-reg.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EmailComponent } from '../email/email.component';
import { DetailNum } from './detail.model';
import { REGIONAL_ACCOUNT_COLUMNS } from './regional-account-columns';
interface IExcelToJson {
  expediente: number;
  bien: number;
}
@Component({
  selector: 'app-regional-account-transference',
  templateUrl: './regional-account-transference.component.html',
  styles: [],
})
export class RegionalAccountTransferenceComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  total = '22,891.26';
  data1: any[] = [];
  dataTable: DetailNum[] = [];
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  data: IExcelToJson[] = [];
  delegations: DefaultSelect = new DefaultSelect([], 0);
  moneda = [
    {
      label: 'MN',
      value: 'MN',
    },
    {
      label: 'USD',
      value: 'USD',
    },
  ];
  @ViewChild('file', { static: false }) files: ElementRef<HTMLInputElement>;
  isNew: boolean = false;
  description: string = '';
  delegation: number;

  constructor(
    private fb: FormBuilder,
    private tranfergoodService: TranfergoodService,
    private goodProcessService: GoodProcessService,
    private parametersService: ParametersService,
    private delegationService: DelegationService,
    private transferRegService: TransRegService,
    private datePipe: DatePipe,
    private transferGood: TranfergoodService,
    private securityService: SecurityService,
    private modalService: BsModalService,
    private dictationService: DictationService,
    private bankService: BankAccountService,
    private requestNumDetService: RequestNumeraryDetService,
    private receptionService: DocReceptionRegisterService,
    private user: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REGIONAL_ACCOUNT_COLUMNS,
    };

    const params = new FilterParams();
    const token = this.user.decodeToken();
    params.addFilter('user', token.username.toUpperCase());
    this.receptionService.getUsersSegAreas(params.getParams()).subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.delegation = response.data[0].delegationNumber;
        }
      },
      error: () => {},
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCatalogDelegation();

    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.totalItems > 0) this.getTransDetail();
      },
    });
  }

  getTransDetail() {
    this.loading = true;
    this.transferGood
      .getAllFilter(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading = false;
          resp.data.map((trans: any) => {
            trans.file = trans.goods ? trans.goods.noProceedings : '';
            trans.description = trans.goods ? trans.goods.description : '';
            trans.status = trans.goods ? trans.goods.status : '';
            trans.val1 = trans.goods ? trans.goods.val1 : '';
          });

          this.dataTable = [...resp.data];
          this.totalItems = resp.count;
        },
        error: err => {
          this.loading = false;
          this.dataTable = [];
          this.alert('error', 'Error', err.error.message);
        },
      });
  }

  async getCatalogDelegation() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${year}/${month}/${day}`;
    const etapa = await this.getFaStageCreda(SYSDATE);

    const filter = new FilterParams();
    filter.addFilter('etapaEdo', etapa, SearchFilter.EQ);
    filter.sortBy = 'id:ASC';
    filter.limit = 50;
    this.delegationService.getAll(filter.getParams()).subscribe({
      next: resp => {
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.delegations = new DefaultSelect();
      },
    });
  }

  getDataPreview() {
    const { idRequest, transferenceReport } = this.form.value;

    if (transferenceReport) {
      this.alert(
        'warning',
        'Atención',
        `No puede agregar más bienes a este reporte: ${transferenceReport}`
      );
    } else if (idRequest) {
      this.loading = true;
      this.goodProcessService
        .getPubPrevieData({ idSolNum: idRequest })
        .subscribe({
          next: resp => {
            this.loading = false;
            resp.data.map((trans: any) => {
              trans.file = trans.noExpediente ? trans.noExpediente : '';
              trans.description = trans.descripcion ? trans.descripcion : '';
              trans.status = trans.estatus ? trans.estatus : '';
              trans.val1 = trans.val1 ? trans.val1 : '';
              trans.goodNumber = trans.noBien ? trans.noBien : '';
              trans.allInterest = trans.totInteres ? trans.totInteres : '';
            });

            const date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

            this.form.get('dateReport').patchValue(date);

            this.dataTable = [...resp.data];
            //this.totalItems = resp.data.length;
          },
          error: err => {
            this.alert('warning', 'Atención', err.error.message);
            this.loading = false;
            this.dataTable = [];
          },
        });
    } else {
      this.alert(
        'warning',
        'Atención',
        'Ingrese un id solicitud para la consulta'
      );
    }
  }

  async getFaStageCreda(data: any) {
    return firstValueFrom(
      this.parametersService.getFaStageCreda(data).pipe(
        catchError(error => {
          return of(null);
        }),
        map(resp => resp.stagecreated)
      )
    );
  }

  searchRegional() {
    const { transferenceReport, dateReport, historicCheck } = this.form.value;
    const filter = new FilterParams();

    if (!transferenceReport && !dateReport && !historicCheck) {
      return;
    }

    if (transferenceReport)
      filter.addFilter('reportNumber', transferenceReport, SearchFilter.EQ);
    if (dateReport)
      filter.addFilter('repDate', this.getDate(dateReport), SearchFilter.EQ);
    if (historicCheck)
      filter.addFilter(
        'historical',
        historicCheck ? 'SI' : 'NO',
        SearchFilter.EQ
      );

    this.transferRegService.getAllFilter(filter.getParams()).subscribe({
      next: resp => {
        const data = resp.data[0];
        this.isNew = true;
        this.form.get('transferenceReport').patchValue(data.reportNumber);
        this.form
          .get('dateReport')
          .patchValue(
            data.repDate ? data.repDate.split('-').reverse().join('/') : ''
          );
        this.form
          .get('historicCheck')
          .patchValue(
            data.historical ? (data.historical == 'SI' ? true : false) : false
          );
        this.form.get('currencyType').patchValue(data.currencyKey);
        this.form.get('delegation').patchValue(data.delegationNumber);
        this.form.get('folioCash').patchValue(data.invoiceCwNumber);
        this.form
          .get('transactionDate')
          .patchValue(
            data.transDate ? data.transDate.split('-').reverse().join('/') : ''
          );
        this.form.get('cveAccount').patchValue(data.accountKey);
        this.form.get('total').patchValue(data.amountAll);

        this.form.get('monto2').patchValue(data.amountAll);

        this.filterParams.getValue().removeAllFilters();
        this.filterParams.getValue().page = 1;
        this.filterParams
          .getValue()
          .addFilter('numberReport', data.reportNumber, SearchFilter.EQ);

        this.getTransDetail();
        this.getAccount();
      },
      error: err => {
        this.alert('error', 'Error', err.error.message);
      },
    });
  }

  getDate(date: any) {
    let newDate;
    if (typeof date == 'string') {
      newDate = String(date).split('/').reverse().join('-');
    } else {
      newDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    }
    return newDate;
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null],
      idRequest: [null],

      transferenceReport: [null],
      dateReport: [null],

      historicCheck: [null],

      currencyType: [null],
      delegation: [null],
      folioCash: [null],
      transactionDate: [null],

      cveAccount: [null],
      accountType: [null],
      cveBank: [null],
      cveCurrency: [null],
      total: [null],
      monto2: [null],
    });
  }

  onFileChange(event: Event) {
    const { transferenceReport } = this.form.value;

    if (transferenceReport) {
      this.alert(
        'warning',
        'Atención',
        `No puede agregar más bienes a este reporte: ${transferenceReport}`
      );
      return;
    }

    this.loading = true;
    const file = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', file);
    this.getDataFile(formData);
  }

  getDataFile(formData: FormData) {
    this.data1 = [];
    this.tranfergoodService.getFileCSV(formData).subscribe({
      next: resp => {
        this.loading = false;
        resp.data.map((trans: any) => {
          trans.file = trans.NO_EXPEDIENTE ? trans.NO_EXPEDIENTE : '';
          trans.description = trans.DESCRIPCION ? trans.DESCRIPCION : '';
          trans.status = trans.ESTATUS ? trans.ESTATUS : '';
          trans.val1 = trans.VAL1 ? trans.VAL1.trim() : '';
          trans.val14 = trans.VAL14 ? Number(trans.VAL14.trim()) : 0;
          trans.goodNumber = trans.NO_BIEN ? trans.NO_BIEN : 0;
          trans.allInterest = trans.TOT_INTERES ? Number(trans.TOT_INTERES) : 0;
          trans.total = Number(trans.val14) + Number(trans.allInterest);

          const sum = Number(this.form.get('monto2').value ?? 0) + trans.total;

          this.form.get('monto2').patchValue(sum);
        });

        const date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

        this.form.get('dateReport').patchValue(date);

        this.dataTable = [...(resp.data as any)];
        this.totalItems = resp.data.length;
        this.files.nativeElement.value = '';
      },
      error: err => {
        this.loading = false;
        this.alert('error', 'Error', err.error.message);
        this.files.nativeElement.value = '';
      },
    });
  }

  clear() {
    this.form.get('transactionDate').patchValue(null);
    this.files.nativeElement.value = '';
    this.totalItems = 0;
    this.dataTable = [];
    this.form.reset();
  }

  async sendEmail() {
    const { transferenceReport } = this.form.value;

    if (transferenceReport) {
      const email = await this.getDataMail();

      if (email) {
        if (email.ALERTA) {
          this.alert('warning', email.ALERTA, '');
        }

        const emailv2 = {
          ...email,
          REPORTE: transferenceReport,
        };

        let config: ModalOptions = {
          initialState: {
            email: emailv2,
            report: this.form.value,
            delegation: this.delegation,
            description: this.description,
            delegations: this.delegations,
            callback: async (next: boolean) => {
              if (next) {
              }
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(EmailComponent, config);
      }
    } else {
      this.alert('warning', 'Atención', 'Primero debe guardar el reporte');
    }
  }

  async getDataMail() {
    const { transferenceReport, delegation } = this.form.value;
    const data = {
      pAffair: 'Depósito de Recursos para Devoluciones',
      pMessage: '',
      pFor: '',
      pCc: '',
      transNumeraryRegNoReport: Number(transferenceReport),
      transNumeraryRegNoDelegation: Number(delegation),
    };
    return firstValueFrom(
      this.securityService.getIniEmail(data).pipe(
        catchError(error => {
          this.alert('warning', 'Atención', error.error.message);
          return of(null);
        }),
        map(resp => resp)
      )
    );
  }

  async save() {
    const {
      delegation,
      folioCash,
      transactionDate,
      dateReport,
      transferenceReport,
    } = this.form.value;

    if (!transferenceReport) {
      // let total: number = 0;

      // for (let index = 0; index < this.dataTable.length; index++) {
      //   const element: any = this.dataTable[index];
      //   total = total + Number(element.total);
      // }

      // this.form.get('monto2').patchValue(total);

      if (!delegation) {
        this.alert(
          'warning',
          'Atención',
          'No a ingresado el número de delegación'
        );
        return;
      } else if (!folioCash) {
        this.alert(
          'warning',
          'Atención',
          'No a ingresado el número de folio CashWindows'
        );
        return;
      } else if (!transactionDate) {
        this.alert(
          'warning',
          'Atención',
          'No a ingresado la fecha de transacción'
        );
        return;
      } else if (
        this.convertDate(transactionDate) > this.convertDate(dateReport)
      ) {
        this.alert(
          'warning',
          'Atención',
          'La fecha de transacción no puede ser mayor a la fecha de reporte'
        );
        return;
      }

      let next: boolean = true;

      for (let index = 0; index < this.dataTable.length; index++) {
        const element: any = this.dataTable[index];

        if (!element.val1) {
          this.alertInfo(
            'warning',
            'Atención',
            'No puede guardar el reporte si el número de bien no tiene tipo de moneda. Ingrese a la pantalla Características del Bien y agregue esta información (Siab/General/Características del Bien)'
          );
          next = false;
          break;
        }
      }

      if (!next) return;

      this.pubInteres();
    } else {
    }
  }

  async procedure(good: number) {
    const body: any = {
      cveShape: 'FTRANSFCUENXREG',
      noGood: good,
    };

    return new Promise((resolve, reject) => {
      this.goodProcessService.procedureGoodStatus(body).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          this.alert(
            'error',
            'Error',
            `No se pudo actualizar el estutas del bien ${good}`
          );
          resolve(true);
        },
      });
    });
  }

  async createTransNumDet(data: any) {
    const { transferenceReport } = this.form.value;
    const body: any = {
      numberReport: transferenceReport,
      goodNumber: data.goodNumber,
      val14: data.val14,
      allInterest: data.allInterest,
      total: data.total,
    };

    return new Promise((resolve, reject) => {
      this.tranfergoodService.create(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: () => {
          resolve(true);
        },
      });
    });
  }

  convertDate(date: Date | string) {
    let newDate;
    const type = typeof date;
    if (type == 'string') {
      newDate = date.toString().split('/').reverse().join('/');
    } else {
      newDate = this.datePipe.transform(date, 'yyyy/MM/dd');
    }
    return new Date(newDate).valueOf();
  }

  async pubInteres() {
    const { currencyType, total, monto2, delegation } = this.form.value;

    const good: any = this.dataTable.length > 0 ? this.dataTable[0] : null;

    if (good.val1 != currencyType) {
      this.form.get('delegation').patchValue(null);
      this.form.get('currencyType').patchValue(null);
      this.form.get('cveAccount').patchValue(null);
      this.form.get('accountType').patchValue(null);
      this.form.get('cveBank').patchValue(null);
      this.form.get('cveCurrency').patchValue(null);

      this.alert(
        'warning',
        'Atención',
        'El tipo de moneda de los bienes ingresados es diferente al tipo de moneda de la cuenta, favor de verificar'
      );

      return;
    }

    let next: boolean = true;

    for (let index = 0; index < this.dataTable.length; index++) {
      const element: any = this.dataTable[index];

      if (!element.allInterest) {
        this.alertInfo(
          'warning',
          'warning',
          `Debe ingresar el intéres del bien: ${element.goodNumber}`
        );
        next = false;
        break;
      }
    }

    if (!next) return;

    for (let index = 0; index < this.dataTable.length; index++) {
      const element: any = this.dataTable[index];

      if (element.total == 0 || !element.total) {
        this.dataTable[index].total = String(
          Number(element.val14) + Number(element.allInterest)
        );
        this.dataTable = [...this.dataTable];
      }
    }

    let totalSuma: number = 0;

    for (let index = 0; index < this.dataTable.length; index++) {
      const element: any = this.dataTable[index];
      totalSuma = totalSuma + Number(element.total);
    }

    this.form.get('monto2').patchValue(totalSuma);

    if (total != totalSuma) {
      this.alert(
        'warning',
        'Atención',
        'El monto ingresado no corresponde al monto calculado, favor de verificar'
      );
      return;
    } else if (!total && total != 0) {
      this.alert(
        'warning',
        'Atención',
        'Debe ingresar el monto total de devolución'
      );
      return;
    }

    for (let good of this.dataTable) {
      await this.pupRegAdm(Number(good.goodNumber), Number(delegation));
    }

    // this.dataTable.map(async good => {
    //   const ban = await this.pupRegAdm(
    //     Number(good.goodNumber),
    //     Number(delegation)
    //   );
    // });

    this.createTransferRegional();
  }

  async pupRegAdm(good: number, delegation: number) {
    const body = {
      F_NOBIEN: good,
      F_NODEL: delegation,
    };

    return firstValueFrom(
      this.dictationService.applicationPufRef(body).pipe(
        catchError(error => {
          this.alert('error', 'Error', error.error.message);
          return of(null);
        }),
        map(resp => resp)
      )
    );
  }

  async createTransferRegional() {
    const {
      currencyType,
      transactionDate,
      total,
      dateReport,
      cveAccount,
      delegation,
      folioCash,
      historicCheck,
    } = this.form.value;

    const body: any = {
      transDate: this.parseDateNoOffset(transactionDate),
      amountAll: total,
      repDate: this.getDate(dateReport),
      accountKey: cveAccount,
      delegationNumber: Number(delegation),
      invoiceCwNumber: folioCash,
      currencyKey: currencyType,
      historical: historicCheck ? 'SI' : 'NO',
    };

    this.transferRegService.create(body).subscribe({
      next: async resp => {
        this.form.get('transferenceReport').patchValue(resp.reportNumber);
        this.alert('success', 'Reporte', 'Creado correctamente');

        for (let good of this.dataTable) {
          await this.procedure(Number(good.goodNumber));
          await this.createTransNumDet(good);
        }

        this.filterParams.getValue().removeAllFilters();
        this.filterParams.getValue().page = 1;
        this.filterParams
          .getValue()
          .addFilter('numberReport', resp.reportNumber, SearchFilter.EQ);
        this.getTransDetail();

        // this.dataTable.map(async (good, index) => {
        //   await this.procedure(Number(good.goodNumber));
        //   await this.createTransNumDet(good);

        //   if (index == this.dataTable.length - 1) {
        //     this.filterParams.getValue().removeAllFilters();
        //     this.filterParams.getValue().page = 1;
        //     this.filterParams
        //       .getValue()
        //       .addFilter('numberReport', resp.reportNumber, SearchFilter.EQ);
        //     this.getTransDetail();
        //   }
        // });
      },
      error: err => {
        this.alert('error', 'Error', err.error.message);
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  getAccount() {
    const { currencyType, delegation } = this.form.value;
    const filter = new FilterParams();

    filter.addFilter('cveCurrency', currencyType, SearchFilter.EQ);
    filter.addFilter('delegationNumber', delegation, SearchFilter.EQ);

    this.bankService.getAllWithFilters(filter.getParams()).subscribe({
      next: resp => {
        const data = resp.data[0];
        this.form.get('cveBank').patchValue(data.cveBank);
        this.form.get('accountType').patchValue(data.accountType);
        this.form.get('cveCurrency').patchValue(data.cveCurrency);
      },
      error: err => {
        this.alert('warning', 'Atención', err.error.message);
      },
    });
  }

  getIdSolum() {
    const { noBien } = this.form.value;

    if (!noBien) return;

    const filter = new FilterParams();

    filter.addFilter('goodNumber', noBien, SearchFilter.EQ);

    this.requestNumDetService.getAllFilter(filter.getParams()).subscribe({
      next: resp => {
        this.form.get('idRequest').patchValue(resp.data[0].solnumId);
        this.alert(
          'warning',
          'Bien Encontrado',
          `Con número de solicitud: ${resp.data[0].solnumId}`
        );
      },
      error: err => {
        if (err.status == 400) {
          this.alert(
            'warning',
            'Atención',
            'Este bien no se encuentra en una solicitud de numerario'
          );
        } else {
          this.alert('error', 'Error', err.error.message);
        }
      },
    });
  }

  changeSelect(del?: any) {
    if (del) {
      this.description = del.description;
    }

    const { currencyType, delegation, transactionDate } = this.form.value;

    if (!currencyType || !delegation || !transactionDate) return;

    let date = '';

    if (transactionDate) {
      if (typeof transactionDate == 'string') {
        date = transactionDate.split('/').reverse().join('-');
      } else {
        date = this.datePipe.transform(transactionDate, 'yyyy-MM-dd');
      }
    }

    const body = {
      delegationNumber: delegation,
      coinkey: currencyType,
      date,
    };

    this.bankService.getDetail(body).subscribe({
      next: (resp: any) => {
        const data = resp.data[0];
        this.form.get('cveAccount').patchValue(data.accountkey);
        this.form.get('cveBank').patchValue(data.bankkey);
        this.form.get('accountType').patchValue(data.accounttype);
        this.form.get('cveCurrency').patchValue(data.coinkey);
      },
      error: error => {},
    });
  }
}

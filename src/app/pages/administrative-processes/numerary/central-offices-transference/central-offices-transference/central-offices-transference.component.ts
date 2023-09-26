import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
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
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { TransRegService } from 'src/app/core/services/ms-numerary/transf-reg.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EmailComponentC } from '../email/email.component';
import { CENTRAL_ACCOUNT_COLUMNS } from './central-offices-columns';

interface IExcelToJson {
  expediente: number;
  bien: number;
}

@Component({
  selector: 'app-central-offices-transference',
  templateUrl: './central-offices-transference.component.html',
  styles: [],
})
export class CentralOfficesTransferenceComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  total: any;
  reporte: any;
  delegacion: any;
  currency: any;
  data1: any[] = [];
  delegation: number = 0;
  data: IExcelToJson[] = [];
  dataTabla: LocalDataSource = new LocalDataSource();
  itemsDelegation = new DefaultSelect();
  columnFilters: any = [];
  data3: LocalDataSource = new LocalDataSource();
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
  description: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  delegations: DefaultSelect = new DefaultSelect([], 0);
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private tranfergoodService: TranfergoodService,
    private elementRef: ElementRef,
    private accountMovementService: AccountMovementService,
    private serviceRNomencla: ParametersService,
    private delegationService: DelegationService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private parametersService: ParametersService,
    private bankService: BankAccountService,
    private dictationService: DictationService,
    private securityService: SecurityService,
    private transferRegService: TransRegService,
    private goodProcessService: GoodProcessService,
    private user: AuthService,
    private receptionService: DocReceptionRegisterService,
    private emailService: EmailService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: CENTRAL_ACCOUNT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getDelegations(new ListParams());
    this.getDataReport();
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

  prepareForm() {
    this.form = this.fb.group({
      noReport: [null, Validators.required],
      dateDevolution: [new Date(), Validators.required],

      currencyType: [null, Validators.required],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      check: [null, Validators.required],
      depositDate: [null, Validators.required],

      cveAccount: [null, Validators.required],
      accountType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cveBank: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      cveCurrency: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      monto2: [null],
      total: [null],
    });

    setTimeout(() => {
      this.getCatalogDelegation();
    }, 1000);
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', files);
    this.getDataFile(formData);
    this.cleanFilter();
  }

  changeSelect(del?: any) {
    if (del) {
      this.description = del.description;
    }

    const { currencyType, delegation, transactionDate } = this.form.value;

    let date = '';
    if (transactionDate) {
      if (typeof transactionDate == 'string') {
        date = transactionDate.split('/').reverse().join('-');
      } else {
        date = this.datePipe.transform(transactionDate, 'yyyy-MM-dd');
      }
    }
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

  asignarDatos(item: any) {
    let registro = {
      file: item.vno_expediente,
      good: item.vno_bien_dev,
    };
    this.data1.push(registro);
    this.dataTabla.load(this.data1);
    this.dataTabla.load(this.data);
    this.totalItems = this.data1.length;
  }

  scrollToDiv() {
    const divElement = this.elementRef.nativeElement.querySelector('#miDiv');
    divElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.cleanFilter();
  }

  getDataReport() {
    this.totalItems = 0;
    this.dataTabla
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'file':
                searchFilter = SearchFilter.EQ;
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
          //this.getDataTranferCounts();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe));
    //.subscribe(() => this.getDataTranferCounts());
  }

  getDataNoReport() {
    this.reporte = this.form.get('noReport').value;
    this.getDataByReport(this.reporte);
    this.getDataTranferCounts(this.reporte);
  }

  getDataByReport(reporte: number) {
    this.prepareForm();
    this.accountMovementService.getByReportDataToTurn(reporte).subscribe({
      next: async (response: any) => {
        const data = response.data;
        this.total = response.data[0].total_sum;
        let dataForm = {
          check: response.data[0].checkNumber,
          cveAccount: response.data[0].accountDevKey,
          cveCurrency: response.data[0].currencyDevKey,
          depositDate: response.data[0].depositDevDate,
          total: this.total,
        };

        this.form.patchValue(dataForm);
        this.delegacion = response.data[0].delegationDevNumber;
        this.currency = response.data[0].currencyDevKey;
        //this.getEdo(response.data[0].delegation);
        this.form
          .get('delegation')
          .patchValue(response.data[0].delegationDevNumber);
        this.form.get('noReport').patchValue(response.data[0].reportDevNumber);
        this.form.get('accountType').patchValue(response.data[0].accountType);
        this.form.get('cveBank').patchValue(response.data[0].cveBank);
        this.getAccount();

        this.form.get('noReport').patchValue(response.data[0].reportDevNumber);
        this.getAcountBank(this.delegacion, this.currency);
        this.form
          .get('depositDate')
          .patchValue(
            response.data[0].depositDevDate.split('-').reverse().join('/')
          );
        this.form.get('total').patchValue(response.data[0].amountTotalDev);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getEdo(id: string) {
    this.serviceRNomencla
      .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
      .subscribe(res => {
        let edo = JSON.parse(JSON.stringify(res['stagecreated']));
        this.getDelegation(id, edo);
      });
  }

  getDelegation(id: string | number, etapaEdo: string) {
    this.delegationService.getByIdEtapaEdo(id, etapaEdo).subscribe({
      next: response => {
        const data = response;
        let dataForm = {
          delegation: response.description,
        };
        this.form.patchValue(dataForm);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getDataTranferCounts(reporte: number) {
    this.data1 = [];
    this.accountMovementService.getByNumberReport(reporte).subscribe({
      next: resp => {
        for (let i = 0; resp.data.length; i++) {
          if (resp.data[i] != undefined) {
            let item = {
              file: resp.data[i].good.fileNumber,
              good: resp.data[i].numberGoodDev,
              description: resp.data[i].good.description,
              import: resp.data[i].val14Dev,
              status: resp.data[i].good.status,
              interests: resp.data[i].allInterestDev,
              total: resp.data[i].totalDev,
              currency: resp.data[i].trasnferDetails.cveCurrencyDev,
            };
            let dataForm = {
              currencyType: resp.data[i].trasnferDetails.cveCurrencyDev,
            };
            this.data1.push(item);
            this.form.patchValue(dataForm);
            this.dataTabla.load(this.data1);
            this.totalItems = resp.count;
          } else {
            this.dataTabla.refresh();
            break;
          }
        }
      },
      error: err => {
        this.alert('error', 'Error', err.error.message);
        this.dataTabla.load([]);
        this.dataTabla.refresh();
        this.totalItems = 0;
        if (err.status == 400) {
          this.alert('error', 'Error', err.error.message);
          this.alert(
            'error',
            'Error',
            'Este bien no se encuentra en una solicitud de numerario'
          );
        } else {
          this.alert('error', 'Error', err.error.message);
        }
      },
    });
  }

  getAcountBank(delegacion: string | number, currency: string) {
    this.accountMovementService
      .getbyDelegationCurrency(delegacion, currency)
      .subscribe({
        next: response => {
          const data = response.data;
          let dataForm = {
            cveBank: response.data[0].cveBank,
            accountType: response.data[0].accountType,
            cveAccount: response.data[0].cveAccount,
          };
          this.form.patchValue(dataForm);
        },
        error: error => {
          console.error(error);
        },
      });
  }

  getDataFile(data: FormData) {
    this.data1 = [];
    this.accountMovementService.getDataFile(data).subscribe({
      next: resp => {
        for (let i = 0; i < resp.procesados.length; i++) {
          let item = {
            file: resp.procesados[i].VNO_EXPEDIENTE,
            good: resp.procesados[i].VNO_BIEN_DEV,
            description: resp.procesados[i].VDESCRIPCION,
            import: resp.procesados[i].VVAL14,
            status: resp.procesados[i].VESTATUS,
            interests: resp.procesados[i].VTOT_INTERES_DEV,
            total: resp.procesados[i].VTOTAL_DEV,
            currency: resp.procesados[i].VCVE_MONEDA_AVALUO,
            total2: resp.procesados[i].total_sum,
          };
          this.data1.push(item);
          console.log(this.data1);
        }
        //this.data1 = resp.data
        this.form.patchValue(resp);
        this.form.get('total').patchValue(resp.total_sum);
        this.total = resp.total_sum;
        //console.log(this.total);
        this.totalItems = this.data1.length;
        this.dataTabla.load(this.data1);

        //console.log('AQUI', this.dataTabla);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  cleanFilter() {
    this.form.get('currencyType').setValue(null);
    this.form.get('delegation').setValue(null);
    this.form.get('check').setValue(null);
    this.form.get('cveAccount').setValue(null);
    this.form.get('cveBank').setValue(null);
    this.form.get('cveCurrency').setValue(null);
    this.form.get('accountType').setValue(null);
    this.form.get('total').setValue(null);
    this.form.get('noReport').setValue(null);
    this.total = null;
    this.totalItems = 0;
    this.data3.load([]);
    this.form.reset();
    this.totalItems = 0;
    this.data1 = [];
    this.dataTabla.load([]);
    this.data3.refresh();
  }

  createTransferCentral() {
    const {
      currencyType,
      dateDevolution,
      total,
      depositDate,
      cveAccount,
      delegation,
      check,
    } = this.form.value;

    const body: any = {
      depositDevDate: this.parseDateNoOffset(depositDate),
      amountTotalDev: total,
      reportDevDate: this.getDate(dateDevolution),
      accountDevKey: cveAccount,
      delegationDevNumber: Number(delegation),
      checkNumber: check,
      currencyDevKey: currencyType,
    };
    this.accountMovementService.createA(body).subscribe({
      next: async resp => {
        this.form.get('noReport').patchValue(resp.reportDevNumber);
        this.alert('success', 'Reporte', 'Creado correctamente');
        //console.log(resp);
        this.data1.map(async good => {
          await this.procedure(Number(good.good));
          await this.createTransNumDet(good);
        });
      },
      error: err => {
        //this.alert('error', 'Error', err.error.message);
        //console.log('ASDASD', err);
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  async createTransNumDet(data: any) {
    const { noReport, total } = this.form.value;
    const body: any = {
      numberReportDev: noReport,
      numberGoodDev: data.good,
      val14Dev: data.import,
      allInterestDev: data.interests,
      totalDev: total,
    };

    return new Promise((resolve, reject) => {
      this.accountMovementService.createB(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: () => {
          resolve(true);
        },
      });
    });
  }

  async sendEmail() {
    const { noReport, total } = this.form.value;

    if (noReport) {
      const email = await this.getDataMail();

      if (email) {
        const emailv2 = {
          ...email,
          REPORTE: noReport,
        };
        let config: ModalOptions = {
          initialState: {
            email: emailv2,
            report: this.form.value,
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
        this.modalService.show(EmailComponentC, config);
      }
    } else {
      this.alert('error', 'Error', 'Primero debe guardar el reporte');
    }
  }

  async getDataMail() {
    const { noReport } = this.form.value;
    const user = this.user.decodeToken();
    const data = {
      pSubject: 'Depósito de Devoluciones',
      pMessage: '',
      pFor: '',
      pCc: '',
      devReportNumber: noReport,
      toolbarUser: user.username.toUpperCase(),
    };
    console.log(data);
    return firstValueFrom(
      this.emailService.getIniEmailCentral(data).pipe(
        catchError(error => {
          this.alert('error', 'Error', error.error.message);
          return of(null);
        }),
        map(resp => resp)
      )
    );
  }

  async save() {
    const { delegation, check, depositDate, dateDevolution, noReport } =
      this.form.value;

    if (!noReport) {
      let total: number = 0;

      for (let i = 0; i < this.data1.length; i++) {
        const element: any = this.data1[i];
        total = total + Number(element.total);
      }

      //Monto
      this.form.get('monto2').patchValue(total);
      if (!delegation) {
        this.alert('error', 'Error', 'No a ingresado el numero de delegació');
        return;
      } else if (!check) {
        this.alert('error', 'Error', 'No a ingresado el numero de cheque');
        return;
      } else if (!depositDate) {
        this.alert('error', 'Error', 'No a ingresado la fecha de deposito');
        return;
      } else if (
        this.convertDate(depositDate) > this.convertDate(dateDevolution)
      ) {
        this.alert(
          'error',
          'Error',
          'La fecha de deposito no puede ser mayor a la fecha de devolucion'
        );
        return;
      }

      let next: boolean = true;

      for (let i = 0; i < this.data1.length; i++) {
        const element: any = this.data1[i];

        if (!element.currency) {
          this.alertInfo(
            'error',
            'Error',
            'No puede guardar el reporte si el numero de bien no tiene el tipo de mmoneda. Ingrese a la pantalla Características del Bien y agregue esta información (Siab/General/Características del Bien)'
          );
          next = false;
          break;
        }
      }

      if (!next) return;

      this.pupInteres();
    } else {
    }
  }

  async procedure(good: number) {
    const body: any = {
      cveShape: 'FTRANSFCUENXREG_DEV',
      noGood: good,
    };

    return new Promise((resolve, reject) => {
      this.goodProcessService.procedureGoodStatus(body).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(true);
        },
      });
    });
  }

  pupInteres() {
    const { currencyType, total, monto2, delegation } = this.form.value;

    const good: any = this.data1.length > 0 ? this.data1[0] : null;

    if (good.currency != currencyType) {
      this.form.get('delegation');
      this.form.get('currencyType');
      this.form.get('cveAccount');
      this.form.get('accountType');
      this.form.get('cveBank');
      this.form.get('cveCurrency');

      this.alert(
        'error',
        'Error',
        'El tipo de moneda de los bienes ingresados es diferente al tipo de moneda de la cuenta, favor de verificar'
      );

      return;
    }

    let next: boolean = true;

    for (let i = 0; i < this.data1.length; i++) {
      const element: any = this.data1[i];

      if (!element.interests) {
        this.alertInfo(
          'error',
          'Error',
          `Debe ingresar el intéres del bien: ${element.good}`
        );
        next = false;
        break;
      }
    }

    if (!next) return;

    for (let i = 0; i < this.data1.length; i++) {
      const element: any = this.data1[i];

      if (!element.total) {
        element.total = total + Number(element.total);
      }

      if (element.total != monto2) {
        this.alert(
          'error',
          'Error',
          'El monto ingresado no corresponde al monto calculado verfique'
        );
        return;
      } else if (!element.total && total != 0) {
        console.log(!element.total);
        this.alert(
          'error',
          'Error',
          'Debe ingresar el monto total de devolución'
        );
        return;
      }
    }

    this.data1.map(async good => {
      const ban = await this.pupRegAdm(Number(good.good), Number(delegation));
    });
    this.createTransNumDet(good);
  }

  async pupRegAdm(good: number, delegation: number) {
    const body = {
      F_NODEL: delegation,
    };

    return firstValueFrom(
      this.dictationService.applicationPufRefCentral(body).pipe(
        catchError(error => {
          this.alert('error', 'Error', error.error.message);
          return of(null);
        }),
        map(resp => resp)
      )
    );
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

  getAccount() {
    const { currencyType, delegation } = this.form.value;
    const filter = new FilterParams();

    filter.addFilter('cveCurrency', currencyType, SearchFilter.ILIKE);
    filter.addFilter('delegationNumber', delegation, SearchFilter.EQ);

    this.bankService.getAllWithFilters(filter.getParams()).subscribe({
      next: resp => {
        const data = resp.data[0];
        this.form.get('cveBank').patchValue(data.cveBank);
        this.form.get('accountType').patchValue(data.accountType);
        this.form.get('cveCurrency').patchValue(data.cveCurrency);
        this.form.get('cveAccount').patchValue(data.cveAccount);
      },
      error: err => {
        //this.alert('error', 'Error', err.error.message);
      },
    });
  }
}

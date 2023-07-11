import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
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
  dataTable: DetailNum[] = [{} as DetailNum];
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

  constructor(
    private fb: FormBuilder,
    private tranfergoodService: TranfergoodService,
    private goodProcessService: GoodProcessService,
    private parametersService: ParametersService,
    private delegationService: DelegationService,
    private transferRegService: TransRegService,
    private datePipe: DatePipe,
    private transferGood: TranfergoodService,
    private securityService: SecurityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REGIONAL_ACCOUNT_COLUMNS,
    };
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
            trans.description = '';
            trans.status = trans.goods ? trans.goods.status : '';
            trans.val1 = trans.goods ? trans.goods.val1 : '';
          });

          this.dataTable = [...resp.data];
          this.totalItems = resp.count;
        },
        error: err => {
          this.loading = false;
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
        'error',
        'Error',
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
              trans.description = '';
              trans.status = trans.estatus ? trans.estatus : '';
              trans.val1 = trans.val1 ? trans.val1 : '';
              trans.goodNumber = trans.noBien ? trans.noBien : '';
              trans.allInterest = trans.totInteres ? trans.totInteres : '';
            });

            this.dataTable = [...resp.data];
            this.totalItems = resp.data.length;
          },
          error: err => {
            this.alert('error', 'Error', err.error.message);
          },
        });
    } else {
      this.alert('error', 'Error', 'Ingrese un id solicitud para la consulta');
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

  onDelegationsChange(data: any) {
    console.log(data);
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

        this.filterParams.getValue().removeAllFilters();
        this.filterParams.getValue().page = 1;
        this.filterParams
          .getValue()
          .addFilter('numberReport', data.reportNumber, SearchFilter.EQ);

        this.getTransDetail();

        console.log(resp);
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
      delegation: [null, [Validators.pattern(STRING_PATTERN)]],
      folioCash: [null],
      transactionDate: [null],

      cveAccount: [null],
      accountType: [null, [Validators.pattern(STRING_PATTERN)]],
      cveBank: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      cveCurrency: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      total: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }

  onFileChange(event: Event) {
    console.log('Datos Ecxel');
    const file = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', file);
    this.getDataFile(formData);
  }

  getDataFile(formData: FormData) {
    this.data1 = [];
    this.tranfergoodService.getFileCSV(formData).subscribe({
      next: resp => {
        console.log('resp excel ', resp); //resp excel
        for (let i = 0; resp.data.length; i++) {
          console.log('data JCH: ', resp.data[i]);
          if (resp.data[i] != undefined) {
            let item = {
              file: resp.data[i].NO_EXPEDIENTE,
              good: resp.data[i].NO_BIEN,
              description: resp.data[i].DESCRIPCION,
              status: resp.data[i].ESTATUS,
            };
            this.data1.push(item);
            // this.dataTable.load(this.data1);
          } else {
            // this.dataTable.refresh();
            break;
          }
        }
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
        this.onLoadToast('error', error, '');
      },
    });
  }

  clear() {
    this.form.reset();
    this.totalItems = 0;
    this.dataTable = [];
  }

  async sendEmail() {
    const { transferenceReport } = this.form.value;

    if (transferenceReport) {
      const email = await this.getDataMail();
    } else {
      this.alert('error', 'Error', 'Primero debe guardar el reporte');
    }
  }

  async getDataMail() {
    const { transferenceReport, delegation } = this.form.value;
    const data = {
      pAffair: '',
      pMessage: 'Déposito de Recursos para Devoluciones',
      pFor: '',
      pCc: '',
      transNumeraryRegNoReport: Number(transferenceReport),
      transNumeraryRegNoDelegation: Number(delegation),
    };
    return firstValueFrom(
      this.securityService.getIniEmail(data).pipe(
        catchError(error => {
          this.alert('error', 'Error', error.error.message);
          return of(null);
        }),
        map(resp => resp.data)
      )
    );
  }
}

import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { mailcentralofficesComponent } from '../mail-central-offices/mail-central-offices.component';
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
  data: IExcelToJson[] = [];
  dataTabla: LocalDataSource = new LocalDataSource();
  itemsDelegation = new DefaultSelect();
  columnFilters: any = [];
  data3: LocalDataSource = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private tranfergoodService: TranfergoodService,
    private elementRef: ElementRef,
    private accountMovementService: AccountMovementService,
    private serviceRNomencla: ParametersService,
    private delegationService: DelegationService,
    private modalService: BsModalService
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
    this.getDelegations(new ListParams());
    this.getDataReport();
  }

  prepareForm() {
    console.log('PrepareForm: ');
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
    });
    console.log('Form: ', this.form);
    setTimeout(() => {
      this.getDelegations(new ListParams());
    }, 1000);
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', files);
    this.getDataFile(formData);
    this.cleanFilter();
  }

  getDelegations(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
      console.log('AQUI', params);
    }
    this.delegationService.getAllPaginated(params).subscribe((data: any) => {
      this.itemsDelegation = new DefaultSelect(data.data, data.count);
      console.log('AQUI', this.itemsDelegation);
      console.log('AQUI', data);
    });
  }

  asignarDatos(item: any) {
    console.log('item asignarDatos: ', item);
    let registro = {
      file: item.vno_expediente,
      good: item.vno_bien_dev,
    };
    console.log('registro: ', registro);
    this.data1.push(registro);
    this.dataTabla.load(this.data1);
    this.dataTabla.load(this.data);
    this.totalItems = this.data1.length;
    console.log('this.data1: ', this.data1);
  }

  scrollToDiv() {
    const divElement = this.elementRef.nativeElement.querySelector('#miDiv');
    divElement.scrollIntoView({ behavior: 'smooth' });
  }

  guardar() {
    console.log('valor ', this.form.get('currencyType').value);

    let objeto = {
      valor: this.form.get('currencyType').value,
      valor1: this.form.get('delegation').value,
    };

    //service con el objeto
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
    this.form.get('noReport').value;
    console.log(this.form.get('noReport').value);
    this.reporte = this.form.get('noReport').value;
    this.getDataByReport(this.reporte);
    this.getDataTranferCounts(this.reporte);
  }

  getDataByReport(reporte: number) {
    this.prepareForm();
    this.accountMovementService.getByReportDataToTurn(reporte).subscribe({
      next: async (response: any) => {
        const data = response.data;
        this.total = response.data[0].amountTotalDev;
        let dataForm = {
          check: response.data[0].checkNumber,
          cveAccount: response.data[0].accountDevKey,
          cveCurrency: response.data[0].currencyDevKey,
          depositDate: response.data[0].depositDevDate,
        };
        this.form.patchValue(dataForm);
        this.delegacion = response.data[0].delegationDevNumber;
        this.currency = response.data[0].currencyDevKey;
        this.getEdo(response.data[0].delegationDevNumber);
        this.getAcountBank(this.delegacion, this.currency);
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
        console.log('Respuesta DELEGACION: ', data);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getDataTranferCounts(reporte: number) {
    this.data1 = [];
    console.log('Reporte: ', reporte);
    this.accountMovementService.getByNumberReport(reporte).subscribe({
      next: resp => {
        console.log('resp ', resp);
        for (let i = 0; resp.data.length; i++) {
          console.log('data JCH: ', resp.data[i]);
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
          } else {
            this.dataTabla.refresh();
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
          console.log('response: ', resp.procesados);
          let item = {
            file: resp.procesados[i].VNO_EXPEDIENTE,
            good: resp.procesados[i].VNO_BIEN_DEV,
            description: resp.procesados[i].VDESCRIPCION,
            import: resp.procesados[i].VVAL14,
            status: resp.procesados[i].VESTATUS,
            interests: resp.procesados[i].VNO_BIEN_DEV,
            total: resp.procesados[i].VTOTAL_DEV,
            currency: resp.procesados[i].VCVE_MONEDA_AVALUO,
          };

          this.data1.push(item);
        }

        this.dataTabla.load(this.data1);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  openForm(contract?: any) {
    let config: ModalOptions = {
      /*initialState: {
        contract,
        callback: (next: boolean) => {
          if (next) this.getContractsAll();
        },
      },*/
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(mailcentralofficesComponent, config);
  }

  cleanFilter() {
    this.form.get('currencyType').setValue(null);
    this.form.get('delegation').setValue(null);
    this.form.get('check').setValue(null);
    this.form.get('cveAccount').setValue(null);
    this.form.get('cveBank').setValue(null);
    this.form.get('cveCurrency').setValue(null);
    this.form.get('accountType').setValue(null);
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName).enable();
    }),
      (this.totalItems = 0);
    this.data3.load([]);
    this.data3.refresh();
  }
}

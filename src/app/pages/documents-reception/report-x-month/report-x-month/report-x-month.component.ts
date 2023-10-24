import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, firstValueFrom, map, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-report-x-month',
  templateUrl: './report-x-month.component.html',
  styleUrls: [],
})
export class ReportXMonthComponent extends BasePage implements OnInit {
  flyersForm: FormGroup;
  minModeFromMonth: BsDatepickerViewMode = 'month';
  minModeFromYear: BsDatepickerViewMode = 'year';
  params = new BehaviorSubject<ListParams>(new ListParams());
  PN_DELEG = new EventEmitter<IDelegation>();
  PN_SUBDEL = new EventEmitter<ISubdelegation>();
  selectedSubDelegation = new DefaultSelect<ISubdelegation>();
  selectedDelegation = new DefaultSelect<IDelegation>();
  bsValueFromMonth: Date = new Date();
  bsValueFromYear: Date = new Date();
  showSearchForm: boolean = true;
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsConfigFromMonth1: Partial<BsDatepickerConfig>;
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  searchForm: ModelForm<any>;
  reportForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };
  result: any;
  result1: any;
  noDel: number;
  delegations: DefaultSelect = new DefaultSelect([], 0);
  subDelegations: DefaultSelect = new DefaultSelect([], 0);
  maxDate: Date = new Date();
  minDate: Date;

  maxDate1: Date;
  minDate1: Date;

  maxDate2: Date;
  minDate2: Date;

  year: number;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private delegationService: DelegationService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private printFlyersService: PrintFlyersService,
    private sanitizer: DomSanitizer,
    private parametersService: ParametersService,
    private subDelegationService: SubDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    const params = new ListParams();
    this.startCalendars();
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromMonth1 = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      PF_DELMES: [null, [Validators.required]],
      PF_ALMES: [null, [Validators.required]],
      PF_ANIO: [null, [Validators.required]],
    });
    this.reportForm.get('PF_ALMES').disable();
    this.reportForm.get('subdelegation').disable();
    this.reportForm.get('PF_DELMES').disable();
  }

  save() {}

  cleanForm(): void {
    this.reportForm.reset();
    this.reportForm.get('subdelegation').disable();
    this.reportForm.get('PF_ALMES').disable();
    this.reportForm.get('PF_DELMES').disable();
  }

  Generar() {
    let params = {
      PN_DELEG: this.reportForm.controls['delegation'].value,
      PN_SUBDEL: this.reportForm.controls['subdelegation'].value,
      PF_MES: this.bsValueFromMonth.getFullYear(),
      PF_ANIO: this.bsValueFromYear.getMonth(),
    };

    this.siabService
      // .fetchReport('RGEROFPESTADIXMES', params)
      .fetchReport('blank', params)
      .subscribe(response => {
        // response=null;
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          this.onLoadToast(
            'warning',
            'advertencia',
            'Sin Datos Para los Rangos de Fechas Suministrados'
          );
        }
      });
  }

  async getCatalogDelegation(params: ListParams) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${year}/${month}/${day}`;
    const etapa = await this.getFaStageCreda(SYSDATE);
    params['filter.etapaEdo'] = `$eq:${etapa}`;
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.id'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }
    this.delegationService.getAll(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['noDelDesc'] = item.id + ' - ' + item.description;
        });
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

  async changeDelegation(event: any) {
    if (event) {
      if (this.noDel) {
        this.reportForm.get('subdelegation').reset();
      }
      this.noDel = event.id;
      this.getSubDelegation(new ListParams());
    }
  }

  async getSubDelegation(params: ListParams) {
    if (this.noDel) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${year}/${month}/${day}`;
      const etapa = await this.getFaStageCreda(SYSDATE);
      params['filter.phaseEdo'] = `$eq:${etapa}`;
      params['filter.delegationNumber'] = `$eq:${this.noDel}`;
      if (params.text) {
        if (!isNaN(parseInt(params.text))) {
          params['filter.id'] = `$eq:${params.text}`;
          params['search'] = '';
        } else if (typeof params.text === 'string') {
          params['filter.description'] = `$ilike:${params.text}`;
        }
      }
      this.subDelegationService.getAll2(params).subscribe({
        next: resp => {
          console.log(resp.data);
          this.result1 = resp.data.map(async (item: any) => {
            item['noSubDelDesc'] = item.id + ' - ' + item.description;
          });
          this.subDelegations = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          this.subDelegations = new DefaultSelect();
        },
      });
      this.reportForm.get('subdelegation').enable();
    }
  }
  changeSubDelegation(event: any) {}

  validateDate(event: Date) {
    //console.log(event);
    if (event) {
      const month = String(event.getMonth() + 1).padStart(2, '0');
      const dateStart = `${this.year}/${month}/01`;
      const dateEnd = `${this.year}/12/01`;
      const start = new Date(dateStart);
      //const end = new Date(dateEnd);
      this.minDate2 = start;
      //this.maxDate2 = end;
      this.reportForm.get('PF_ALMES').enable();
    }
  }

  validateDateYear(event: Date) {
    if (event) {
      console.log(event);
      this.year = event.getFullYear();
      const dateStart = `${this.year}/01/01`;
      const dateEnd = `${this.year}/12/01`;
      const start = new Date(dateStart);
      const end = new Date(dateEnd);
      this.minDate1 = start;
      this.maxDate1 = end;
      this.reportForm.get('PF_DELMES').enable();
    }
  }
}

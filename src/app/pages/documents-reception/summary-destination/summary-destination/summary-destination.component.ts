import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IEntfed } from 'src/app/core/models/catalogs/entfed.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-summary-destination',
  templateUrl: './summary-destination.component.html',
  styleUrls: [],
})
export class SummaryDestinationComponent extends BasePage implements OnInit {
  flyersForm: FormGroup;
  maxDate: Date = new Date();
  idDelegation: number = null;
  entidad = new DefaultSelect<IDelegationState>();
  select = new DefaultSelect<IDepartment>();
  selectedDelegation = new DefaultSelect<IDelegation>();
  selectedSubDelegation = new DefaultSelect<ISubdelegation>();
  selectDepartament = new DefaultSelect();
  start: string;
  end: string;
  result: any;
  result1: any;
  noDel: number;
  subDelegations: DefaultSelect = new DefaultSelect([], 0);
  entFed: DefaultSelect = new DefaultSelect([], 0);

  entfedSelect = new DefaultSelect<IEntfed>();
  flagA: boolean = true;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private departamentService: DepartamentService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private delegationService: DelegationService,
    //private serviceSubDeleg: SubdelegationService,
    private printFlyersService: PrintFlyersService,
    private entFedService: EntFedService,
    private subDelegationService: SubDelegationService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private parametersService: ParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.flyersForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      PF_FECINI: [null, [Validators.required]],
      PF_FECFIN: [null, [Validators.required, maxDate(new Date())]],
      includeArea: [false],
      department: [null, [Validators.required]],
      delegdestino: [null],
      subddestino: [null],
      entiFed: [null, [Validators.required]],
    });
    const params = new ListParams();
    this.getDelegation(params);
    this.getSubDelegations(params);
    this.getDepartament(params);
    this.flyersForm.get('subdelegation').disable();
    this.flyersForm.get('PF_FECFIN').disable();
    this.flyersForm.get('delegdestino').disable();
    this.flyersForm.get('subddestino').disable();
  }

  activeFlag() {
    if (this.flagA) {
      this.flagA = false;
    } else {
      this.flagA = true;
    }
  }

  validateTotal() {
    if (
      this.flyersForm.get('department').value != null &&
      this.flyersForm.get('delegdestino').value != null &&
      this.flyersForm.get('subddestino').value != null
    ) {
      this.flagA = true;
    }
  }

  async getDelegation(params?: ListParams) {
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
        this.result = resp.data.map(async (item: any) => {
          item['noDelDesc'] = item.id + ' - ' + item.description;
        });
        this.selectedDelegation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectedDelegation = new DefaultSelect();
        console.log(err);
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

  changeDelegation(event: any) {
    if (event) {
      if (this.noDel) {
        this.flyersForm.get('subdelegation').reset();
      }
      this.noDel = event.id;
      this.getSubDelegations(new ListParams());
    }
  }
  async getSubDelegations(params: ListParams) {
    if (this.noDel) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${year}/${month}/${day}`;
      const etapa = await this.getFaStageCreda(SYSDATE);
      params['filter.phaseEdo'] = `$eq:${etapa}`;
      params['filter.delegationNumber'] = `$eq:${this.noDel}`;
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
      this.flyersForm.get('subdelegation').enable();
    }
  }

  getEntFed(params?: ListParams) {
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.cve_entfed'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.otvalor'] = `$ilike:${params.text}`;
      }
    }
    this.dynamicCatalogsService.getDistinic(params).subscribe({
      next: resp => {
        this.result = resp.data.map(async (item: any) => {
          item['cveOt'] = item.cve_entfed + ' - ' + item.otvalor;
        });
        this.entFed = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.entFed = new DefaultSelect();
        console.log(err);
      },
    });
  }

  getDepartament(params: ListParams) {
    this.departamentService.getAll(params).subscribe({
      next: data => {
        this.validateTotal();
        this.selectDepartament = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        console.log(err);
      },
    });
  }
  save() {}

  getEndDateErrorMessage(fin: any, ini: any) {
    const stard = new Date(ini.value).getTime();
    const end = new Date(fin.value).getTime();
    if (fin && ini) {
      // return stard <= end
      //   ? null
      //   : 'La fecha de finalización debe ser mayor que la fecha de inicio.';
    }
    return '';
  }

  Generar() {
    const start = this.flyersForm.get('PF_FECINI').value;
    const end = this.flyersForm.get('PF_FECFIN').value;
    this.start = this.datePipe.transform(start, 'dd/MM/yyyy');
    this.end = this.datePipe.transform(end, 'dd/MM/yyyy');
    this.FGEROFPRESUMENDIAA();
    /*if (this.end < this.start) {
      this.onLoadToast(
        'error',
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }*/

    /*if (this.flyersForm.get('includeArea').value) {
      this.FGEROFPRESUMENDIAA();
    } else {
      this.FGEROFPRESUMENDIA();
    }*/
  }

  FGEROFPRESUMENDIA() {
    let params = {
      PN_DELEG: this.flyersForm.controls['delegation'].value,
      PN_SUBDEL: this.flyersForm.controls['subdelegation'].value,
      PF_FECINI: this.start,
      PF_FECFIN: this.end,
    };
    //RGEROFPRESUMENDIA
    this.siabService.fetchReport('blank', params).subscribe(response => {
      //  response= null;
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              if (data) {
                data.map((item: any) => {
                  return item;
                });
              }
            },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true,
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

  FGEROFPRESUMENDIAA() {
    let params = {
      PN_DELEG: this.flyersForm.controls['delegation'].value,
      PN_SUBDEL: this.flyersForm.controls['subdelegation'].value,
      PN_DELEGACION: this.flyersForm.controls['delegdestino'].getRawValue(),
      PN_SUBDELEGACION: this.flyersForm.controls['subddestino'].getRawValue(),
      PN_DEPARTAMENTO: this.flyersForm.controls['department'].value,
      PF_FECINI: this.start,
      PF_FECFIN: this.end,
    };
    //RGEROFPRESUMENDIAA
    this.siabService.fetchReport('blank', params).subscribe(response => {
      //  response= null;
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              if (data) {
                data.map((item: any) => {
                  return item;
                });
              }
            },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true,
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

  preview(url: string, params: ListParams) {
    try {
      this.reportService.download(url, params).subscribe(response => {
        if (response !== null) {
          let blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
          setTimeout(() => {
            this.onLoadToast('success', 'Reporte ', 'Generado Correctamente');
          }, 2000);

          this.loading = false;
          this.cleanForm();
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  cleanForm(): void {
    this.flyersForm.reset();
    this.flyersForm.get('subdelegation').disable();
    this.flyersForm.get('PF_FECFIN').disable();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.flyersForm.updateValueAndValidity();
  }

  onDelegationsChange(delegation: any) {
    /*this.resetFields([this.delegation]);
    this.selectedDelegation = new DefaultSelect();
    this.validateTotal();
    this.emitDelegation.emit(delegation);*/
  }

  onDepartmentsChange(type: any) {
    this.validateTotal();
  }

  onSubDelegationsChange(subdelegation: any) {
    /*this.resetFields([this.subdelegation]);
    this.selectedDelegation = new DefaultSelect();
    this.validateTotal();
    // this.delegations = new DefaultSelect([subdelegation.delegation], 1);
    // this.delegation.setValue(subdelegation.delegation.id);
    this.emitSubdelegation.emit(subdelegation);*/
  }
  minDate: Date;
  onDateChange(event: any) {
    //change mindate #toDate
    if (event) {
      this.flyersForm.get('PF_FECFIN').enable();
      this.minDate = event;
    }
  }

  getEntfed(params: ListParams) {
    this.entFedService.getAll(params).subscribe({
      next: data => {
        this.entfedSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.entfedSelect = new DefaultSelect();
      },
    });
  }
}

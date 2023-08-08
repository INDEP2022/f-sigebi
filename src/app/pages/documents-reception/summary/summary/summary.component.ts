import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

export interface IReport {
  data: File;
}
export interface IEntidad {
  data: [];
  count: number;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styles: [],
})
export class SummaryComponent extends BasePage implements OnInit {
  flyersForm: FormGroup;
  @Input() showDelegation: boolean = true;
  @Output() emitDelegation = new EventEmitter<IDelegation>();
  @Input() delegationField: string = 'delegation';
  @Input() subdelegationField: string = 'subdelegation';
  @Output() emitSubdelegation = new EventEmitter<ISubdelegation>();
  idDelegation: number = null;
  entidad = new DefaultSelect<IDelegationState>();
  select = new DefaultSelect<IDepartment>();
  selectedDelegation = new DefaultSelect<IDelegation>();
  selectedSubDelegation = new DefaultSelect<ISubdelegation>();
  selectDepartament = new DefaultSelect();
  start: string;
  end: string;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };
  get PF_FECINI(): AbstractControl {
    return this.flyersForm.get('PF_FECINI');
  }
  get PF_FECFIN(): AbstractControl {
    return this.flyersForm.get('PF_FECFIN');
  }

  get includeArea() {
    return this.flyersForm.get('includeArea');
  }
  get delegation() {
    return this.flyersForm.get(this.delegationField);
  }
  get subdelegation() {
    return this.flyersForm.get(this.subdelegationField);
  }

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private departamentService: DepartamentService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private delegationService: DelegationService,
    private serviceSubDeleg: SubdelegationService,
    private printFlyersService: PrintFlyersService
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
      federative: [null],
      PF_FECINI: [null, [Validators.required]],
      PF_FECFIN: [null, [Validators.required]],
      includeArea: [false],
      department: [null],
      delegdestino: [null],
      subddestino: [null],
    });
    const params = new ListParams();
    this.getDelegation(params);
    this.getSubDelegations(params);
    this.getDepartament(params);
  }
  getDelegation(params?: ListParams) {
    console.log(params);
    this.delegationService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.selectedDelegation = new DefaultSelect(data.data, data.count);
        console.log(this.selectedDelegation);
      },
      error: err => {
        console.log(err);
        this.selectedDelegation = new DefaultSelect();
      },
    });
  }
  getDepartament(params: ListParams) {
    this.departamentService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.selectDepartament = new DefaultSelect(data.data, data.count);
      },
      error: err => {},
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

    /// console.log(this.start);
    if (this.end < this.start) {
      this.onLoadToast(
        'error',
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }

    let params = {
      PN_DELEG: this.flyersForm.controls['delegation'].value,
      PN_SUBDEL: this.flyersForm.controls['subdelegation'].value,
      PN_DELEGACION: this.flyersForm.controls['delegdestino'].value,
      PN_SUBDELEGACION: this.flyersForm.controls['subddestino'].value,
      PF_FECINI: this.start,
      PF_FECFIN: this.end,
      PC_ENTFED: this.flyersForm.controls['federative'].value,
      DEPARTAMENTO: this.flyersForm.controls['department'].value,
    };

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
          'Sin datos para los rangos de fechas suministrados'
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
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.flyersForm.updateValueAndValidity();
  }
  getSubDelegations(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'delegationNumber',
      this.flyersForm.get(this.delegationField).value
    );

    this.printFlyersService.getSubdelegations2(paramsF.getParams()).subscribe({
      next: data => {
        this.selectedSubDelegation = new DefaultSelect(data.data, data.count);
        console.log(this.selectedSubDelegation);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onDelegationsChange(delegation: any) {
    this.resetFields([this.delegation]);
    this.selectedDelegation = new DefaultSelect();
    this.emitDelegation.emit(delegation);
  }

  onSubDelegationsChange(subdelegation: any) {
    this.resetFields([this.subdelegation]);
    this.selectedDelegation = new DefaultSelect();
    // this.delegations = new DefaultSelect([subdelegation.delegation], 1);
    // this.delegation.setValue(subdelegation.delegation.id);
    this.emitSubdelegation.emit(subdelegation);
  }
  minDate: Date;
  onDateChange(event: any) {
    console.log('onDateChange' + event);
    //change mindate #toDate
    this.minDate = event;
  }
}

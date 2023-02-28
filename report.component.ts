import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ReportService } from 'src/app/core/services/reports/reports.service';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
//Services
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
//Components
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';



export interface IReport {
  data: File;
}


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent extends BasePage implements OnInit {
  reportForm: FormGroup = this.fb.group({});
  select = new DefaultSelect();
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  showSearch: boolean;
  maxDateEnd = new Date();
  maxDateStart: Date;
  minDateEnd: Date;

  showSearchForm: boolean = true;
  searchForm: ModelForm<any>;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };

  constructor(private fb: FormBuilder,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabService: SiabService,
    private serviceDeleg: DelegationService,) {
    super();

  }
  get PN_NODELEGACION() {
    return this.reportForm.get('PN_DELEG');
  }
  get PN_NOSUBDELEGACION() {
    return this.reportForm.get('PN_SUBDEL');
  }


  ngOnInit(): void {
    this.prepareForm();
    // this.confirm();
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      PN_DELEG: [null, [Validators.required]],
      PN_SUBDEL: [null, [Validators.required]],
      PF_MES: [
        null,
        [Validators.required],
      ],
      PF_ANIO: [
        null, [Validators.required]
      ]
    });
  }





  loadFile() {
    return;
  }

  confirm(): void {
    this.showSearch = true;
    const start = new Date(this.reportForm.get('PF_MES').value);
    const end = new Date(this.reportForm.get('PF_ANIO').value);

    const startTemp = `${start.getFullYear()}-0${start.getUTCMonth() + 1
      }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${end.getUTCMonth() + 1
      }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      )
      return;
    }
    // console.log(this.reportForm.value);
    let params = { ...this.reportForm.value };

    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?PARAMFORM=${params}`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'RGEROFPRECEPDOCUM.pdf');
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
    this.cleanForm();

  }

  readFile(file: IReport) {
    const reader = new FileReader();
    reader.readAsDataURL(file.data);
    reader.onload = _event => {
      // this.retrieveURL = reader.result;
      this.openPrevPdf(reader.result as string);
    };
  }

  openPrevPdf(pdfurl: string) {
    console.log(pdfurl);
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => { }
    );
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.PN_NODELEGACION.value) {
      params.addFilter('delegationNumber', this.PN_NODELEGACION.value);
    }
    // console.log(params.getParams());
    this.reportService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
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



  onDelegationsChange(element: any) {
    this.resetFields([this.PN_NOSUBDELEGACION]);

    this.subdelegations = new DefaultSelect();

    // console.log(this.PN_NODELEGACION.value);
    if (this.PN_NODELEGACION.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
  }

  onSubDelegationsChange(element: any) {

  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.reportForm.updateValueAndValidity();
  }

  setMinDateEnd(date: Date) {
    if (date != undefined) this.minDateEnd = date;
  }

  cleanForm(): void {
    this.reportForm.reset();
  }
  cancel(): void {
    this.showSearch = false
  }
  pdfSrc!: Uint8Array;
  api = '';

  preview(file: IReport) {
    try {
      this.reportService.download(file).subscribe(response => {
        if (response !== null) {
          let blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);

        }

      })
    } catch (e) {
      console.error(e)
    }
  }

}



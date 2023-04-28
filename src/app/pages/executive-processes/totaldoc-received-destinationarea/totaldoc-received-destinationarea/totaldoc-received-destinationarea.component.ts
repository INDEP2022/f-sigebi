import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';

import { maxDate } from 'src/app/common/validations/date.validators';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-totaldoc-received-destinationarea',
  templateUrl: './totaldoc-received-destinationarea.component.html',
  styles: [],
})
export class TotaldocReceivedDestinationareaComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  today: Date;

  areas = new DefaultSelect<IDepartment>();
  areaValue: IDepartment;

  idDel: IDelegation;
  idSub: ISubdelegation;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private departamentService: DepartamentService,
    private siabService: SiabService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      report: [false],
      departamentDes: [null], //noDepartament Destino
      delegationDes: [null], //noDelegation Destino
      subdelegationDes: [null], //noSubDelegation Destino
    });
  }

  getAreas(params: ListParams) {
    this.departamentService.getAll(params).subscribe(
      data => {
        this.areas = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.areas = new DefaultSelect([], 0);
      },
      () => {}
    );
  }

  onValuesChange(areaChange: IDepartment) {
    console.log(areaChange);
    this.form.controls['delegationDes'].setValue(null);
    this.form.controls['subdelegationDes'].setValue(null);
    if (areaChange !== undefined) {
      this.idDel = areaChange.delegation as IDelegation;
      this.idSub = areaChange.numSubDelegation as ISubdelegation;
      this.areaValue = areaChange;
      this.form.controls['delegationDes'].setValue(this.idDel.description);
      this.form.controls['subdelegationDes'].setValue(this.idSub.description);
    } else {
      this.idDel = null;
      this.idSub = null;
    }
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  cleanForm(): void {
    this.form.reset();
    this.form.controls['report'].setValue(false);
  }

  confirm(): void {
    this.loading = true;
    const rangeDate = this.form.controls['rangeDate'].value;
    const detailReport = this.form.controls['report'].value;

    const startTemp = `${rangeDate[0].getFullYear()}-${
      rangeDate[0].getUTCMonth() + 1 <= 9 ? 0 : ''
    }${rangeDate[0].getUTCMonth() + 1}-${
      rangeDate[0].getDate() <= 9 ? 0 : ''
    }${rangeDate[0].getDate()}`;

    const endTemp = `${rangeDate[1].getFullYear()}-${
      rangeDate[1].getUTCMonth() + 1 <= 9 ? 0 : ''
    }${rangeDate[1].getUTCMonth() + 1}-${
      rangeDate[1].getDate() <= 9 ? 0 : ''
    }${rangeDate[1].getDate()}`;

    let reportParams: any = {
      PFECHARECINI: startTemp,
      PFECHARECFIN: endTemp,
    };

    if (this.areaValue)
      reportParams = {
        ...reportParams,
        PDPTO: this.areaValue.id,
        PDELEGACION: this.idDel.id,
        PSUBDELEGACION: this.idSub.id,
      };

    console.log(reportParams);

    detailReport
      ? this.getReport('RCONDIRREPORECDODA', reportParams)
      : //Todo: Get Real Report
        //this.getReport('RCONDIRREPORECDOCA', reportParams);
        this.getReportBlank('blank');
  }

  getReport(report: string, params: any): void {
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
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
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }

  getReportBlank(report: string): void {
    this.siabService.fetchReportBlank(report).subscribe({
      next: response => {
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
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }
}

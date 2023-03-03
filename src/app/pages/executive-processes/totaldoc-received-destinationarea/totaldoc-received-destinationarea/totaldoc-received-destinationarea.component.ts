import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

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
    private departamentService: DepartamentService
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
      report: [null],
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
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onValuesChange(areaChange: IDepartment) {
    this.idDel = areaChange.delegation as IDelegation;
    this.idSub = areaChange.numSubDelegation as ISubdelegation;
    console.log(areaChange);
    this.areaValue = areaChange;
    this.form.controls['delegationDes'].setValue(this.idDel.description);
    this.form.controls['subdelegationDes'].setValue(this.idSub.description);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  cleanForm(): void {
    this.form.reset();
  }

  confirm(): void {
    this.loading = true;
    console.log(this.form.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    //console.log(linkSource);
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();

    // console.log(this.flyersForm.value);
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    //let newWin = window.open(pdfurl, 'test.pdf');
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
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
}

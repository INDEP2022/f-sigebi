import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-reports-assets-declared-abandoned',
  templateUrl: './reports-assets-declared-abandoned.component.html',
  styles: [],
})
export class ReportsAssetsDeclaredAbandonedComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();

  constructor(private fb: FormBuilder, datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      dateInitRatification: [null, [Validators.required]],
      dateFinish: [null, [Validators.required]],
      ofFile: [null, [Validators.required]],
      atFile: [null, [Validators.required]],
      ofgood: [null, [Validators.required]],
      atgood: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
    });
  }

  confirm(): void {
    this.loading = true;
    // const pdfurl =
    //   `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGERJURDECLARABAND.pdf?PARAMFORM=NO&PN_DELEG=` +
    //   this.form.controls['delegation'].value +
    //   `&PN_SUBDEL=` +
    //   this.form.controls['subdelegation'].value +
    //   `&PF_FECINI=` +
    //   this.datePipe.transform(
    //     this.form.controls['dateInitRatification'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PF_FECFIN=` +
    //   this.datePipe.transform(
    //     this.form.controls['dateFinish'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PN_BIENINI=` +
    //   this.datePipe.transform(
    //     this.form.controls['ofgood'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PN_BIENFIN=` +
    //   this.datePipe.transform(
    //     this.form.controls['atgood'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PN_EXPEDINI=` +
    //   this.form.controls['ofFile'].value +
    //   `&PN_EXPEDFIN=` +
    //   this.form.controls['atFile'].value +
    //   `&PC_USUARIO=` +
    //   this.form.controls['capturingUser'].value;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }
}

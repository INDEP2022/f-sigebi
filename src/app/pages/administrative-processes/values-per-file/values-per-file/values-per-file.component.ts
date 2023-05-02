import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-values-per-file',
  templateUrl: './values-per-file.component.html',
  styles: [],
})
export class ValuesPerFileComponent extends BasePage implements OnInit {
  public form: FormGroup;

  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm() {
    this.form = this.fb.group({
      delegation: ['', Validators.required],
      subdelegation: ['', Validators.required],
      fileFrom: [null],
      fileTo: [null],
      from: [null],
      to: [null],
    });
  }

  public send(): void {
    console.log(this.form.value);
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGERADBNUMVALORES.pdf?PARAMFORM=NO&PARA_FEC_DESDE=` +
    //   this.datePipe.transform(
    //     this.form.controls['from'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PARA_FEC_HASTA=` +
    //   this.datePipe.transform(
    //     this.form.controls['to'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PN_DELEG=` +
    //   this.form.controls['delegation'].value +
    //   `&PN_SUBDEL=` +
    //   this.form.controls['subdelegation'].value +
    //   `&PN_EXPINI=` +
    //   this.datePipe.transform(this.form.controls['fileFrom'].value, 'dd-mm-yyyy') +
    //   `&PN_EXPFIN=` +
    //   this.datePipe.transform(this.form.controls['fileTo'].value, 'dd-mm-yyyy');
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

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }

  getSubdelegations(params: ListParams) {
    this.subdelegationService.getAll(params).subscribe(data => {
      this.subdelegations = new DefaultSelect(data.data, data.count);
    });
  }
}

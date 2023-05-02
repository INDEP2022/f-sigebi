import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-costs-applied-goods',
  templateUrl: './costs-applied-goods.component.html',
  styles: [],
})
export class CostsAppliedGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;

  public delegation = new DefaultSelect();
  public goodTypes = new DefaultSelect();
  public concepts = new DefaultSelect();
  public good = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private goodTypesService: GoodTypeService,
    private expenseService: GoodSpentService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      file: [null, Validators.required],
      toFile: [null, Validators.required],

      noBien: [null, Validators.required],
      alGood: [null, Validators.required],

      costType: [null, Validators.required],

      goodType: [null, Validators.required],
      costConcept: [null, Validators.required],
      to: [null, Validators.required],

      startDate: [null, Validators.required],
      finishDate: [null, Validators.required],
    });
  }

  send() {
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGERADBREPOCOSTOS.pdf?PARAMFORM=NO&PN_DEL=` +
    //   this.form.controls['delegation'].value +
    //   `&PN_GASINI=` +
    //   this.datePipe.transform(
    //    this.form.controls['startDate'].value,
    //   'dd-mm-yyyy'
    //   ) +
    //   `&PN_GASFIN=` +
    //  this.datePipe.transform(
    //    this.form.controls['finishDate'].value,
    //   'dd-mm-yyyy'
    //   ) +
    //   `&PN_NOBIEN=` +
    //   this.form.controls['noBien'].value +
    //   `&PN_NO_BIEN2=` +
    //   this.form.controls['alGood'].value +
    //   `&PN_EXPEDIENTE=` +
    //   this.form.controls['file'].value +
    //   `&PN_EXPEDIENTE2=` +
    //   this.form.controls['toFile'].value +
    //   `&PC_CONCEPTO=` +
    //   this.form.controls['costConcept'].value +
    //   `&PC_CONCEPTO2=` +
    //   this.form.controls['to'].value +
    //   `&PN_TIPOBIEN=` +
    //   this.form.controls['goodType'].value +
    //   `&PC_DIR_IND=` +
    //   this.form.controls['to'].value;
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
      this.delegation = new DefaultSelect(data.data, data.count);
    });
  }

  getGoodType(params: ListParams) {
    this.goodTypesService.getAll(params).subscribe(data => {
      this.goodTypes = new DefaultSelect(data.data, data.count);
    });
  }

  getCostConcept(params: ListParams) {
    this.expenseService.getExpenseConcept(params).subscribe(data => {
      this.concepts = new DefaultSelect(data.data, data.count);
    });
  }

  getGood(params: ListParams) {
    this.goodService.getAll(params).subscribe(data => {
      this.good = new DefaultSelect(data.data, data.count);
    });
  }
}

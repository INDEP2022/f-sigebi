import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';

@Component({
  selector: 'app-other-currencies',
  templateUrl: './other-currencies.component.html',
  styles: [],
})
export class OtherCurrenciesComponent extends BasePage implements OnInit {
  public currenciesForm: FormGroup;

  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();
  public currencies = new DefaultSelect();

  public get currency() {
    return this.currenciesForm.get('currencie');
  }
  public get from() {
    return this.currenciesForm.get('from');
  }
  public get to() {
    return this.currenciesForm.get('to');
  }

  public data = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private datePipe: DatePipe,
    private currencyService: DynamicTablesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm() {
    this.currenciesForm = this.fb.group({
      delegation: ['', Validators.required],
      subdelegation: ['', Validators.required],
      currencie: [null, Validators.required],
      from: [null],
      to: [null],
    });
  }

  public send(): void {
    console.log(this.currenciesForm.value);
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGERADBNUMEOTRMON.pdf?PARAMFORM=NO&PARA_FECHA_DESDE=` +
    //   this.datePipe.transform(
    //     this.currenciesForm.controls['from'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PARA_FECHA_HASTA=` +
    //   this.datePipe.transform(
    //     this.currenciesForm.controls['to'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PARA_DELEGACION=` +
    //   this.currenciesForm.controls['delegation'].value +
    //     `&PARA_SUBDELEGACION=` +
    //   this.currenciesForm.controls['subdelegation'].value +
    //   `&PARA_MONEDA=` +
    //   this.currenciesForm.controls['currencie'].value;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.currenciesForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }

  public getCurrencies(event: any) {
    this.currencyService.getTvalTable5ByTable(3).subscribe(data => {
      this.currencies = new DefaultSelect(data.data, data.count);
    });
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

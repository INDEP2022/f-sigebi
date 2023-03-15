import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BankService } from '../../../../core/services/catalogs/bank.service';

@Component({
  selector: 'app-general-account-movements',
  templateUrl: './general-account-movements.component.html',
  styles: [],
})
export class GeneralAccountMovementsComponent
  extends BasePage
  implements OnInit
{
  public form: FormGroup;
  public id: string = 'id';
  public currency = new DefaultSelect();
  public banks = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private datePipe: DatePipe,
    private currencyService: DynamicTablesService
  ) {
    super();
  }

  public get noBien() {
    return this.form.get('noBien');
  }

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm(): void {
    this.form = this.fb.group({
      noBien: [null, [Validators.required, Validators.maxLength(10)]],
      record: [''],
      amount: [null],
      currency: [null],
      bank: [''],
      from: [''],
      to: [''],
    });
  }

  public send(): void {
    console.log(this.form.controls);
    // this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGERADBMOVCUEGEN.pdf?PARAMFORM=NO&PN_BIEN=` +
    //   this.form.controls['noBien'].value +
    //   `&PN_EXPE=` +
    //   this.form.controls['record'].value +
    //   `&PC_MONEDA=` +
    //   this.form.controls['currency'].value +
    //   `&PC_BANCO=` +
    //   this.form.controls['bank'].value +
    //   `&PN_MOVIMI=` +
    //   this.form.controls['amount'].value +
    //   `PC_FEC_INI=` +
    //   this.datePipe.transform(this.form.controls['from'].value, 'dd-mm-yyyy') +
    //   `PC_FEC_FIN=` +
    //   this.datePipe.transform(this.form.controls['to'].value, 'dd-mm-yyyy');
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

  public getCurrencies(event: any) {
    this.currencyService.getTvalTable5ByTable(3).subscribe(data => {
      this.currency = new DefaultSelect(data.data, data.count);
    });
  }

  public getBanks(event: any) {
    console.log(event);
    this.bankService.getAll(event).subscribe(data => {
      this.banks = new DefaultSelect(data.data, data.count);
    });
  }
}

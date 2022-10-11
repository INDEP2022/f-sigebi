import { Component, OnInit } from '@angular/core';

import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { DISPERSION_COLUMNS } from './dispersion-columns';
import { BILLS_COLUMNS } from './bills-columns';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-c-b-ge-can-c-numeraire-conversion-auctions',
  templateUrl: './c-b-ge-can-c-numeraire-conversion-auctions.component.html',
  styles: [
  ]
})
export class CBGeCanCNumeraireConversionAuctionsComponent extends BasePage implements OnInit {
  settings = {...TABLE_SETTINGS};
  settings2 = {...TABLE_SETTINGS};
  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns =  BILLS_COLUMNS;
    this.settings.actions.edit = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;

    this.settings2.columns = DISPERSION_COLUMNS;
    this.settings2.actions.edit = false;
    this.settings2.actions.add = false;
    this.settings2.actions.delete = false;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      cveEvent: ['', [Validators.required]],
      nameEvent: ['', [Validators.required]],
      obsEvent: ['', [Validators.required]],
      place: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      failureDate: ['', [Validators.required]],
    });
  }


 data = [
  {
    idGasto: '159',
    descrIdGasto: 'Gastos 159',
    monto: ' 132564',
    solPago: '147',
    mandato: 'mandato 1',
    total: '132711',
  }
 ]
data2 = [
  {
    noBien: '147',
    monto: '7894',
    partConver: 'mxn',
    solPago: '147',
    fecha: '31-05-2020',
  }
 ]

}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchFilter } from './../../../common/repository/interfaces/list-params';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { ICuenta } from 'src/app/core/models/catalogs/cuenta.model';
import { CuentaService } from 'src/app/core/services/catalogs/cuentas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-cuentas-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './cuentas-shared.component.html',
  styles: [],
})
export class CuentasSharedComponent extends BasePage implements OnInit {
  public selectControl = new FormControl();
  @Input() form: FormGroup;
  @Input() cuentaField: string = 'Cuentas';
  @Input() labelName: string = 'Cuentas Asociadas';

  params = new BehaviorSubject<ListParams>(new ListParams());

  showCuentas: boolean = true;
  cuentasData = new DefaultSelect<ICuenta>();
  columnFilters: any = [];

  //---
  @Output() objCuenta: EventEmitter<ICuenta> = new EventEmitter<ICuenta>();
  @Output() stringCuenta: EventEmitter<string> = new EventEmitter<string>();
  @Output() nameCuenta: EventEmitter<string> = new EventEmitter<string>();
  Data: DefaultSelect<ICuenta>;

  // constructor() {  }
  constructor(private service: CuentaService) {
    super();
  }

  ngOnInit(): void {
    //let bankCode = this.form.controls[this.cuentaField].value;
    const field = `filter.name`;

    this.cuentasData = new DefaultSelect([
      {
        cveBank: 'cuentaCode',
        isReference: true,
      },
    ]);

    console.log('SearchFilter.ILIKE  ' + `${SearchFilter.ILIKE}`);
    console.log('this.params ' + `${this.params.value}`);
    console.log('this.columnFilters ' + this.columnFilters.value);
    let paramsValue = { ...this.params, ...this.columnFilters };

    this.service.getAll(paramsValue).subscribe({
      next: resp =>
        (this.cuentasData = new DefaultSelect(resp.data, resp.count)),
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

    console.log('this.Data.data ' + this.cuentasData.data.toString);
    this.cuentasData.data.forEach(function (value) {
      console.log(value);
    });
    console.log('this.cuentasData ' + this.cuentasData.count);
  }
}

/*
    if (bankCode !== null && this.form.contains('bankName')) {
      let name = this.form.controls['bankName'].value;
      this.cuentasData = new DefaultSelect([
        {
          bankCode: bankCode,
          name: name,
        },
      ]);
    }

    if (this.form.get('bankKey')) {
      this.form.get('bankKey').valueChanges.subscribe(data => {
        if (data) {
            this.service.getById(data).subscribe(resp => {
            this.cuentasData = new DefaultSelect([resp], 1);
            this.nameCuenta.next(resp.accountType);
            this.stringCuenta.next(resp.accountType);

          });
        }
      });
    }
  }





getCuentas(params: ListParams) {
    const field = `filter.name`;
    if (params.text !== '' && params.text !== null) {
      this.columnFilters[field] = `${SearchFilter.ILIKE}:${params.text}`;
    } else {
      delete this.columnFilters[field];
    }
    console.log("field " + field);
    let paramsValue = { ...params, ...this.columnFilters };
    this.service.getAll(paramsValue).subscribe({
      next: resp => (this.cuentasData = new DefaultSelect(resp.data, resp.count)),
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
  }}

Modelo
            accountNumber?: number,
            accountNumberTransfer: string,
            registerNumber?: string,
            delegationNumber: number,
            cveAccount: string,
            accountType: string,
            cveCurrency: string,
            square: null,
            branch: number,
            cveInterestCalcRate: string,
            cveBank: string,
            isReference?: boolean;



*/

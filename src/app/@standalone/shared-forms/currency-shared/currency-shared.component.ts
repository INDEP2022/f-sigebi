import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';

@Component({
  selector: 'app-currency-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './currency-shared.component.html',
  styles: [],
})
export class CurrencySharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() currencyField: string = 'cveCurrency';
  @Input() showCurrency: boolean = true;

  currency = new DefaultSelect<ITvalTable5>();
  get Currency() {
    return this.form.get(this.currencyField);
  }

  constructor(private tableServ: TvalTable5Service) {
    super();
    this.currency = new DefaultSelect([{}], 1);
  }

  ngOnInit(): void {
    //Provicional en lo que se tiene dinámico
    this.tableServ.getById4(3, { limit: 39 }).subscribe({
      next: resp => {
        this.currency = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
        this.onLoadToast('error', error, '');
      },
    });
  }

  getCurrency(params: ListParams) {
    console.log(params);
  }

  onCurrencyChange(subdelegation: any) {}

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}

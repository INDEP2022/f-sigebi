import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Params
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { BehaviorSubject } from 'rxjs';
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
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  get Currency() {
    return this.form.get(this.currencyField);
  }

  constructor(private tableServ: TvalTable5Service) {
    super();
  }

  ngOnInit(): void {
    this.Currency.valueChanges.subscribe(data => {
      if (data) {
        this.filterParams.getValue().removeAllFilters();
        this.filterParams.getValue().page = 1;
        this.filterParams.getValue().addFilter('otKey1', data, SearchFilter.EQ);
        this.tableServ
          .getById4WidthFilters(3, this.filterParams.getValue().getParams())
          .subscribe({
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
    });
  }

  getCurrency(params: ListParams) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.filterParams
      .getValue()
      .addFilter('otValue01', params.text, SearchFilter.ILIKE);
    this.tableServ
      .getById4WidthFilters(3, this.filterParams.getValue().getParams())
      .subscribe({
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

  onCurrencyChange(currency: any) {
    this.currency = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}

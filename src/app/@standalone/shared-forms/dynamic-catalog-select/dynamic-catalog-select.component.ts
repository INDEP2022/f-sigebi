import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'dynamic-catalog-select',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './dynamic-catalog-select.component.html',
  styles: [],
})
export class DynamicCatalogSelectComponent extends BasePage implements OnInit {
  @Input() goodForm: FormGroup;
  @Input() feature: any;
  @Input() clasifNumber: string | number = null;
  dynamicData = new DefaultSelect([], 0);
  private accounts: boolean = false;
  private bank: string = null;
  constructor(private dynamicCatalogService: DynamicCatalogService) {
    super();
  }

  ngOnInit(): void {
    if (this.feature.cdTable == 'CUENTAS' && this.isNumerary()) {
      this.filterAccounts();
      this.accounts = true;
    } else {
      this.accounts = false;
    }
  }

  filterAccounts() {
    this.goodForm
      .get('val4')
      .valueChanges.pipe(takeUntil(this.$unSubscribe))
      .subscribe(value => {
        this.bank = value;
        this.dynamicData = new DefaultSelect();
        const params = new ListParams();
        params.limit = 100;
        this.getDynamicData(params);
      });
  }

  isNumerary() {
    return (
      this.clasifNumber == 1424 ||
      this.clasifNumber == 1426 ||
      this.clasifNumber == 1590
    );
  }

  test() {
    this.goodForm;
  }

  getDynamicData(params: ListParams) {
    this.dynamicCatalogService
      .getTable1Table5(
        {
          table: this.feature.cdTable,
          classificationGoodNumber: this.clasifNumber,
        },
        params
      )
      .subscribe({
        next: data => {
          if (this.accounts && this.bank) {
            const d = data.data.filter((_d: any) => {
              return _d.otclave.includes(this.bank);
            });
            this.dynamicData = new DefaultSelect(d, d.length);
          } else {
            this.dynamicData = new DefaultSelect(data.data, data.count);
          }
        },
        error: () => (this.dynamicData = new DefaultSelect()),
      });
  }

  getTvalTable1(params: ListParams) {
    this.dynamicCatalogService
      .getDynamicData(this.feature.cdTable, params)
      .subscribe({
        next: data => {},
      });
  }

  getTvalTable5(params: ListParams) {
    const CAT_MONEDA = '3';
    this.dynamicCatalogService
      .getCurrency(CAT_MONEDA, params)
      .pipe(
        map(response => {
          const { count } = response;
          const data = response.data.map((el: any) => {
            return { value: el.otValue01 };
          });
          return { count, data };
        })
      )
      .subscribe({
        next: data =>
          (this.dynamicData = new DefaultSelect(data.data, data.count)),
      });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'dynamic-catalog-select',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './dynamic-catalog-select.component.html',
  styles: [],
})
export class DynamicCatalogSelectComponent implements OnInit {
  @Input() goodForm: FormGroup;
  @Input() feature: any;
  dynamicData = new DefaultSelect([], 0);
  constructor(private dynamicCatalogService: DynamicCatalogService) {}

  ngOnInit(): void {}

  getDynamicData(params: ListParams) {
    console.log(this.feature);
    if (this.feature.cdTable == 'CAT_MON') {
      this.getTvalTable5(params);
    } else {
      this.getTvalTable1(params);
    }
  }

  getTvalTable1(params: ListParams) {
    this.dynamicCatalogService
      .getDynamicData(this.feature.cdTable, params)
      .subscribe({
        next: data =>
          (this.dynamicData = new DefaultSelect(data.data, data.count)),
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

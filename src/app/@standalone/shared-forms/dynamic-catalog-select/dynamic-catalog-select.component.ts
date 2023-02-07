import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    this.dynamicCatalogService
      .getDynamicData(this.feature.cdTable, params)
      .subscribe({
        next: data =>
          (this.dynamicData = new DefaultSelect(data.data, data.count)),
      });
  }
}

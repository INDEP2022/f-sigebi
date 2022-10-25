import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';

@Component({
  selector: 'app-warehouse-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './warehouse-shared.component.html',
  styles: [],
})
export class WarehouseSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() warehouseField: string = 'warehouse';

  @Input() showWarehouse: boolean = true;

  warehouses = new DefaultSelect<IWarehouse>();

  get warehouse() {
    return this.form.get(this.warehouseField);
  }

  constructor(private service: WarehouseService) {
    super();
  }

  ngOnInit(): void {}

  getWarehouses(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.warehouses = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onWarehouseChange(type: any) {
    this.form.updateValueAndValidity();
    //this.resetFields([this.subdelegation]);
    //this.subdelegations = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}

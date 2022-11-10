import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
//Models
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
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

  @Input() warehouseTypeField: string = 'warehouseType';

  @Input() warehouseField: string = 'warehouse';

  @Input() showWarehouseType: boolean = true;

  @Input() showWarehouse: boolean = true;

  warehouses = new DefaultSelect<IWarehouse>();

  warehousesType = new DefaultSelect<ITypeWarehouse>();

  get warehouse() {
    return this.form.get(this.warehouseField);
  }

  get warehouseType() {
    return this.form.get(this.warehouseTypeField);
  }

  constructor(
    private serviceTW: TypeWarehouseService,
    private serviceW: WarehouseService
  ) {
    super();
  }

  ngOnInit(): void {}

  getWarehousesType(params: ListParams) {
    this.serviceTW.getAll(params).subscribe(
      data => {
        this.warehousesType = new DefaultSelect(data.data, data.count);
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

  getWarehouses(params: ListParams) {
    /*{ type: this.warehouseType.value, ...params }*/
    this.serviceW.getAll(params).subscribe(
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

  onWarehouseTypeChange(type: any) {
    this.resetFields([this.warehouse]);
    this.warehouses = new DefaultSelect();
    this.form.updateValueAndValidity();
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

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';

@Component({
  selector: 'app-warehouse-proceedings',
  templateUrl: './warehouse-proceedings.component.html',
  styles: [],
})
export class WarehouseProceedingsComponent implements OnInit {
  form: FormGroup;
  @Input() statusActaValue: string;
  selectedWarehouse: any;
  selectedVault: any;
  paramsWarehouse = new FilterParams();
  paramsSafes = new FilterParams();
  constructor(
    private fb: FormBuilder,
    private serviceW: WarehouseService,
    private safeService: SafeService
  ) {
    this.form = this.fb.group({
      massive: [null],
      warehouseId: [null],
      warehouseDescription: [null],
      vaultId: [null],
      vaultDescription: [null],
    });
    this.form.valueChanges.subscribe(x => {
      console.log(x);
    });
  }

  ngOnInit(): void {}

  get warehouses() {
    return this.serviceW.getAllFilter(this.paramsWarehouse.getParams());
  }

  get safes() {
    return this.safeService.getAllFilter(this.paramsSafes.getParams());
  }

  selectWarehouse(warehouse: IWarehouse) {
    // console.log(event);
    this.selectedWarehouse = warehouse;
    this.form.get('warehouseDescription').setValue(warehouse.description);
  }
}

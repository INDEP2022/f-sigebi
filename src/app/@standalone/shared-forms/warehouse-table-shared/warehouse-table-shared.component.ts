import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { SelectModalTableSharedComponent } from '../select-modal-table-shared/select-modal-table-shared.component';

@Component({
  selector: 'app-warehouse-table-shared',
  standalone: true,
  imports: [CommonModule, SelectModalTableSharedComponent],
  templateUrl: './warehouse-table-shared.component.html',
  styles: [],
})
export class WarehouseTableSharedComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() disabled: boolean;
  @Input() label: string = 'No Almacén';
  @Input() labelName: string = 'Descripción de almacén';
  @Input() formField: string = 'warehouseId';
  @Input() formFieldName: string = 'warehouseDescription';
  columnsType = {
    idWarehouse: {
      title: 'ID',
      type: 'string',
      sort: false,
    },
    description: {
      title: 'Descripción',
      type: 'string',
      sort: false,
    },
  };
  constructor(public service: WarehouseService) {}

  ngOnInit(): void {}
}

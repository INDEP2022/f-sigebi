import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { IWarehouse } from './../../../core/models/catalogs/warehouse.model';

@Component({
  selector: 'app-warehouse-table-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './warehouse-table-shared.component.html',
  styles: [],
})
export class WarehouseTableSharedComponent
  extends OpenModalListFiltered
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() disabled: boolean;
  @Input() label: string = 'No Almacén';
  @Input() formField: string = 'warehouseId';
  @Input() formFieldName: string = 'warehouseDescription';
  constructor(
    protected override modalService: BsModalService,
    private service: WarehouseService
  ) {
    super(modalService);
  }

  ngOnInit(): void {}

  openModal() {
    this.openModalSelect(
      {
        title: 'Almacenes',
        columnsType: {
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
        },
        service: this.service,
        settings: { ...TABLE_SETTINGS },
        dataObservableFn: this.service.getAllFilterSelf,
        searchFilter: { field: 'description', operator: SearchFilter.LIKE },
      },
      this.selectData
    );
  }

  selectData(row: IWarehouse, self: WarehouseTableSharedComponent) {
    self.form.get(self.formField).setValue(row.idWarehouse);
    if (self.form.get(self.formFieldName))
      self.form.get(self.formFieldName).setValue(row.description);
  }
}

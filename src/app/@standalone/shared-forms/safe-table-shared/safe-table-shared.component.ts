import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-safe-table-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './safe-table-shared.component.html',
  styles: [],
})
export class SafeTableSharedComponent
  extends OpenModalListFiltered
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() disabled: boolean;
  @Input() label: string = 'No Boveda';
  @Input() formField: string = 'vaultId';
  @Input() formFieldName: string = 'vaultDescription';
  constructor(
    protected override modalService: BsModalService,
    private service: SafeService
  ) {
    super(modalService);
  }

  ngOnInit(): void {}

  openModal() {
    this.openModalSelect(
      {
        title: 'Bovedas',
        columnsType: {
          idSafe: {
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

  selectData(row: ISafe, self: SafeTableSharedComponent) {
    self.form.get(self.formField).setValue(row.idSafe);
    if (self.form.get(self.formFieldName))
      self.form.get(self.formFieldName).setValue(row.description);
  }
}

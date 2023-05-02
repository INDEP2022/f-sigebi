import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-goods-table-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-table-shared.component.html',
  styles: [],
})
export class GoodsTableSharedComponent
  extends OpenModalListFiltered
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() label: string = 'Agregar Nuevo bien';
  @Input() formField: string = 'goodId';
  @Input() disabled = false;
  @Output() selectRow = new EventEmitter();
  constructor(
    protected override modalService: BsModalService,
    private goodTrackerService: GoodTrackerService
  ) {
    super(modalService);
  }

  ngOnInit(): void {}

  openModal() {
    this.openModalSelect(
      {
        title: 'Bienes',
        columnsType: {
          goodNumber: {
            title: 'ID',
            type: 'string',
            sort: false,
          },
          quantity: {
            title: 'Cantidad',
            type: 'string',
            sort: false,
          },
        },
        service: this.goodTrackerService,
        settings: { ...TABLE_SETTINGS },
        initialCharge: false,
        haveSearch: false,
        dataObservableFn: this.goodTrackerService.getAllModal,
        searchFilter: {
          field: 'goodNumber',
          value: '',
          operator: SearchFilter.IN,
        },
      },
      this.selectGood
    );
  }

  selectGood(
    good: { goodNumber: string; quantity: string },
    self: GoodsTableSharedComponent
  ) {
    self.form.get(self.formField).setValue(good.goodNumber);
    self.selectRow.emit(good);
  }
}

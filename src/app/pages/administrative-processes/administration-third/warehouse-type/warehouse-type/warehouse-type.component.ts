import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { WarehouseTypeModalComponent } from '../warehouse-type-modal/warehouse-type-modal.component';
import { QUALIFIERS_COLUMNS } from './warehouse-type-columns';

@Component({
  selector: 'app-warehouse-type',
  templateUrl: './warehouse-type.component.html',
  styles: [],
})
export class WarehouseTypeComponent extends BasePage implements OnInit {
  warehouseForm: FormGroup;
  warehouseTimeForm: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...QUALIFIERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.warehouseForm = this.fb.group({
      descripction: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      noTypeWarehouse: [null, Validators.required],
      area: [null, Validators.required],
    });
    this.warehouseTimeForm = this.fb.group({
      normal: [null, Validators.required],
      pDestruction: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
  openType(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(WarehouseTypeModalComponent, config);
  }
}

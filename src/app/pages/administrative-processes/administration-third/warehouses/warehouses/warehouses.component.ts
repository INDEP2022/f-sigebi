import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  GOODSONPALLET_COLUMNS,
  GOODSPOSITION_COLUMNS,
  LEVELS_COLUMNS,
  PALLET_COLUMNS,
  POSITIONS_COLUMNS,
  WAREHOUSES_COLUMNS,
} from './warehouses-columns';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styles: [],
})
export class WarehousesComponent extends BasePage implements OnInit {
  settings2 = { ...this.settings, actions: false };
  settings3 = { ...this.settings, actions: false };
  settings4 = { ...this.settings, actions: false };
  settings5 = { ...this.settings, actions: false };
  settings6 = { ...this.settings, actions: false };

  warehouseForm: ModelForm<any>;
  warehouseContractForm: ModelForm<any>;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...WAREHOUSES_COLUMNS },
    };
    this.settings2.columns = GOODSONPALLET_COLUMNS;
    this.settings3.columns = PALLET_COLUMNS;
    this.settings4.columns = POSITIONS_COLUMNS;
    this.settings5.columns = LEVELS_COLUMNS;
    this.settings6.columns = GOODSPOSITION_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.warehouseForm = this.fb.group({
      no: [null, Validators.required],
      keyCode: [null, Validators.required],
      file: [null, Validators.required],
      dateElaboration: [null, Validators.required],
      statusRecord: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      physicalReceiptDate: [null, Validators.required],
      dateClosure: [null, Validators.required],
      transference: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
    this.warehouseContractForm = this.fb.group({
      storehouse: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      contract: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      tStorehouse: [null, Validators.required],
      total: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      secc1: [null, Validators.required],
      secc2: [null, Validators.required],
      secc3: [null, Validators.required],
      secc4: [null, Validators.required],
      yard: [null, Validators.required],
      roofing: [null, Validators.required],
      storehouseCheck: [null, Validators.required],
      space: [null, Validators.required],
      section: [null, Validators.required],
      storage: [null, Validators.required],
      container: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
}

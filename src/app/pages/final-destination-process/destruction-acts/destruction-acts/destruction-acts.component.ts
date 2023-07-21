import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNSTABL1 } from './columnsTable1';
import { COLUMNSTABLE2 } from './columnsTable2';
import { LocalDataSource } from 'ng2-smart-table';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-destruction-acts',
  templateUrl: './destruction-acts.component.html',
  styles: [],
})
export class DestructionActsComponent extends BasePage implements OnInit {
  formTable1: FormGroup;
  formTable2: FormGroup;
  response: boolean = false; //data backend
  settings2: any;
  data = new LocalDataSource();
  data2 = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;

  //Variables
  actForm: FormGroup;

  records = new DefaultSelect()


  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNSTABL1;
    this.settings2.columns = COLUMNSTABLE2;
  }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.actForm = this.fb.group({
      expedient: [null],
      prevAv: [null],
      criminalCase: [null],
      //Acta
      act: [null],
      status: [null],
      transferent: [null],
      destructor: [null],
      admin: [null],
      folio: [null],
      year: [null],
      month: [null]
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
    });
  }

  onSubmit() {}
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
import { data, dataBA } from './data';

@Component({
  selector: 'app-c-c-bmt-c-bank-movements-types',
  templateUrl: './c-c-bmt-c-bank-movements-types.component.html',
  styles: [],
})
export class CCBmtCBankMovementsTypesComponent
  extends BasePage
  implements OnInit
{
  //PROVISIONAL Bank Account DATA
  bankAccounts: any[] = dataBA;

  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  eventTypesD = data;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      mode: '',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.load(this.eventTypesD);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
    });
  }
}

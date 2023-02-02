import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { LIST_WAREHOUSE_COLUMNS } from './columns/list-warehouses-columns';

var data = [
  {
    noWarehouse: 'P44',
    name: 'ALMACEN DE PRUEBA LAR',
    state: 'Ciudad de Mexico',
    direction:
      'PRIVADA DE LOS REYES, LOS REYES 27, AZACAPOTZALCO, CIUDAD DE MEXICO',
  },
];
@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styles: [],
})
export class WarehouseDetailComponent extends BasePage implements OnInit {
  showSamplingDetail: boolean = true;
  searchForm: ModelForm<any>;
  warehoseSelected: any;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_WAREHOUSE_COLUMNS,
    };
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      noWarehouse: [null],
      postalCode: [null],
      warehouseName: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  search() {
    console.log(this.searchForm);
    this.paragraphs.load(data);
  }

  rowSelect(event: any) {
    this.warehoseSelected = event.data;
  }
}

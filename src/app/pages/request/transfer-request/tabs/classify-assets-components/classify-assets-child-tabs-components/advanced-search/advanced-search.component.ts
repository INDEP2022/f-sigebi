import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ADVANCED_SEARCH_COLUMNS } from './advanced-search-columns';

var data: any[] = [
  {
    id: 1,
    fraction: '17625',
    code: '8703.24.01',
    level: '5',
    Description: 'DE CILINDRADA MAYOR A 3000 CM3',
  },
  {
    id: 2,
    fraction: '23231',
    code: '8703.24.31',
    level: '3',
    Description: 'DE CILINDRADA MAYOR A 1200 CM3',
  },
];

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styles: [],
})
export class AdvancedSearchComponent extends BasePage implements OnInit {
  searchForm: ModelForm<any>;
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectTypeRelevant = new DefaultSelect<any>();
  complaince: any;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public fb: FormBuilder, private modelRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: ADVANCED_SEARCH_COLUMNS,
    };
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      code: [null],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      typeRelevant: [null],
    });
  }

  getTypeRelevant(event: any): void {}

  rowSelected(event: any) {
    this.complaince = event.data;
  }

  search(): void {
    this.paragraphs = data;
  }

  clean(): void {
    this.searchForm.reset();
  }

  complianceSelected(): void {
    if (this.complaince != undefined) {
      this.event.emit(this.complaince);
      this.close();
    }
  }

  close(): void {
    this.modelRef.hide();
  }
}

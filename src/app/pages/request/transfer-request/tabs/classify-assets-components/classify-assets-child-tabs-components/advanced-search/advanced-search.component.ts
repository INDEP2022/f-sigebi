import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
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
  totalItems: number = 0;
  selectTypeRelevant = new DefaultSelect<any>();
  complaince: any;
  public event: EventEmitter<any> = new EventEmitter();

  private fractionService = inject(FractionService);
  private typeRelevantService = inject(TypeRelevantService);

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
    this.getTypeRelevant(new ListParams());
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      code: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      typeRelevant: [null],
    });
  }

  getTypeRelevant(params: ListParams): void {
    params.limit = 30;
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.selectTypeRelevant = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  rowSelected(event: any) {
    this.complaince = event.data;
  }

  search(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      let params = new ListParams();
      params.page = data.inicio;
      params.limit = data.pageSize;
      this.getSearch(data);
    });
  }

  getSearch(params: ListParams) {
    //let params = new ListParams();

    const code = this.searchForm.controls['code'].value;
    const description = this.searchForm.controls['description'].value;
    const typeRelevant = this.searchForm.controls['typeRelevant'].value;

    if (code != null) {
      params['filter.code'] = `$eq:${code}`;
    }
    if (description != null) {
      params['filter.description'] = `$ilike:${description}`;
    }
    if (typeRelevant != null) {
      params['filter.relevantTypeId'] = `$eq:${typeRelevant}`;
    }

    this.paragraphs = [];
    this.fractionService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.paragraphs = data.data;
        this.totalItems = data.count;
      },
      error: error => {
        console.log(error);
        this.onLoadToast(
          'info',
          'Búsqueda Avanzada',
          'No se encontraron registros'
        );
      },
    });
  }

  clean(): void {
    this.searchForm.reset();
    this.paragraphs = [];
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.totalItems = 0;
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

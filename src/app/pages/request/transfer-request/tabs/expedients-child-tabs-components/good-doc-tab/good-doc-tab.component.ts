import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOOD_DOCUMENTES_COLUMNS } from './good-doc-columns';

@Component({
  selector: 'app-good-doc-tab',
  templateUrl: './good-doc-tab.component.html',
  styles: [],
})
export class GoodDocTabComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any = [];
  totalItems: number = 0;

  constructor() {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = GOOD_DOCUMENTES_COLUMNS;
  }

  ngOnInit(): void {
    /* this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample()); */
  }

  getExample() {
    /* this.loading = true;
    this.goodTypesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        console.log(this.paragraphs);
        this.loading = false;
      },
      error: error => (this.loading = false),
    }); */
  }

  selectTableColumns(event: any): void {
    console.log(event);
  }

  showDocuments(): void {
    console.log('mostrar los documentos seleccionados');
  }
}

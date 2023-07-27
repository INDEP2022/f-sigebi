import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SaveValueFormComponent } from '../save-value-form/save-value-form.component';
import { SAVE_VALUES_COLUMNS } from './save-values-columns';

@Component({
  selector: 'app-save-values-list',
  templateUrl: './save-values-list.component.html',
  styles: [],
})
export class SaveValuesListComponent extends BasePage implements OnInit {
  values: ISaveValue[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private saveValueService: SaveValueService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAVE_VALUES_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'contractNumber' ||
            filter.field == 'weightedDeduction' ||
            filter.field == 'startingRankPercentage' ||
            filter.field == 'finalRankPercentage' ||
            filter.field == 'status' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getSaveValues();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSaveValues());
  }

  getSaveValues() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.saveValueService.getAll(params).subscribe({
      next: response => {
        this.values = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(saveValue?: ISaveValue) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      saveValue,
      callback: (next: boolean) => {
        if (next) this.getSaveValues();
      },
    };
    this.modalService.show(SaveValueFormComponent, modalConfig);
  }

  AlertQuestion(saveValue: ISaveValue) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(saveValue.id);
      }
    });
  }

  remove(id: string) {
    const data = {
      id: id,
    };

    this.saveValueService.remove2(data).subscribe({
      next: () => {
        this.alert('success', 'Valor Guardado', 'Borrado Correctamente');
        this.getSaveValues();
      },
      error: err => {
        this.alert(
          'warning',
          'Valor Guardado',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}

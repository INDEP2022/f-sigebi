import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LabelOkeyFormComponent } from '../label-okey-form/label-okey-form.component';
import { LABEL_OKEY_COLUMNS } from './label-okey-columns';

@Component({
  selector: 'app-label-okey-list',
  templateUrl: './label-okey-list.component.html',
  styles: [],
})
export class LabelOkeyListComponent extends BasePage implements OnInit {
  paragraphs: ILabelOKey[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private labelOkeyService: LabelOkeyService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LABEL_OKEY_COLUMNS;
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
          this.getLabelsOkey();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLabelsOkey());
  }

  getLabelsOkey() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.labelOkeyService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(labelOKey?: ILabelOKey) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      labelOKey,
      callback: (next: boolean) => {
        if (next) this.getLabelsOkey();
      },
    };
    this.modalService.show(LabelOkeyFormComponent, modalConfig);
  }

  delete(labelOKey: ILabelOKey) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.labelOkeyService.remove2(labelOKey.id).subscribe({
          next: () => {
            this.getLabelsOkey(),
              this.alert('success', 'Etiqueta Bien', 'Borrado Correctamente');
          },
          error: error => {
            this.alert(
              'warning',
              'Etiquetas bien',
              'No se puede eliminar el objeto debido a una relación con otra tabla.'
            );
          },
        });
      }
    });
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalService.hide();
  }
}

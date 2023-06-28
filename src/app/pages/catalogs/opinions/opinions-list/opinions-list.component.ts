import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IOpinion } from 'src/app/core/models/catalogs/opinion.model';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { OpinionFormComponent } from '../opinion-form/opinion-form.component';
import { OPINION_COLUMNS } from './opinion-columns';

@Component({
  selector: 'app-opinions-list',
  templateUrl: './opinions-list.component.html',
  styles: [],
})
export class OpinionsListComponent extends BasePage implements OnInit {
  opinions: IOpinion[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private opinionService: OpinionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = OPINION_COLUMNS;
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
            filter.field == 'id' || filter.field == 'dict_ofi'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.opinionService.getAll(params).subscribe({
      next: response => {
        this.opinions = response.data;
        this.data.load(this.opinions);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(opinion?: IOpinion) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      opinion,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(OpinionFormComponent, modalConfig);
  }

  showDeleteAlert(opinion: IOpinion) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(opinion.id);
      }
    });
  }

  delete(id: number) {
    this.opinionService.removeCatalogOpinions(id).subscribe({
      next: () => {
        this.getDeductives(), this.alert('success', 'Dictamen', 'Borrado');
      },
      error: err => {
        this.alert(
          'warning',
          'Dictámen',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}

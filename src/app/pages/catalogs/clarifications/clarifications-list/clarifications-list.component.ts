import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IClarification } from '../../../../core/models/catalogs/clarification.model';
import { ClarificationService } from '../../../../core/services/catalogs/clarification.service';
import { ClarificationsDetailComponent } from '../clarifications-detail/clarifications-detail.component';
import { CLARIFICATION_COLUMNS } from './clarification-columns';

@Component({
  selector: 'app-clarifications-list',
  templateUrl: './clarifications-list.component.html',
  styles: [],
})
export class ClarificationsListComponent extends BasePage implements OnInit {
  clarifications: IClarification[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  @Input() idGood: number;

  constructor(
    private clarificationService: ClarificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CLARIFICATION_COLUMNS;

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        delete: true,
        add: false,
      },
    };
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
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getClarifications();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getClarifications());
  }

  getClarifications() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.clarificationService.getAll(params).subscribe(
      response => {
        this.clarifications = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.clarifications);
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openForm(clarification?: IClarification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      clarification,
      callback: (next: boolean) => {
        if (next) this.getClarifications();
      },
    };
    this.modalService.show(ClarificationsDetailComponent, modalConfig);
  }

  showDeleteAlert(clarification: IClarification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(clarification.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.clarificationService.remove(id).subscribe({
      next: () => this.getClarifications(),
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ILawyer } from 'src/app/core/models/catalogs/lawyer.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { LawyerService } from '../../../../core/services/catalogs/lawyer.service';
import { LawyerDetailComponent } from '../lawyer-detail/lawyer-detail.component';
import { LAWYER_COLUMNS } from './lawyer-columns';

@Component({
  selector: 'app-lawyer-list',
  templateUrl: './lawyer-list.component.html',
  styles: [],
})
export class LawyerListComponent extends BasePage implements OnInit {
  lawyers: ILawyer[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private lawyerService: LawyerService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LAWYER_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getLawyers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLawyers());
  }

  getLawyers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.lawyerService.getAll(params).subscribe(
      response => {
        this.lawyers = response.data;
        this.data.load(this.lawyers);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<LawyerDetailComponent>) {
    const modalRef = this.modalService.show(LawyerDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getLawyers();
    });
  }

  edit(lawyer: ILawyer) {
    this.openModal({ edit: true, lawyer });
  }

  showDeleteAlert(lawyer: ILawyer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(lawyer.id);
      }
    });
  }

  delete(id: number) {
    this.lawyerService.remove(id).subscribe({
      next: () => {
        this.getLawyers(), this.alert('success', 'ABOGADO', 'Borrado');
      },
    });
  }
}

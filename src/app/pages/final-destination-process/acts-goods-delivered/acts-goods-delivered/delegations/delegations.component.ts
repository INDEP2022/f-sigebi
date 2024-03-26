import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DELEGACIONES } from '../columns';

@Component({
  selector: 'app-delegations',
  templateUrl: './delegations.component.html',
  styles: [],
})
export class DelegationsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  vaultSelect: any;
  totalItems2: number = 0;
  selectedRow: any | null = null;
  data: LocalDataSource = new LocalDataSource();
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private delegationService: DelegationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...DELEGACIONES,
      },
    };
  }
  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              id: () => (searchFilter = SearchFilter.EQ),
              keyTransferent: () => (searchFilter = SearchFilter.ILIKE),
              nameTransferent: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getTransferentesDeliveryCve();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTransferentesDeliveryCve());
  }

  return() {
    this.loading = false;
    this.onCancel.emit();
    this.modalRef.hide();
  }

  getTransferentesDeliveryCve() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.delegationService.getAll(params).subscribe({
      next: value => {
        let result = value.data.map(item => {});

        Promise.all(result).then(resp => {
          this.data.load(value.data);
          this.data.refresh();
          this.loading = false;
          this.totalItems2 = value.count;
        });
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
        this.totalItems2 = 0;
      },
    });
  }

  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
    } else {
      this.selectedRow = null;
    }

    console.log(this.selectedRow);
  }

  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }
}

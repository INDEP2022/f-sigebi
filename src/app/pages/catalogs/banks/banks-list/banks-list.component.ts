import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IBank } from '../../../../core/models/catalogs/bank.model';
import { BankService } from '../../../../core/services/catalogs/bank.service';
import { BanksDetailComponent } from '../banks-detail/banks-detail.component';
import { BANKS_COLUMNS } from './banks-columns';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-banks-list',
  templateUrl: './banks-list.component.html',
  styles: [],
})
export class BanksListComponent extends BasePage implements OnInit {
  bank: IBank[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private bankService: BankService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...BANKS_COLUMNS },
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
          this.getBanks();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBanks());
  }

  getBanks() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.bankService.getAll(params).subscribe(
      response => {
        this.bank = response.data;
        this.data.load(this.bank);
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

  openModal(context?: Partial<BanksDetailComponent>) {
    const modalRef = this.modalService.show(BanksDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getBanks());
      }
    });
  }

  edit(bank: IBank) {
    this.openModal({ edit: true, bank });
  }

  showDeleteAlert(bank: IBank) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(bank.bankCode);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.bankService.remove(id).subscribe({
      next: () => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getBanks());
      }
    });
  }
}

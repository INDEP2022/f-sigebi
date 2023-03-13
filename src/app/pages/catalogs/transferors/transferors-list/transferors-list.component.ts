import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITransferenteSae } from 'src/app/core/models/catalogs/transferente.model';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TransferorsDetailComponent } from '../transferors-detail/transferors-detail.component';
import { STATE_COLUMS, TRANSFERENT_STATE_COLUMNS } from './columns';

@Component({
  selector: 'app-transferors-list',
  templateUrl: './transferors-list.component.html',
  styles: [],
})
export class TransferorsListComponent extends BasePage implements OnInit {
  columns: ITransferenteSae[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  settings2;

  stateList = [
    {
      transferente: 'PGR',
      estado: 'Aguascalientes',
    },
  ];

  constructor(
    private modalService: BsModalService,
    private transferenteSaeService: TransferentesSaeService
  ) {
    super();
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },*/
      columns: { ...TRANSFERENT_STATE_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...STATE_COLUMS },
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
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getTransferents();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTransferents());
  }

  getTransferents() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.transferenteSaeService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(transferorsState?: ITransferenteSae) {
    let config: ModalOptions = {
      initialState: {
        transferorsState,
        callback: (next: boolean) => {
          if (next) this.getTransferents();
          console.log('cerrando');
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TransferorsDetailComponent, config);
  }
}

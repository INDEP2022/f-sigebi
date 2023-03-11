import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ILegalAffair } from 'src/app/core/models/catalogs/legal-affair-model';
import { LegalAffairService } from 'src/app/core/services/catalogs/legal-affair.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { LegalAffairDetailComponent } from '../legal-affair-detail/legal-affair-detail.component';
import { LEGAL_AFFAIR_COLUMNS } from './columns';

@Component({
  selector: 'app-legal-affair-list',
  templateUrl: './legal-affair-list.component.html',
  styles: [],
})
export class LegalAffairListComponent extends BasePage implements OnInit {
  columns: ILegalAffair[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  legalAffairList: ILegalAffair[] = [];

  constructor(
    private modalService: BsModalService,
    private legalAffairService: LegalAffairService
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
      columns: { ...LEGAL_AFFAIR_COLUMNS },
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
          this.getLegalAffairAll();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLegalAffairAll());
  }

  getLegalAffairAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.legalAffairService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openForm(legalAffair?: ILegalAffair) {
    let config: ModalOptions = {
      initialState: {
        legalAffair,
        callback: (next: boolean) => {
          if (next) this.getLegalAffairAll();
          console.log('cerrando');
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LegalAffairDetailComponent, config);
  }

  showDeleteAlert(legalAffair?: ILegalAffair) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(legalAffair.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.legalAffairService.remove(id).subscribe({
      next: () => this.getLegalAffairAll(),
    });
  }
}

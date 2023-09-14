import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { BankConceptsModalComponent } from '../bank-concepts-modal/bank-concepts-modal.component';
import { BANK_CONCEPTS_COLUMNS } from './bank-concepts-columns';
//models
import { IBankConcepts } from 'src/app/core/models/catalogs/bank-concepts-model';
//services
import { LocalDataSource } from 'ng2-smart-table';
import { BankConceptsService } from 'src/app/core/services/catalogs/bank-concepts-service';

@Component({
  selector: 'app-bank-concepts',
  templateUrl: './bank-concepts.component.html',
  styles: [],
})
export class BankConceptsComponent extends BasePage implements OnInit {
  bankConcepts: IBankConcepts[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private bankConceptsService: BankConceptsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...BANK_CONCEPTS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'key':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
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
          this.params = this.pageFilter(this.params);
          this.getBankConcepts();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBankConcepts());
  }

  getBankConcepts() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.bankConceptsService.getAll(params).subscribe({
      next: response => {
        this.bankConcepts = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(bankConcepts?: IBankConcepts) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      bankConcepts,
      callback: (next: boolean) => {
        if (next) this.getBankConcepts();
      },
    };
    this.modalService.show(BankConceptsModalComponent, modalConfig);
  }

  showDeleteAlert(bankConcepts: IBankConcepts) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(bankConcepts.key);
      }
    });
  }

  delete(id: string) {
    this.bankConceptsService.remove(id).subscribe({
      next: () => {
        this.getBankConcepts();
        this.alert('success', 'Concepto bancario', 'Borrado');
      },
      error: erro => {
        this.alert(
          'warning',
          'Concepto bancario',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}

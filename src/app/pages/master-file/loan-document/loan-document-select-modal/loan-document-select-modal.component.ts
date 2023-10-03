import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared';
import { SERVICEORDERSFORMASELECT_COLUMNS } from './service-orders-format-historic-columns';

@Component({
  selector: 'app-loan-document-select-modal',
  templateUrl: './loan-document-select-modal.component.html',
  styles: [],
})
export class LoanDocumentSelectModalComponent
  extends BasePage
  implements OnInit
{
  datalocal: LocalDataSource = new LocalDataSource();
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  selectedRow: any;
  constructor(
    private modalRef: BsModalRef,
    private DocumentsService: DocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: SERVICEORDERSFORMASELECT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.filterA();
  }

  close() {
    this.modalRef.hide();
  }

  getAll() {
    this.data1 = [];
    this.datalocal.load([]);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.DocumentsService.getAllDocumentsLoan(params).subscribe({
      next: response => {
        console.log('respuesta modal ', response);
        for (let i = 0; i < response.data.length; i++) {
          let paramstable = {
            loanNumber: response.data[i].loanNumber,
            recordNumber: response.data[i].recordNumber,
            loanUser: response.data[i].loanUser,
            observations: response.data[i].observations,
          };
          this.data1.push(paramstable);
          this.datalocal.load(this.data1);
          this.totalItems = response.count;
        }
      },
    });
  }

  filterA() {
    this.datalocal
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
              case 'loanNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'recordNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'loanUser':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'observations':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAll());
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
  }

  selected() {
    if (this.selectedRow == null) {
      this.alert('warning', 'Es Necesario Seleccionar un Registro', '');
    } else {
      this.modalRef.content.callback(
        true,
        this.selectedRow.loanNumber,
        this.selectedRow.recordNumber
      );
      this.modalRef.hide();
    }
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocumentsForDictum } from 'src/app/core/models/catalogs/documents-for-dictum.model';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DATE_DOCUMENTS_DICTUM_COLUMNS } from './date-documents-dictum-columns';

@Component({
  selector: 'app-date-documents-dictum',
  templateUrl: './date-documents-dictum.component.html',
  styles: [],
})
export class DateDocumentsDictumComponent extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();
  documentsForDictum: IDocumentsForDictum[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  rowSelected: boolean = false;
  selectedRow: any = null;
  dateDocumentsForm: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private documentsForDictumService: DocumentsForDictumService
  ) {
    super();
    /*this.settings = {
      ...this.settings,
      actions: false,
      columns: DATE_DOCUMENTS_DICTUM_COLUMNS,
      selectedRowIndex: -1,
    };*/
    this.settings.columns = DATE_DOCUMENTS_DICTUM_COLUMNS;
    this.settings.actions = false;
    //this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.prepareForm();
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
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'typeDictum':
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
          this.getAllDocumentsForDictum();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllDocumentsForDictum());
  }
  private prepareForm() {
    this.dateDocumentsForm = this.fb.group({
      typeDictum: [null],
    });
  }
  getAllDocumentsForDictum() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentsForDictumService.getAll(params).subscribe({
      next: response => {
        this.documentsForDictum = response.data;
        this.data.load(this.documentsForDictum);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }
  private getDocumentsForDictum() {
    this.loading = true;
    let file = this.dateDocumentsForm.controls['typeDictum'].value;
    this.documentsForDictumService.getById3(file.toString()).subscribe({
      next: response => {
        this.documentsForDictum = response.data;
        for (let i = 0; i < this.documentsForDictum.length; i++) {
          this.documentsForDictum[i].id = response.data[i].key;
        }
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  search() {
    if (this.dateDocumentsForm.valid) {
      this.getDocumentsForDictum();
    } else {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getAllDocumentsForDictum());
    }
  }
  close() {
    this.modalRef.hide();
  }
  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}

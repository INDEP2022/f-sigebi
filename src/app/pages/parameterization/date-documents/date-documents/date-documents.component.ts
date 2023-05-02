import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDateDocuments } from 'src/app/core/models/catalogs/date-documents.model';
import { DateDocumentsService } from 'src/app/core/services/catalogs/date-documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DateDocumentsModalComponent } from '../date-documents-modal/date-documents-modal.component';
import { DATEDOCUMENTS_COLUMNS } from './date-documents-columns';

@Component({
  selector: 'app-date-documents',
  templateUrl: './date-documents.component.html',
  styles: [],
})
export class DateDocumentsComponent extends BasePage implements OnInit {
  dateDocuments: IDateDocuments[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  dateDocumentsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dateDocumentsService: DateDocumentsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: DATEDOCUMENTS_COLUMNS,
    };
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
          this.getAllDateDocuments();
        }
      });
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllDateDocuments());
  }
  private prepareForm() {
    this.dateDocumentsForm = this.fb.group({
      proceedings: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }
  getAllDateDocuments() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dateDocumentsService.getAllPaginated2(params).subscribe({
      next: response => {
        console.log(response);
        this.dateDocuments = response.data;
        this.data.load(this.dateDocuments);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  private getDateDocuments() {
    this.loading = true;
    let file = this.dateDocumentsForm.controls['proceedings'].value;
    this.dateDocumentsService.getById3(file.toString()).subscribe({
      next: response => {
        this.dateDocuments = response.data;
        this.data.load(this.dateDocuments);
        this.data.refresh();
        this.totalItems = response.count != undefined ? response.count : 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  public search() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDateDocuments());
  }
  public openForm(dateDocuments?: IDateDocuments) {
    let config: ModalOptions = {
      initialState: {
        dateDocuments,
        callback: (next: boolean) => {
          if (this.dateDocumentsForm.valid) {
            this.search();
          } else {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getAllDateDocuments());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DateDocumentsModalComponent, config);
  }
}

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SCANNED_DOCUMENTS_COLUMNS } from './scanned-documents-columns';

@Component({
  selector: 'app-scanned-documents',
  templateUrl: './scanned-documents.component.html',
  styles: [],
})
export class ScannedDocumentsComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  user: any;
  noExpe: number = 1;
  proceedings: number;
  validate: boolean = false;
  valid: boolean;
  constructor(
    private authService: AuthService,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: SCANNED_DOCUMENTS_COLUMNS,
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
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'hojas':
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
          this.params = this.pageFilter(this.params);
          this.getData(this.noExpe);
        }
      });
    const user: any = this.authService.decodeToken() as any;
    this.user = user.username;
    if (this.proceedings && this.valid) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData(this.proceedings));
      this.validate = this.valid;
    } else {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData(this.noExpe));
    }
    console.log(this.user, user, this.noExpe);
  }

  getData(noExp?: number | string) {
    this.loading = true;
    if (noExp) {
      this.params.getValue()['filter.noExpediente'] = `$eq:${noExp}`;
    }
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentsDictumStatetMService.getAllGetDocument(param).subscribe({
      next: resp => {
        console.log(resp.data);
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  rowsSelected(event: any) {}

  goBack() {
    this.modalRef.hide();
  }
}

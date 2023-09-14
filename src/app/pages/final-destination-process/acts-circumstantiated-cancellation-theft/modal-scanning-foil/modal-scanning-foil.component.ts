import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RELATED_FOLIO_COLUMNS } from '../acts-cir-columns';

@Component({
  selector: 'app-modal-scanning-foil',
  templateUrl: './modal-scanning-foil.component.html',
  styles: [],
})
export class ModalScanningFoilComponent<T = any>
  extends BasePage
  implements OnInit
{
  $obs: (params?: _Params, body?: any) => Observable<IListResponse<any>>;
  service: DocumentsService;
  title: string = '';
  rows: any[] = [];
  columns: any = {};
  $params = new BehaviorSubject(new FilterParams());
  body: any = {};
  showConfirmButton: boolean = false;
  selectedRow: T = null;

  // Filtrado
  data = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];

  @Input() proceedingsNumber: any;
  @Input() wheelNumber: any;
  @Output() selected = new EventEmitter<T>();
  constructor(
    private modalRef: BsModalRef,
    private goodFinderService: GoodFinderService,
    private documentsService: DocumentsService
  ) {
    super();
    this.settings = { ...this.settings, actions: false, hideSubHeader: false };
    this.settings.columns = RELATED_FOLIO_COLUMNS;
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
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'sheets':
                searchFilter = SearchFilter.EQ;
                break;
              case 'descriptionDocument':
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
          this.getData();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.data) this.getData();
      },
    });
  }

  getData() {
    this.rows = [];
    this.data.load(this.rows);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.loading = true;
    this.documentsService.getAllFilter(params).subscribe({
      next: resp => {
        console.log('resp ', resp);
        for (let i = 0; i < resp.data.length; i++) {
          let params = {
            id: resp.data[i].id,
            sheets: resp.data[i].sheets,
            descriptionDocument: resp.data[i].descriptionDocument,
          };
          this.rows.push(params);
          this.data.load(this.rows);
        }
        this.loading = false;
        console.log('resp ', resp);
        this.totalItems = resp.count;
        console.log('totalItems->', this.totalItems);
        console.log('resp -->', resp.count);
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('warning', 'Atención', 'No se encontraron registros');
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }
}

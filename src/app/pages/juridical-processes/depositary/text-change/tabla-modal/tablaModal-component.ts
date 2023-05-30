import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TEXT_CHANGE_COLUMNS } from './tablaModalColumns';

@Component({
  selector: 'app-textModal-table',
  templateUrl: './tablaModal-component.html',
})
export class tablaModalComponent extends BasePage implements OnInit {
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;
  filterParams: BehaviorSubject<FilterParams>;
  form: FormGroup = new FormGroup({});
  title: string;
  data: any[] = [];
  totalItems: number = 0;
  /********    filtros tabla   ******************/
  columns: any[] = [];
  dataLocal: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());

  /********    filtros tabla   ******************/

  @ViewChild('table') table: Ng2SmartTableComponent;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private dictationService: DictationService
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
      columns: { ...TEXT_CHANGE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.title = '  Seleccione el número de expediente ';

    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.lookDictamenesByDictamens();
    });

    this.dataLocal
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'expedientNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'statusDict':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'wheelNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'passOfficeArmy':
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
          this.getAttributesFinancialInfo();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
  }

  getAttributesFinancialInfo() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
  }

  close() {
    this.modalRef.hide();
  }

  getDataColumn(event: any) {
    this.handleSuccess(event);
    this.modalRef.hide();
  }

  lookDictamenesByDictamens() {
    this.loading = true;
    this.dictationService
      .findByIdsOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('lookDictamenesByDictamens this.data => ' + resp);
          //  this.data = resp.data;
          this.columns = resp.data;
          this.totalItems = resp.count || 0;

          this.dataLocal.load(this.columns);
          this.dataLocal.refresh();
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log('lookDictamenesByDictamens this.data => ' + err);
          this.onLoadToast('error', 'error', 'No existen registros ');
        },
      });
  }

  handleSuccess(datos: []) {
    this.modalRef.content.callback(datos);
    this.modalRef.hide();
  }
}

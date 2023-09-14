import { Component, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCPMtaCMaximumTimesForAbandonmentComponent } from './modal-c-p-mta-c-maximum-times-for-abandonment/modal-c-p-mta-c-maximum-times-for-abandonment';

@Component({
  selector: 'app-c-p-mta-c-maximum-times-for-abandonment',
  templateUrl: './c-p-mta-c-maximum-times-for-abandonment.component.html',
  styles: [],
})
export class CPMtaCMaximumTimesForAbandonmentComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems1: number = 0;
  contentData: IListResponse<IGoodType> = {} as IListResponse<IGoodType>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  data: any = [];
  columnFilters: any = [];
  dataTable: LocalDataSource = new LocalDataSource();
  dataTable1: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  selectedItem: any = null;
  constructor(
    private modalService: BsModalService,
    private goodTypeServ: GoodTypeService,
    private goodTypeServicio: GoodTypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: null,
      hideSubHeader: false,
      columns: {
        id: {
          title: 'Tipo de Bien',
          sort: false,
        },
        nameGoodType: {
          title: 'Descripción',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.dataTable
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
              case 'nameGoodType':
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
          this.getAllGoodTypes();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllGoodTypes());
  }

  openForm1(goodType?: IGoodType) {
    this.openModal({ goodType });
  }
  openModal(context?: Partial<ModalCPMtaCMaximumTimesForAbandonmentComponent>) {
    const modalRef = this.modalService.show(
      ModalCPMtaCMaximumTimesForAbandonmentComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getAllGoodTypes();
      }
    });
  }
  openForm(event?: any) {
    const data = event != null ? event.data : null;
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getAllGoodTypes());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(
      ModalCPMtaCMaximumTimesForAbandonmentComponent,
      config
    );
  }

  getAllGoodTypes() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodTypeServicio.getAll(params).subscribe({
      /*next: (resp: any) => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              nameGoodType: item.nameGoodType,
              id: item.id,
            });
            this.dataTable.load(resp.data);
            this.dataTable.refresh();
            //this.contentData = resp;
            this.totalItems = resp.count || 0;

            console.log(resp);
          });
        }
      },*/
      next: response => {
        console.log(response);
        this.dataTable.load(response.data);
        this.dataTable.refresh();
        //this.contentData = response;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.dataTable.load([]);
        this.dataTable.refresh();
        this.totalItems = 0;
      },
    });
  }

  selectRow(event: any) {
    //this.contentData = event;
    if (event) {
      console.log(event, this.contentData);
      this.getAllGoodTypesFilter(event.id);
      this.rowSelected = true;
    } else {
      this.getAllGoodTypesFilter(0);
    }
  }

  getAllGoodTypesFilter(id?: string | number) {
    this.loading = true;
    if (id) {
      this.params1.getValue()['filter.id'] = id;
    }
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters,
    };
    this.goodTypeServ.getAll(params).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              nameGoodType: item.nameGoodType,
              id: item.id,
            });
            this.dataTable1.load(resp.data);
            this.dataTable1.refresh();
            this.contentData = resp;
            this.totalItems1 = resp.count || 0;

            console.log(resp);
          });
        }
      },
      error: err => {
        this.loading = false;
        this.dataTable1.load([]);
        this.dataTable1.refresh();
        this.totalItems1 = 0;
      },
    });
  }
}

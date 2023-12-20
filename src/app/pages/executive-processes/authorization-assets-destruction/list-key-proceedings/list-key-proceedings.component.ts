import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { BasePage } from 'src/app/core/shared';
import { COLUMNSLIST } from './columns-list-key';

@Component({
  selector: 'app-list-key-proceedings',
  templateUrl: './list-key-proceedings.component.html',
  styleUrls: [],
})
export class ListKeyProceedingsComponent extends BasePage implements OnInit {
  typeProceedings: string = 'AXD';
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  proceedingSelect: any = null;
  columnFilters: any[] = [];
  completeFilters: any[] = [];

  override settings = {
    ...this.settings,
    columns: COLUMNSLIST,
    actions: false,
    hideSubHeader: false,
  };

  constructor(
    private modalRef: BsModalRef,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProceedings();
    this.navigate();
    this.columnFilterTable();
  }

  getProceedings() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;

    for (let data of this.completeFilters) {
      if (data.search != null && data.search != '') {
        paramsF.addFilter(
          data.field,
          data.search,
          data.field != 'id' ? SearchFilter.ILIKE : SearchFilter.EQ
        );
      }
    }

    paramsF.addFilter('typeProceedings', this.typeProceedings);
    this.proceedingsDetailDel.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        console.log(err);
        this.data.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  columnFilterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          this.completeFilters = filters;
          filters.map((filter: any) => {
            let searchFilter = SearchFilter.ILIKE;
            if (filter.search !== '') {
              this.columnFilters[
                filter.field
              ] = `${searchFilter}:${filter.search}`;
            }
          });
          this.getProceedings();
        }
      });
  }

  navigate() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(result => {
      console.log(result);
      this.getProceedings();
    });
  }

  selectProceeding(event: any) {
    this.proceedingSelect = event.data;
  }

  close() {
    this.modalRef.hide();
  }

  sendProceeding() {
    if (this.proceedingSelect == null) {
      this.alert('warning', 'Debe seleccionar un acta', '');
      return;
    }
    this.modalRef.content.callback(this.proceedingSelect);
    this.modalRef.hide();
  }
}

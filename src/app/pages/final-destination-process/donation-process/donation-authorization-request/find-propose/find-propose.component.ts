import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ProposelServiceService } from 'src/app/core/services/ms-proposel/proposel-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PROPOSEL_COLUMN } from '../donation-authorization-request/distribution-columns';

@Component({
  selector: 'app-find-propose',
  templateUrl: './find-propose.component.html',
  styles: [],
})
export class FindProposeComponent extends BasePage implements OnInit {
  itemsPropose: number = 0;
  dataFactPro: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  columnFilters: any = [];
  loadingProposel: boolean = false;
  @Output() onSave = new EventEmitter<any>();
  @Output() cleanForm = new EventEmitter<any>();
  selectedRow: any | null = null;
  constructor(
    private modalRef: BsModalRef,
    private proposelServiceService: ProposelServiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...PROPOSEL_COLUMN,
      },
    };
  }

  ngOnInit(): void {
    this.dataFactPro
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'ID_PROPUESTA':
                searchFilter = SearchFilter.EQ;
                break;
              case 'ID_SOLICITUD':
                searchFilter = SearchFilter.EQ;
                break;
              case 'FEC_PROPUESTA':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'CANT_SOLICITADA':
                searchFilter = SearchFilter.EQ;
                break;
              case 'CANT_PROPUESTA':
                searchFilter = SearchFilter.EQ;
                break;
              case 'CANT_DONADA':
                searchFilter = SearchFilter.EQ;
                break;
              case 'FEC_ENTREGA':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'FEC_AUTORIZA':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'PRP_ESTATUS':
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
          this.getProposel();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProposel());
  }
  getProposel() {
    this.loadingProposel = true;
    // this.params.getValue()['filter.numFile'] = this.expedienteNumber;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.proposelServiceService.getAll(params).subscribe({
      next: data => {
        this.dataFactPro.load(data.data);
        this.dataFactPro.refresh();
        this.loadingProposel = false;
        this.itemsPropose = data.count;
      },
      error: error => {
        this.loadingProposel = false;
        this.itemsPropose = 0;
      },
    });
  }
  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loadingProposel = false;
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }
  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
    } else {
      this.selectedRow = null;
    }
    console.log(this.selectedRow);
  }
}

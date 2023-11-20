import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GODD_ERROR } from '../capture-approval-donation/columns-approval-donation';

@Component({
  selector: 'app-good-error',
  templateUrl: './good-error.component.html',
  styles: [],
})
export class GoodErrorComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedRow: any | null = null;
  dataFactError: LocalDataSource = new LocalDataSource();
  columnFilterError: any = [];
  loadingError: boolean = false;
  totalItemsError: number = 0;
  @Output() onSave = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private opcion: ModalOptions,
    private donationService: DonationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...GODD_ERROR,
      },
    };
  }

  ngOnInit(): void {
    this.dataFactError
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
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'des_error':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilterError[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilterError[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getError();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getError());
  }
  return() {
    this.modalRef.hide();
  }
  getError() {
    this.loadingError = true;
    this.params.getValue()['filter.recordId'] = `$eq:${localStorage.getItem(
      'actaId'
    )}`;
    this.params.getValue()['filter.error'] = `$eq:${1}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilterError,
    };
    this.donationService.getEventComDonationDetail(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.dataFactError.load(resp.data);
        this.dataFactError.refresh();
        this.totalItemsError = resp.count ?? 0;
        localStorage.setItem('error', String(this.totalItemsError));
        this.loadingError = false;
      },
      error: err => {
        this.loadingError = false;
        this.dataFactError.load([]);
        this.dataFactError.refresh();
        this.totalItemsError = 0;
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DonationRequestService } from 'src/app/core/services/ms-donationgood/donation-requets.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNSDONATION } from './columns-requets';

@Component({
  selector: 'app-list-donation',
  templateUrl: './list-donation.component.html',
  styles: [],
})
export class ListDonationComponent extends BasePage implements OnInit {
  columns: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];

  constructor(
    private modalRef: BsModalRef,
    private donationService: DonationRequestService
  ) {
    super();
    this.settings.columns = COLUMNSDONATION;

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        delete: true,
        add: false,
      },
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
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'requestId':
                field = 'filter.requestId.id';
                searchFilter = SearchFilter.EQ;
                break;
              case 'doneeId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'donee':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'authorizeType':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'requestDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'authorizeCve':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'authorizeDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'justification':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'state':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'municipality':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'direction':
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
          this.getDonationRequest();
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDonationRequest());
  }

  close() {
    this.modalRef.hide();
  }

  setDataDonation(data: any) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }

  getDonationRequest() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.donationService.getAll(params).subscribe({
      next: resp => {
        this.columns = resp.data;
        this.totalItems = resp.count || 0;
        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
    });
  }
}

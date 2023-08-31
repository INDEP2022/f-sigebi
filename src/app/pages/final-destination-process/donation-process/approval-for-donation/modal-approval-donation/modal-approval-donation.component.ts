import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AREA_COLUMNS } from './area-columns';
import { ERROR_COLUMNS } from './error-columns';
@Component({
  selector: 'app-modal-approval-donation',
  templateUrl: './modal-approval-donation.component.html',
  styles: [],
})
export class ModalApprovalDonationComponent extends BasePage implements OnInit {
  title: string;
  subTitle: string;
  op: string;
  totalItemsModal: number = 0;
  detalleDon: IRegionalDelegation[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  @Output() onSave = new EventEmitter<any>();
  columnFilter: any = [];
  constructor(
    private readonly regionalDelegationService: RegionalDelegationService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
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
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              //this.params.value.page = 1;
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getCatalogReg(this.params.getValue());
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCatalogReg(this.params.getValue()));
  }
  getCatalogReg(params: ListParams) {
    this.regionalDelegationService.getAll(params).subscribe({
      next: (data: any) => {
        if (this.op == 'select-area') {
          this.settings.columns = AREA_COLUMNS;
          this.detalleDon = data.data;
          this.data.load(this.detalleDon);
          this.data.refresh();
          console.log(this.detalleDon);
        } else {
          if (this.op === 'see-error') {
            this.settings.columns = ERROR_COLUMNS;
            this.detalleDon = data.data;
            this.data.load(this.detalleDon);
            this.data.refresh();
            console.log(this.detalleDon);
          }
        }
      },
      error: () => {
        console.log(console.log('error'));
      },
    });
  }
  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.onSave.emit(this.detalleDon);
    console.log(this.detalleDon);
    this.modalRef.hide();
  }
}

// const EXAMPLE_DATA1 = [
//   {
//     id: 1,
//     description: 'REGIONAL TIJUANA',
//   },
//   {
//     id: 2,
//     description: 'REGIONAL HERMOSILLO',
//   },
// ];

// const EXAMPLE_DATA2 = [
//   {
//     goodsNumb: 454587,
//     goodsDescrip: 'NO CUENTA CON UN ALMACÉN',
//   },
//   {
//     goodsNumb: 121454,
//     goodsDescrip: 'NO CUENTA CON UN ALMACÉN',
//   },
// ];

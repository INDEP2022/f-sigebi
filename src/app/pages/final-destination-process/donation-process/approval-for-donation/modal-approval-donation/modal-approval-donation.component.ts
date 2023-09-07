import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS } from './area-columns';

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
  selectedGooods: any[] = [];
  selectedRow: any | null = null;
  activeGood: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataGoodTable: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  provider: any;
  @Output() onSave = new EventEmitter<any>();
  totalItems2: number = 0;
  constructor(
    private goodService: GoodService,
    private modalRef: BsModalRef,
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: {
        ...GOODS,
      },
    };
  }

  ngOnInit(): void {
    this.dataGoodTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              proposalKey: () => (searchFilter = SearchFilter.ILIKE),
              goodNumber: () => (searchFilter = SearchFilter.ILIKE),
              id: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.EQ),
              quantity: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getTempDona();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTempDona());
  }

  getTempDona() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    // params['sortBy'] = `goodNumber:DESC`;
    this.donationService.getTempGood(params).subscribe({
      next: data => {
        console.log(data.data);
        this.totalItems2 = data.count;
        this.dataGoodTable.load(data.data);
        this.dataGoodTable.refresh();
      },
      error: () => console.log('no hay bienes'),
    });
  }

  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedGooods);
    this.modalRef.hide();
  }
  // onUserRowSelect(row: any): void {
  //   if (row.isSelected) {
  //     this.selectedRow = row.data;
  //   } else {
  //     this.selectedRow = null;
  //   }

  //   console.log(this.selectedRow);
  // }

  onUserRowSelect(event: { data: any; selected: any }) {
    this.selectedRow = event.data;
    this.activeGood = true;
    // this.fileNumber = event.data.fileNumber;
    this.selectedGooods = event.selected;
    console.log(this.selectedRow);
    console.log(this.selectedGooods);
    this.changeDetectorRef.detectChanges();
  }
}

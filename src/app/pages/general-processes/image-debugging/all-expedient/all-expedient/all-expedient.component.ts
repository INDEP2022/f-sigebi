import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared';
import { EXPEDIENT_COLUMNS } from '../../image-debugging/image-debugging-columns';
@Component({
  selector: 'app-all-expedient',
  templateUrl: './all-expedient.component.html',
  styles: [],
})
export class AllExpedientComponent extends BasePage implements OnInit {
  dataFactEx: LocalDataSource = new LocalDataSource();
  @Output() onSave = new EventEmitter<any>();
  totalItems2 = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  expedients: IExpedient[] = [];
  selectedRow: any | null = null;
  constructor(
    private expedientService: ExpedientService,
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: EXPEDIENT_COLUMNS,
      edit: {
        editButtonContent: '<i  class="fa fa-eye text-info mx-2" > Ver</i>',
      },
    };
  }

  ngOnInit(): void {
    this.dataFactEx
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'preliminaryInquiry' ||
            filter.field == 'criminalCase' ||
            filter.field == 'expedientType' ||
            filter.field == 'stateCode' ||
            filter.field == 'expedientStatus' ||
            filter.field == 'stationNumber' ||
            filter.field == ' authorityNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAllExpedient();
        }
      });
  }

  getAllExpedient() {
    this.expedientService.getAll().subscribe({
      next: (data: any) => {
        console.log(data);
        this.expedients = data.data;
        this.totalItems2 = data.count;
        this.dataFactEx.load(data.data);
        this.dataFactEx.refresh();
      },
      error: () => {
        console.error('no hay data');
      },
    });
  }
  handleSuccess(): void {
    this.loading = true;
    this.loading = false;
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }
  return() {
    this.modalService.hide();
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

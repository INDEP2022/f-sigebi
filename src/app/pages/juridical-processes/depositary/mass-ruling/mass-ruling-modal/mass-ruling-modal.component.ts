import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { BasePage } from 'src/app/core/shared';
import { DETAIL_COLUMNS } from './columns';

@Component({
  selector: 'app-mass-ruling-modal',
  templateUrl: './mass-ruling-modal.component.html',
  styleUrls: [],
})
export class MassRulingModalComponent extends BasePage implements OnInit {
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  validate: boolean = false;
  constructor(
    private copiesOfficialOpinionService: CopiesOfficialOpinionService,
    private modalRef: BsModalRef,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...DETAIL_COLUMNS },
    };
  }

  ngOnInit() {
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
              case 'clasifGoodNumber':
                searchFilter = SearchFilter.EQ;
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
          this.getDictamination();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDictamination());
  }

  getDictamination() {
    this.loading = true;
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.copiesOfficialOpinionService.getAllDictation(param).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  rowsSelected(event: any) {
    this.validate = true;
    console.log(event);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {}
}

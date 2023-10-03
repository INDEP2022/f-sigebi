import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { offlinePagination } from 'src/app/utils/functions/offline-pagination';
import { AppraisalRegistrationChild } from '../../classes/appraisal-registration-child';

@Component({
  selector: 'appraised-rejecteds-goods-list',
  templateUrl: './appraised-rejecteds-goods-list.component.html',
  styles: [],
})
export class AppraisedRejectedsGoodsListComponent
  extends AppraisalRegistrationChild
  implements OnInit
{
  data: any[] = [];
  paginatedData: any[] = [];
  totalItems = 0;
  params = new BehaviorSubject(new FilterParams());
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        NO_BIEN: {
          title: 'No. Bien',
          sort: false,
        },
        CAUSA: {
          title: 'CAUSA',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    const isDisccount = this.$rejectedDisscount.getValue();
    isDisccount
      ? this.appraisalsD().subscribe()
      : this.appraisals().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          this.paginatedData = offlinePagination(
            this.data,
            params.limit,
            params.page
          );
        })
      )
      .subscribe();
  }

  appraisals() {
    return this.$appraisedRejectedGoodsList.pipe(
      takeUntil(this.$unSubscribe),
      tap(appraisal => {
        this.params.next(new FilterParams());
        this.data = appraisal;
        this.totalItems = this.data.length;
      })
    );
  }

  appraisalsD() {
    return this.$appraisedRejectedGoodsDList.pipe(
      takeUntil(this.$unSubscribe),
      tap(appraisal => {
        this.params.next(new FilterParams());
        this.data = appraisal;
        this.totalItems = this.data.length;
      })
    );
  }
}

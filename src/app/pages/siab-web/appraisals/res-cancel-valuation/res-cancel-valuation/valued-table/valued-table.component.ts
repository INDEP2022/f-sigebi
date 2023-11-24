import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { AppraisalsDataService } from '../../../appraisals-data.service';
import { SendObtainGoodValued } from '../res-cancel-valuation-class/class-service';

@Component({
  selector: 'app-valued-table',
  templateUrl: './valued-table.component.html',
  styleUrls: ['./valued-table.component.css'],
})
export class ValuedTableComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  private _body: SendObtainGoodValued;
  @Input() get body() {
    return this._body;
  }
  set body(value) {
    this._body = value;
    this.getData();
  }

  private _settings: any;
  @Input() get settings1() {
    return this._settings;
  }
  set settings1(value) {
    this._settings = value;
    this.dataPaginated.refresh();
  }

  constructor(
    private serviceAppraise: AppraiseService,
    private dataService: AppraisalsDataService
  ) {
    super();
  }

  onUserRowSelect(event: any) {
    this.dataService.selectedRowsValueds = event.selected;
  }

  override getData() {
    if (!this.body) {
      this.notGetData();
      return;
    }
    let params = this.getParams();
    this.loading = true;
    this.serviceAppraise
      .postGetAppraise(this.body, { ...params, limit: 100000000 })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            this.data = response.data.map((row: any) => {
              return { ...row };
            });
            this.dataService.cancelsData = this.data;
            this.setTotals(this.data);
            this.totalItems = this.data.length;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notGetData();
          }
        },
        error: error => {
          if (error.status == 400) {
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para realizar el oficio de respuesta'
            );
          }
          this.notGetData();
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { IIndicatorReport } from 'src/app/core/models/catalogs/indicator-report.model';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';
import { IndicatorReportService } from '../../../../core/services/catalogs/indicator-report.service';
import { IndicatorReportFormComponent } from '../indicator-report-form/indicator-report-form.component';
import { INDICATOR_REPORT_COLUMNS } from './indicator-report-columns';

@Component({
  selector: 'app-indicator-report-list',
  templateUrl: './indicator-report-list.component.html',
  styles: [],
})
export class IndicatorReportListComponent extends BasePage implements OnInit {
  indicatorReports: IIndicatorReport[] = [];
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  constructor(
    private indicatorReportService: IndicatorReportService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = INDICATOR_REPORT_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
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
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'startingPercentageRange' ||
            filter.field == 'finalPercentageRange' ||
            filter.field == 'contractualPenalty' ||
            filter.field == 'status' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.indicatorReportService.getAll(params).subscribe({
      next: response => {
        this.indicatorReports = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(indicatorReport?: IIndicatorReport) {
    let config: ModalOptions = {
      initialState: {
        indicatorReport,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(IndicatorReportFormComponent, config);
  }

  delete(indicatorReport?: IIndicatorReport) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.indicatorReportService.remove(indicatorReport.id).subscribe({
          next: response => {
            this.onLoadToast('success', 'Exito', 'Eliminado Correctamente');
            this.getExample();
          },
          error: err => {
            this.onLoadToast('error', 'Error', 'Intente nuevamente');
          },
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { IIndicatorReport } from 'src/app/core/models/catalogs/indicator-report.model';
import { BasePage } from 'src/app/core/shared/base-page';

import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { IndicatorReportService } from '../../../../core/services/catalogs/indicator-report.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IndicatedFormComponent } from '../../indicated/indicated-form/indicated-form.component';
import { INDICATOR_REPORT_COLUMNS } from './indicator-report-columns';
import { IndicatorReportFormComponent } from '../indicator-report-form/indicator-report-form.component';

@Component({
  selector: 'app-indicator-report-list',
  templateUrl: './indicator-report-list.component.html',
  styles: [],
})
export class IndicatorReportListComponent extends BasePage implements OnInit {

  
  indicatorReports: IIndicatorReport[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private indicatorReportService: IndicatorReportService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = INDICATOR_REPORT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.indicatorReportService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.indicatorReports = response.data;
        this.totalItems = response.count;
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
        //this.indicatorReportService.remove(indicatorReport.id);
      }
    });
  }
}

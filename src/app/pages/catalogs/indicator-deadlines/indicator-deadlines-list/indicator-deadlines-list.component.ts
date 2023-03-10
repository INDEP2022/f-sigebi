import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIndicatorDeadline } from 'src/app/core/models/catalogs/indicator-deadline.model';
import { IndicatorDeadlineService } from 'src/app/core/services/catalogs/indicator-deadline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IndicatorDeadlinesFormComponent } from '../indicator-deadlines-form/indicator-deadlines-form.component';
import { INDICATORS_DEADLINES_COLUMNS } from './indicator-deadlines-columns';

@Component({
  selector: 'app-indicator-deadlines-list',
  templateUrl: './indicator-deadlines-list.component.html',
  styles: [],
})
export class IndicatorDeadlinesListComponent
  extends BasePage
  implements OnInit
{
  columns: IIndicatorDeadline[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private modalService: BsModalService,
    private indicatorDeadlineService: IndicatorDeadlineService
  ) {
    super();
    this.settings.columns = INDICATORS_DEADLINES_COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.indicatorDeadlineService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<IndicatorDeadlinesFormComponent>) {
    const modalRef = this.modalService.show(IndicatorDeadlinesFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getExample());
      }
    });
  }

  openForm(indicatorsDeadlines?: IIndicatorDeadline) {
    this.openModal({ indicatorsDeadlines });
  }
}

import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIndicatorDeadline } from 'src/app/core/models/catalogs/indicator-deadline.model';
import { IndicatorDeadlineService } from 'src/app/core/services/catalogs/indicator-deadline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IndicatorFormComponent } from '../indicator-form/indicator-form.component';
import { INDICATOR_DEADLINE_COLUMNS } from './indicator-deadlines-columns';

@Component({
  selector: 'app-indicator-deadlines-list',
  templateUrl: './indicator-deadlines-list.component.html',
  styles: [],
})
export class IndicatorDeadlinesListComponent
  extends BasePage
  implements OnInit
{
  data: IIndicatorDeadline[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private service: IndicatorDeadlineService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = INDICATOR_DEADLINE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    this.service.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.data = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(value?: IIndicatorDeadline) {
    let config: ModalOptions = {
      initialState: {
        value,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(IndicatorFormComponent, config);
  }

  delete(indicator?: IIndicatorDeadline) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.service.remove(indicator.id).subscribe({
          next: response => {
            this.onLoadToast('success', 'Exito', 'Eliminado Correctamente');
            this.getData();
          },
          error: err => {
            this.onLoadToast('error', 'Error', 'Intente nuevamente');
          },
        });
      }
    });
  }
}

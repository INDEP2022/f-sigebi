import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IMaximumTimes } from 'src/app/core/models/catalogs/maximum-times-model';
import { MaximumTimesService } from 'src/app/core/services/catalogs/maximum-times.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaximumTimesModalComponent } from '../maximum-times-modal/maximum-times-modal.component';
import { MAXIMUM_TIMES_COLUMNS } from './maximum-times-columns';

@Component({
  selector: 'app-maximum-times',
  templateUrl: './maximum-times.component.html',
  styles: [],
})
export class MaximumTimesComponent extends BasePage implements OnInit {
  maximumTimesForm: FormGroup;
  maximumTimes: IMaximumTimes[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private maximumTimesService: MaximumTimesService
  ) {
    super();
    this.settings.columns = MAXIMUM_TIMES_COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMaximumTimeAll());
  }

  getMaximumTimeAll() {
    this.loading = true;
    this.maximumTimesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.maximumTimes = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(maximumTimes?: IMaximumTimes) {
    console.log(maximumTimes);
    let config: ModalOptions = {
      initialState: {
        maximumTimes,
        callback: (next: boolean) => {
          if (next) this.getMaximumTimeAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaximumTimesModalComponent, config);
  }
}

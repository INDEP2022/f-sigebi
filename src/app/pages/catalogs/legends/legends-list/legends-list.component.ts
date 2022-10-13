import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { LegendService } from 'src/app/core/services/catalogs/legend.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LegendFormComponent } from '../legend-form/legend-form.component';
import { LEGENDS_COLUMS } from './legends-columns';

@Component({
  selector: 'app-legends-list',
  templateUrl: './legends-list.component.html',
  styles: [],
})
export class LegendsListComponent extends BasePage implements OnInit {
  
  legends: ILegend[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private legendService: LegendService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LEGENDS_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    this.legendService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.legends = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(legend?: ILegend) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      legend,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(LegendFormComponent, modalConfig);
  }

  showDeleteAlert(legend: ILegend) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(legend.id);
      }
    });
  }

  delete(id: number) {
    this.legendService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}

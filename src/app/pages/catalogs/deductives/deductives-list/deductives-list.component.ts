import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { DeductiveService } from 'src/app/core/services/catalogs/deductive.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';
import { DeductiveFormComponent } from '../deductive-form/deductive-form.component';
import { DEDUCTIVE_COLUMNS } from './deductive-columns';

@Component({
  selector: 'app-deductives-list',
  templateUrl: './deductives-list.component.html',
  styles: [],
})
export class DeductivesListComponent extends BasePage implements OnInit {
  
  deductives: IDeductive[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private deductiveService: DeductiveService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DEDUCTIVE_COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    this.deductiveService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.deductives = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(deductive?: IDeductive) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      deductive,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(DeductiveFormComponent, modalConfig);
  }

  showDeleteAlert(deductive: IDeductive) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(deductive.id);
      }
    });
  }

  delete(id: number) {
    this.deductiveService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}

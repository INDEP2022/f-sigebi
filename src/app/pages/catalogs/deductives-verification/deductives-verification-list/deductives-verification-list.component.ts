import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DeductivesVerificationFormComponent } from '../deductives-verification-form/deductives-verification-form.component';
import { DEDUCTIVE_VERIFICATION_COLUMNS } from './deductives-verification-columns';

@Component({
  selector: 'app-create-deductives-verification-list',
  templateUrl: './deductives-verification-list.component.html',
  styles: [],
})
export class DeductivesVerificationListComponent
  extends BasePage
  implements OnInit
{
  deductives: IDeductiveVerification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private deductiveVerificationService: DeductiveVerificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DEDUCTIVE_VERIFICATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductivesVerification());
  }

  getDeductivesVerification() {
    this.loading = true;
    this.deductiveVerificationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.deductives = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(deductive?: IDeductiveVerification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      deductive,
      callback: (next: boolean) => {
        if (next) this.getDeductivesVerification();
      },
    };
    this.modalService.show(DeductivesVerificationFormComponent, modalConfig);
  }

  showDeleteAlert(deductive: IDeductiveVerification) {
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
    this.deductiveVerificationService.remove(id).subscribe({
      next: () => this.getDeductivesVerification(),
    });
  }
}

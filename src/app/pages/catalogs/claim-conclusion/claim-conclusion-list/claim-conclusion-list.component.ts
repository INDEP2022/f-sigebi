import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IClaimConclusion } from 'src/app/core/models/catalogs/claim-conclusion.model';
import { ClaimConclusionService } from 'src/app/core/services/catalogs/claim-conclusion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ClaimConclusionFormComponent } from '../claim-conclusion-form/claim-conclusion-form.component';
import { CLAIMCONCLUSION_COLUMS } from './claim-conclusion-columns';

@Component({
  selector: 'app-claim-conclusion-list',
  templateUrl: './claim-conclusion-list.component.html',
  styles: [],
})
export class ClaimConclusionListComponent extends BasePage implements OnInit {
  paragraphs: IClaimConclusion[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private claimConclusionService: ClaimConclusionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CLAIMCONCLUSION_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.claimConclusionService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(claimConclusion?: IClaimConclusion) {
    let config: ModalOptions = {
      initialState: {
        claimConclusion,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClaimConclusionFormComponent, config);
  }

  delete(claimConclusion: IClaimConclusion) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}

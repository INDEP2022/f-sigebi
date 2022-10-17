import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILegalSupport } from 'src/app/core/models/catalogs/legal-suport.model';
import { LegalSupportService } from 'src/app/core/services/catalogs/legal-suport.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LegalSupportFormComponent } from '../legal-support-form/legal-support-form.component';
import { LEGAL_SUPPORT_COLUMS } from './legal-support-columns';

@Component({
  selector: 'app-legal-support-list',
  templateUrl: './legal-support-list.component.html',
  styles: [],
})
export class LegalSupportListComponent extends BasePage implements OnInit {
  paragraphs: ILegalSupport[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private legalSupportService: LegalSupportService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LEGAL_SUPPORT_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.legalSupportService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(legalSupport?: ILegalSupport) {
    let config: ModalOptions = {
      initialState: {
        legalSupport,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LegalSupportFormComponent, config);
  }

  delete(legalSupport: ILegalSupport) {
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

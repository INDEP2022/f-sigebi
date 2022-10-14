import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IThirdPartyCompany } from 'src/app/core/models/catalogs/third-party-company.model';
import { ThirdPartyService } from 'src/app/core/services/catalogs/third-party-company.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ThirdPartyCompanyFormComponent } from '../third-party-company-form/third-party-company-form.component';
import { THIRDPARTYCOMPANY_COLUMS } from './third-party-company-columns';

@Component({
  selector: 'app-third-party-company-list',
  templateUrl: './third-party-company-list.component.html',
  styles: [],
})
export class ThirdPartyCompanyListComponent extends BasePage implements OnInit {
  paragraphs: IThirdPartyCompany[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private thirdPartyService: ThirdPartyService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = THIRDPARTYCOMPANY_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.thirdPartyService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(thirdPartyCompany?: IThirdPartyCompany) {
    let config: ModalOptions = {
      initialState: {
        thirdPartyCompany,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ThirdPartyCompanyFormComponent, config);
  }

  delete(thirdPartyCompany: IThirdPartyCompany) {
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

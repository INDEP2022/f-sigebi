import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDetailDelegation } from 'src/app/core/models/catalogs/detail-delegation.model';
import { DetailDelegationService } from 'src/app/core/services/catalogs/detail-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailDelegationFormComponent } from '../detail-delegation-form/detail-delegation-form.component';
import { DETAIL_DELEGATION_COLUMNS } from './detail-delegation-columns';

@Component({
  selector: 'app-detail-delegation-list',
  templateUrl: './detail-delegation-list.component.html',
  styles: [],
})
export class DetailDelegationListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  detailDelegations: IDetailDelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private detailDelegationService: DetailDelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DETAIL_DELEGATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    this.detailDelegationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.detailDelegations = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(detailDelegation?: IDetailDelegation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      detailDelegation,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(DetailDelegationFormComponent, modalConfig);
  }

  showDeleteAlert(detailDelegation: IDetailDelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(detailDelegation.id);
      }
    });
  }

  delete(id: number) {
    this.detailDelegationService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}

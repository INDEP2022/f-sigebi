import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegionalDelegationFormComponent } from '../regional-delegation-form/regional-delegation-form.component';
import { REGIONAL_DELEGATIONS_COLUMNS } from './regional-delegations-columns';

@Component({
  selector: 'app-regional-delegations-list',
  templateUrl: './regional-delegations-list.component.html',
  styles: [],
})
export class RegionalDelegationsListComponent
  extends BasePage
  implements OnInit
{
  settings = TABLE_SETTINGS;
  regionalDelegations: IRegionalDelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private regionalDelegationService: RegionalDelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = REGIONAL_DELEGATIONS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getReginalDelegations());
  }

  getReginalDelegations() {
    this.loading = true;
    this.regionalDelegationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.regionalDelegations = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(reginalDelegation?: IRegionalDelegation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      reginalDelegation,
      callback: (next: boolean) => {
        if (next) this.getReginalDelegations();
      },
    };
    this.modalService.show(RegionalDelegationFormComponent, modalConfig);
  }

  delete(reginalDelegation: IRegionalDelegation) {
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

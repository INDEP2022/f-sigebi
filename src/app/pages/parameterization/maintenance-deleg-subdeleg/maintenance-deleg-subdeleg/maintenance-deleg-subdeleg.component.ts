import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceDelegSubdelegModalComponent } from '../maintenance-deleg-subdeleg-modal/maintenance-deleg-subdeleg-modal.component';
import {
  DELEGATION_COLUMNS,
  SUBDELEGATION_COLUMNS,
} from './maintenance-deleg-sub-columns';
//models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//services
import { DelegationService } from 'src/app/core/services/maintenance-delegations/delegation.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';

@Component({
  selector: 'app-maintenance-deleg-subdeleg',
  templateUrl: './maintenance-deleg-subdeleg.component.html',
  styles: [],
})
export class MaintenanceDelegSubdelegComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  delegationList: IDelegation[] = [];
  subDelegationList: ISubdelegation[] = [];
  delegations: IDelegation;

  settings2;

  constructor(
    private modalService: BsModalService,
    private delegationService: DelegationService,
    private subDelegationService: SubDelegationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DELEGATION_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...SUBDELEGATION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDelegationAll());
  }

  getDelegationAll() {
    this.loading = true;

    this.delegationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.delegationList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.subDelegationList = [];
    this.delegations = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSubDelegations(this.delegations));
  }

  getSubDelegations(delegation: IDelegation) {
    this.loading = true;
    this.subDelegationService
      .getById(delegation.id, this.params2.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.subDelegationList = response.data;
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  openForm(subDelegation?: ISubdelegation) {
    console.log(subDelegation);
    let delegation = this.delegations;
    let config: ModalOptions = {
      initialState: {
        subDelegation,
        delegation,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceDelegSubdelegModalComponent, config);
  }
}

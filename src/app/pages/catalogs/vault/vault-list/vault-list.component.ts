import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ISafe } from '../../../../core/models/catalogs/safe.model';
import { SafeService } from '../../../../core/services/catalogs/safe.service';
import { VAULT_COLUMNS } from './vault-columns';
import { VaultDetailComponent } from '../vault-detail/vault-detail.component';

@Component({
  selector: 'app-vault-list',
  templateUrl: './vault-list.component.html',
  styles: [],
})
export class VaultListComponent extends BasePage implements OnInit {
  vaults: ISafe[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private safeService: SafeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = VAULT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getVaults());
  }

  getVaults() {
    this.loading = true;
    this.safeService.getAll(this.params.getValue()).subscribe(
      response => {
        this.vaults = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<VaultDetailComponent>) {
    const modalRef = this.modalService.show(VaultDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getVaults();
    });
  }

  edit(vault: ISafe) {
    this.openModal({ edit: true, vault });
  }

  delete(vault: ISafe) {
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

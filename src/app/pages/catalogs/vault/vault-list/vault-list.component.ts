import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ISafe } from '../../../../core/models/catalogs/safe.model';
import { SafeService } from '../../../../core/services/catalogs/safe.service';
import { VaultDetailComponent } from '../vault-detail/vault-detail.component';
import { VAULT_COLUMNS } from './vault-columns';

@Component({
  selector: 'app-vault-list',
  templateUrl: './vault-list.component.html',
  styles: [],
})
export class VaultListComponent extends BasePage implements OnInit {
  vaults: ISafe[] = [];
  values: ISafe;
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
    this.safeService.getAll2(this.params.getValue()).subscribe(
      response => {
        this.vaults = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openForm(vault?: ISafe) {
    const modalConfig = MODAL_CONFIG;
    const valueState = { ...this.values };
    const valueCity = { ...this.values };
    const valueMunicipality = { ...this.values };
    const valueLocality = { ...this.values };
    modalConfig.initialState = {
      vault,
      valueCity,
      valueState,
      valueMunicipality,
      valueLocality,
      callback: (next: boolean) => {
        if (next) this.getVaults();
      },
    };
    this.modalService.show(VaultDetailComponent, modalConfig);
  }

  showDeleteAlert(vaults: ISafe) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(vaults.idSafe);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.safeService.remove2(id).subscribe({
      next: () => this.getVaults(),
    });
  }
}

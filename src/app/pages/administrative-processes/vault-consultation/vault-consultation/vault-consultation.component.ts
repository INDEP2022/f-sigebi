import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';
import { COUNT_SAFE_COLUMNS } from './vault-consultation-column';
@Component({
  selector: 'app-vault-consultation',
  templateUrl: './vault-consultation.component.html',
  styles: [],
})
export class VaultConsultationComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  form: FormGroup;
  vaults: ISafe[] = [];
  @Output() idSafe: EventEmitter<number> = new EventEmitter<number>();
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private safeService: SafeService
  ) {
    super();
    this.ilikeFilters = ['user'];
    // this.ilikeFilters = ['user'];
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
    this.service = this.safeService;
    this.settings = {
      ...this.settings,
      actions: {
        // columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COUNT_SAFE_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  openForm(provider?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(ModalListGoodsComponent, modalConfig);
  }

  openModal(context?: Partial<ModalListGoodsComponent>) {
    const modalRef = this.modalService.show(ModalListGoodsComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  search() {
    this.safeService.getAll(this.params.getValue()).subscribe({
      next: (data: any) => {
        this.totalItems = data.count;
        this.vaults = data.data;
        this.loading = false;
        console.log(this.vaults);
      },
    });
  }
  select(event: any) {
    console.log(event.data.idSafe);
    event.data
      ? this.openModal(event.data.idSafe)
      : this.alert('info', 'Ooop...', 'Esta Bóveda no contiene Bines');
  }
}

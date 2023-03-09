import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TransferorsDetailComponent } from '../transferors-detail/transferors-detail.component';
import { TRANSFERENT_STATE_COLUMNS } from './columns';

@Component({
  selector: 'app-transferors-list',
  templateUrl: './transferors-list.component.html',
  styles: [],
})
export class TransferorsListComponent extends BasePage implements OnInit {
  transferorsStateList: ITransferente[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private transferenteService: TransferenteService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...TRANSFERENT_STATE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTransferents());
  }

  getTransferents() {
    this.loading = true;
    this.transferenteService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.transferorsStateList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(transferent?: ITransferente) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      transferent,
      callback: (next: boolean) => {
        if (next) this.getTransferents();
      },
    };
    this.modalService.show(TransferorsDetailComponent, modalConfig);
  }
}

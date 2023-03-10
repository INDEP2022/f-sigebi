import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITransferenteSae } from 'src/app/core/models/catalogs/transferente.model';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TransferorsDetailComponent } from '../transferors-detail/transferors-detail.component';
import { TRANSFERENT_STATE_COLUMNS } from './columns';

@Component({
  selector: 'app-transferors-list',
  templateUrl: './transferors-list.component.html',
  styles: [],
})
export class TransferorsListComponent extends BasePage implements OnInit {
  transferorsStateList: ITransferenteSae[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private transferenteSaeService: TransferentesSaeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },*/
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
    this.transferenteSaeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.transferorsStateList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(transferorsState?: ITransferenteSae) {
    let config: ModalOptions = {
      initialState: {
        transferorsState,
        callback: (next: boolean) => {
          if (next) this.getTransferents();
          console.log('cerrando');
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TransferorsDetailComponent, config);
  }
}

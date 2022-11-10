import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { CBmVmCCpPageSetupModalComponent } from '../c-bm-vm-c-cp-page-setup-modal/c-bm-vm-c-cp-page-setup-modal.component';
import { PAGE_SETUP_COLUMNS } from './page-setup-columns';

@Component({
  selector: 'app-c-bm-vm-c-cp-page-setup',
  templateUrl: './c-bm-vm-c-cp-page-setup.component.html',
  styles: [],
})
export class CBmVmCCpPageSetupComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      selectMode: 'multi',
      columns: { ...PAGE_SETUP_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      table: 'Comer_soladjinsgob',
      column: 'ID_tipoentgob',
      ak: 'sol',
      orderColumns: 1,
      ak2: 'Cve. Tpo Entidad',
    },
    {
      table: 'Comer_soladjinsgob',
      column: 'Estado',
      ak: 'sol',
      orderColumns: 3,
      ak2: 'Estado',
    },
    {
      table: 'Comer_soladjinsgob',
      column: 'descripcion',
      ak: 'det',
      orderColumns: 11,
      ak2: 'Descripción Bien',
    },
    {
      table: 'Comer_soladjinsgob',
      column: 'Delegación',
      ak: 'det',
      orderColumns: 12,
      ak2: 'Delegación',
    },
    {
      table: 'Comer_soladjinsgob',
      column: 'Ubicación',
      ak: 'det',
      orderColumns: 13,
      ak2: 'Ubicación',
    },
    {
      table: 'Comer_soladjinsgob',
      column: 'Valor_Avaluo',
      ak: 'det',
      orderColumns: 14,
      ak2: 'Valor Avaluo',
    },
  ];

  openForm(pageSetup?: any) {
    this.openModal({ pageSetup });
  }

  openModal(context?: Partial<CBmVmCCpPageSetupModalComponent>) {
    const modalRef = this.modalService.show(CBmVmCCpPageSetupModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RebillingCausesModalComponent } from '../rebilling-causes-modal/rebilling-causes-modal.component';
import { REBILLING_CAUSES_COLUMNS } from './rebilling-causes-columns';

@Component({
  selector: 'app-rebilling-causes',
  templateUrl: './rebilling-causes.component.html',
  styles: [],
})
export class RebillingCausesComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  filter = new BehaviorSubject<FilterParams>(new FilterParams());
  data: any[] = [];

  constructor(
    private modalService: BsModalService,
    private comerRebilService: ParameterInvoiceService
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
      columns: { ...REBILLING_CAUSES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filter.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getData(),
    });
  }

  //Rellenar formulario con datos de la tabla
  openForm(allotment?: any) {
    this.openModal(allotment);
  }

  openModal(context?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RebillingCausesModalComponent, config);
  }

  getData() {
    this.loading = true;
    this.comerRebilService
      .getAll(this.filter.getValue().getParams())
      .subscribe({
        next: resp => {
          this.data = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        },
        error: err => {
          this.data = [];
          this.totalItems = 0;
          this.loading = false;
          this.alert('error', 'Error', err.error.message);
        },
      });
  }
}

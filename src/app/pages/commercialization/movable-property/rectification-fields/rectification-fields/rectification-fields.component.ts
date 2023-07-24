import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { RectifitationFieldsService } from 'src/app/core/services/ms-parameterinvoice/rectification-fields.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RectificationFieldsModalComponent } from '../rectification-fileds-modal/rectification-fields-modal.component';
import { RECTIFICATION_FIELDS_COLUMNS } from './rectification-fields-columns';

@Component({
  selector: 'app-rectification-fields',
  templateUrl: './rectification-fields.component.html',
  styles: [],
})
export class RectificationFieldsComponent extends BasePage implements OnInit {
  data: {
    columnId: string;
    invoiceFieldId: string;
    table: string;
  }[] = [];
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;

  constructor(
    private rectificationFieldService: RectifitationFieldsService,
    private modalService: BsModalService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...RECTIFICATION_FIELDS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getData(),
    });
  }

  getData() {
    this.loading = true;
    this.rectificationFieldService
      .getAll(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          resp.data.map((fact: any) => {
            fact.tabla = fact.table;
          });
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

  openForm(allotment?: any) {
    this.openModal(allotment);
  }

  openModal(context?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        callback: (next: boolean) => {
          if (next) {
            this.getData();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RectificationFieldsModalComponent, config);
  }
}

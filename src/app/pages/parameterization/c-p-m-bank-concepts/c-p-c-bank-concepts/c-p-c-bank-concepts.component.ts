import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCBankConceptsModalComponent } from '../c-p-c-bank-concepts-modal/c-p-c-bank-concepts-modal.component';
import { BANK_CONCEPTS_COLUMNS } from './bank-concepts-columns';

@Component({
  selector: 'app-c-p-c-bank-concepts',
  templateUrl: './c-p-c-bank-concepts.component.html',
  styles: [],
})
export class CPCBankConceptsComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

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
      columns: { ...BANK_CONCEPTS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<CPCBankConceptsModalComponent>) {
    const modalRef = this.modalService.show(CPCBankConceptsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      concept: 'TRASPASO',
      description: 'TRASPASO COBRO DE COCHE',
    },
    {
      concept: 'RENTA',
      description: 'PRODUCTO DE LA RENTA DE UN INMUEBLE',
    },
  ];
}

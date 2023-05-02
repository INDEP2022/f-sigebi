import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { BankConceptsModalComponent } from '../bank-concepts-modal/bank-concepts-modal.component';
import { BANK_CONCEPTS_COLUMNS } from './bank-concepts-columns';
//models
import { IBankConcepts } from 'src/app/core/models/catalogs/bank-concepts-model';
//services
import { BankConceptsService } from 'src/app/core/services/catalogs/bank-concepts-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank-concepts',
  templateUrl: './bank-concepts.component.html',
  styles: [],
})
export class BankConceptsComponent extends BasePage implements OnInit {
  bankConcepts: IBankConcepts[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private bankConceptsService: BankConceptsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...BANK_CONCEPTS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBankConcepts());
  }

  getBankConcepts() {
    this.loading = true;
    this.bankConceptsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.bankConcepts = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(bankConcepts?: IBankConcepts) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      bankConcepts,
      callback: (next: boolean) => {
        if (next) this.getBankConcepts();
      },
    };
    this.modalService.show(BankConceptsModalComponent, modalConfig);
  }

  showDeleteAlert(bankConcepts: IBankConcepts) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(bankConcepts.key);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.bankConceptsService.remove(id).subscribe({
      next: () => this.getBankConcepts(),
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IBank } from '../../../../core/models/catalogs/bank.model';
import { BankService } from '../../../../core/services/catalogs/bank.service';
import { BanksDetailComponent } from '../banks-detail/banks-detail.component';
import { BANKS_COLUMNS } from './banks-columns';

@Component({
  selector: 'app-banks-list',
  templateUrl: './banks-list.component.html',
  styles: [],
})
export class BanksListComponent extends BasePage implements OnInit {
  bank: IBank[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private bankService: BankService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...BANKS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBanks());
  }

  getBanks() {
    this.loading = true;
    this.bankService.getAll(this.params.getValue()).subscribe(
      response => {
        this.bank = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<BanksDetailComponent>) {
    const modalRef = this.modalService.show(BanksDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getBanks();
    });
  }

  edit(bank: IBank) {
    this.openModal({ edit: true, bank });
  }

  showDeleteAlert(bank: IBank) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(bank.bankCode);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.bankService.remove(id).subscribe({
      next: () => this.getBanks(),
    });
  }
}

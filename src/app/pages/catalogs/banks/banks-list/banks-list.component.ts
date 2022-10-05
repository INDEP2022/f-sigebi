import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBank } from '../../../../core/models/catalogs/bank.model';
import { BankService } from '../../../../core/services/catalogs/bank.service';
import { BANKS_COLUMNS } from './banks-columns';
import { BanksDetailComponent } from '../banks-detail/banks-detail.component';

@Component({
  selector: 'app-banks-list',
  templateUrl: './banks-list.component.html',
  styles: [],
})
export class BanksListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  lawyers: IBank[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private bankService: BankService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = BANKS_COLUMNS;
    this.settings.actions.delete = true;
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
        this.lawyers = response.data;
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

  delete(bank: IBank) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}

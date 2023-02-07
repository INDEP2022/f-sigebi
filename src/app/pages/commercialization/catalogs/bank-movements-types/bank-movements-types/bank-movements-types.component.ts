import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { BankMovementsFormComponent } from '../bank-movements-form/bank-movements-form.component';
//Provisional Data
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { data } from './data';

@Component({
  selector: 'app-bank-movements-types',
  templateUrl: './bank-movements-types.component.html',
  styles: [],
})
export class BankMovementsTypesComponent extends BasePage implements OnInit {
  //PROVISIONAL Bank Account DATA
  bankAccounts: any[] = [];

  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  banksMovD = data;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bankMovementType: BankMovementType
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStatusBankMovements());
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
    });
  }

  public getStatusBankMovements() {
    this.loading = true;
    this.bankMovementType.getAll(this.params.getValue()).subscribe(
      response => {
        console.log(response);
        this.bankAccounts = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openModal(context?: Partial<BankMovementsFormComponent>) {
    const modalRef = this.modalService.show(BankMovementsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next); //this.getCities();
    });
  }

  add() {
    this.openModal();
  }

  openForm(bankMove: any) {
    this.openModal({ edit: true, bankMove });
  }

  delete(bankMove: any) {
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

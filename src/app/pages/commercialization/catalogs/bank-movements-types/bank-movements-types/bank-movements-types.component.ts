import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
//Components
import { BankMovementsFormComponent } from '../bank-movements-form/bank-movements-form.component';
//Provisional Data
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { data } from './data';

@Component({
  selector: 'app-bank-movements-types',
  templateUrl: './bank-movements-types.component.html',
  styles: [],
})
export class BankMovementsTypesComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  //PROVISIONAL Bank Account DATA
  bankAccounts: any[] = [];

  form: FormGroup = new FormGroup({});
  banksMovD = data;

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
    this.service = this.bankMovementType;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
    this.ilikeFilters = ['branchOffice'];
    this.prepareForm();
    this.form.valueChanges.subscribe(response => {
      // console.log(response);
      const field = `filter.bankKey`;
      let searchFilter = SearchFilter.ILIKE;
      if (response.bank !== '' && response.bank !== null) {
        this.columnFilters[field] = `${searchFilter}:${response.bank}`;
      } else {
        delete this.columnFilters[field];
      }
      this.getData();
    });
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<BankMovementsFormComponent>) {
    const modalRef = this.modalService.show(BankMovementsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        console.log(next);
      } //this.getCities();
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
        this.bankMovementType.remove(bankMove.id).subscribe({
          next: response => {
            this.alert('success', 'Exito', 'Eliminado correctamente');
            this.getData();
          },
          error: err => {
            this.onLoadToast('error', 'Error', 'Intente nuevamente');
          },
        });
      }
    });
  }
}

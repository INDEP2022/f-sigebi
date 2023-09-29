import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-catalogue-expenses-modal',
  templateUrl: './catalogue-expenses-modal.component.html',
  styles: [],
})
export class CatalogueExpensesModalComponent
  extends BasePage
  implements OnInit
{
  data: any;
  form: FormGroup;
  title: string;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.data != null) {
      this.title = 'Editar Registro';
      this.loadData();
    } else {
      this.title = 'Nuevo Registro';
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      description: [null, Validators.required],
      criterio: [null, Validators.required],
    });
  }

  close() {
    this.modalRef.hide();
  }

  loadData() {
    this.form.patchValue({
      description: this.data.description,
      criterio: this.data.notCriterionApplicationSpent,
    });
  }

  saveEdit() {
    if (this.data != null) {
      this.update();
    } else {
      this.newRegister();
    }
  }

  update() {
    let params = {
      description: this.form.get('description').value,
      notCriterionApplicationSpent: this.form.get('criterio').value,
    };
    this.expenseService
      .updateDataExpense(params, this.data.notConceptSpent)
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Actualización Exitosa',
            'Se actualizo el registro exitosamente.'
          );
          this.modalRef.content.callback(true, true);
          this.modalRef.hide();
        },
        error: err => {
          this.alert('error', 'Error', 'Hubo un error, intentelo nuevamente.');
        },
      });
  }

  newRegister() {
    let params = {
      notConceptSpent: '',
      description: this.form.get('description').value,
      notCriterionApplicationSpent: this.form.get('criterio').value,
    };
    this.expenseService.insertDataExpense(params).subscribe({
      next: response => {
        this.alert('success', 'Exitoso', 'Se creo el registro exitosamente.');
        this.modalRef.content.callback(true, true);
        this.modalRef.hide();
      },
      error: err => {
        this.alert('error', 'Error', 'Hubo un error, intentelo nuevamente.');
      },
    });
  }
}

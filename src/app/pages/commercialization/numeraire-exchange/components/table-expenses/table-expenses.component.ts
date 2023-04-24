import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { showToast } from 'src/app/common/helpers/helpers';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';

interface IExpense {
  id: string;
  register?: string;
  description: string;
  descriptionName: string;
  import: number;
}
@Component({
  selector: 'app-table-expenses',
  templateUrl: './table-expenses.component.html',
  styles: [],
})
export class TableExpensesComponent {
  @ViewChild('dialogExpense') dialogExpenseTemplateRef: TemplateRef<any>;
  constructor(private dialogService: BsModalService) {}

  dialogExpenseRef: BsModalRef;

  expenses: IExpense[] = [];
  idExpense: string | null = null;

  form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    descriptionName: new FormControl({ disabled: true, value: null }, [
      Validators.required,
    ]),
    import: new FormControl(0, [Validators.required]),
  });

  selectedExpenseType(spent: ISpentConcept): void {
    this.form.patchValue({
      descriptionName: spent.description,
      id: spent.id,
    });
  }

  addExpense(): void {
    if (this.form.invalid) {
      showToast({
        icon: 'error',
        title: 'Gasto invalido',
        text: 'Revise el gasto que va a ingresar unos de sus campos es invalido o es requerido',
      });
      return;
    }
    if (!this.validateNotRepeatExpense()) {
      return;
    }
    const {
      id,
      description,
      descriptionName,
      import: importValue,
    } = this.form.getRawValue();

    if (this.idExpense) {
      const expense = this.expenses.find(x => x.id == this.idExpense);
      expense.description = description;
      expense.descriptionName = descriptionName;
      expense.import = importValue;
    } else {
      const expense: IExpense = {
        id,
        description,
        descriptionName: descriptionName,
        import: importValue,
      };
      this.expenses.push(expense);
    }
    this.closeDialogExpense();
  }

  removeExpense(register: any) {
    const index = this.expenses.findIndex(x => x.register == register);
    this.expenses.splice(index, 1);
  }

  getExpense(): IExpense[] {
    return this.expenses;
  }

  openCreateOrEditExpense(id?: any): void {
    if (id) {
      this.idExpense = id;
      const values = this.expenses.find(x => x.id == id);
      this.form.patchValue(values);
    }
    this.openDialogExpense();
  }

  openDialogExpense(): void {
    this.dialogExpenseRef = this.dialogService.show(
      this.dialogExpenseTemplateRef
    );
  }

  closeDialogExpense(): void {
    this.dialogExpenseRef.hide();
    this.idExpense = null;
    this.form.reset();
  }

  validateNotRepeatExpense(): boolean {
    const { id } = this.form.value;
    const expense = this.expenses.find(x => x.id === id);
    if (expense && !this.isEdit()) {
      showToast({
        icon: 'error',
        title: 'Gasto invalido',
        text: 'El Gasto ya esta ingresado',
      });
      return false;
    }
    return true;
  }

  isEdit(): boolean {
    return Boolean(this.idExpense);
  }
}

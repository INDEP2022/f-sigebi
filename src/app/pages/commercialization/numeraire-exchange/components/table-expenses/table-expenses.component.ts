import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { showToast } from 'src/app/common/helpers/helpers';

@Component({
  selector: 'app-table-expenses',
  templateUrl: './table-expenses.component.html',
  styles: [
    `
      .form-custom {
        width: 100%;
        height: 39px;
        padding: 1px 12px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        -webkit-transition: border-color ease-in-out 0.15s,
          box-shadow ease-in-out 0.15s;
        transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        outline: none;
      }
    `,
  ],
})
export class TableExpensesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  formExpenses = new FormArray<FormGroup>([]);

  formExpenseAdd = new FormGroup({
    register: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    descriptionName: new FormControl({ disabled: true, value: null }, [
      Validators.required,
    ]),
    import: new FormControl('', [Validators.required]),
  });

  previousValuesExpense = new Map<
    number,
    {
      register: string;
      description: string;
      import: string;
    }
  >();

  isOpenAddExpense = false;
  expenseTypeTest = [
    {
      id: 3107,
      description: 'SERVICIO DE AGUA',
    },
    {
      id: 3201,
      description: 'ARRENDAMIENTO DE SERVICIO Y LOCALES',
    },
    {
      id: 3305,
      description: 'CAPACITACIONES',
    },
    {
      id: 3306,
      description: 'SERVICIOS DE INFORMÁTICA',
    },
    {
      id: 3408,
      description: 'COMISIONES POR VENTAS',
    },
  ];

  addExpense(): void {
    if (this.formExpenseAdd.invalid) {
      showToast({
        icon: 'error',
        title: 'Gasto invalido',
        text: 'Revise el gasto que va a ingresar unos de sus campos es invalido',
      });
      return;
    }
    const formGroup = this.makeInstanceFormGroupExpense();
    const descriptionName = this.getDescriptionExpense(
      this.formExpenseAdd.value.description
    );

    const values = this.formExpenseAdd.value;
    values.descriptionName = descriptionName;
    formGroup.patchValue(values);

    formGroup.disable();
    this.formExpenses.push(formGroup);
    this.isOpenAddExpense = false;
  }

  makeInstanceFormGroupExpense(): FormGroup {
    return new FormGroup({
      register: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      descriptionName: new FormControl({ disabled: true, value: null }, [
        Validators.required,
      ]),
      import: new FormControl('', [Validators.required]),
    });
  }

  updateExpense(i: number): void {
    const formGroup = this.formExpenses.at(i);
    if (formGroup.invalid) {
      showToast({
        icon: 'error',
        title: 'Gasto invalido',
        text: 'Revise el gasto que va a ingresar unos de sus campos es invalido',
      });
      return;
    }
    const descriptionName = this.getDescriptionExpense(
      formGroup.value.description
    );
    formGroup.patchValue({ descriptionName });
    this.formExpenses.at(i).disable();
    this.previousValuesExpense.delete(i);
  }

  removeExpense(i: number) {
    this.formExpenses.removeAt(i);
  }

  openCreateExpense(): void {
    this.isOpenAddExpense = true;
    this.formExpenses.disable();
    this.formExpenseAdd.reset();
  }

  openEditExpense(i: number): void {
    this.isOpenAddExpense = false;
    this.formExpenses.at(i).enable();
    this.previousValuesExpense.set(i, this.formExpenses.at(i).value);
  }

  closeEditExpense(i: number): void {
    this.formExpenses.at(i).patchValue(this.previousValuesExpense.get(i));
    this.formExpenses.at(i).disable();
    this.previousValuesExpense.delete(i);
  }

  getDescriptionExpense(id: number): string {
    return this.expenseTypeTest.find(x => x.id == id)?.description;
  }
}

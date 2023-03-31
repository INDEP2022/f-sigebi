import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { showToast } from 'src/app/common/helpers/helpers';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';

interface IExpenseConcept {
  id: string;
  register?: string;
  description: string;
  descriptionName: string;
  import: string;
}
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
export class TableExpensesComponent {
  @ViewChild('dialogExpense') dialogExpenseTemplateRef: TemplateRef<any>;
  constructor(
    // private spentService: SpentService,
    private dialogService: BsModalService
  ) {}

  dialogExpenseRef: BsModalRef;
  // ngOnInit(): void {
  //   // this.getExpenses();
  // }

  expenses: IExpenseConcept[] = [];
  idExpense: string | null = null;

  form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    descriptionName: new FormControl({ disabled: true, value: null }, [
      Validators.required,
    ]),
    import: new FormControl('', [Validators.required]),
  });

  // expenseType: ISpentConcept[] = [];

  // getExpenses(): void {
  //   // this.spentService.getExpensesConcept().subscribe(res => {
  //   //   this.expenseType = res.data;
  //   // });
  // }

  selectedExpenseType(spent: ISpentConcept): void {
    this.form.patchValue({
      descriptionName: spent.description,
      id: spent.id,
    });
  }

  saveInServer(): void {
    if (this.form.invalid) {
      showToast({
        icon: 'error',
        title: 'Gasto invalido',
        text: 'Revise el gasto que va a ingresar unos de sus campos es invalido',
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
      // expense.id = register;
      expense.description = description;
      expense.descriptionName = descriptionName;
      expense.import = importValue;
    } else {
      const expense: IExpenseConcept = {
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

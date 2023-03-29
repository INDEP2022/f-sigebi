import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { showToast } from 'src/app/common/helpers/helpers';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';

interface IExpense {
  register: string;
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
export class TableExpensesComponent implements OnInit {
  @ViewChild('dialogExpense') dialogExpenseTemplateRef: TemplateRef<any>;
  constructor(
    private spentService: SpentService,
    private dialogService: BsModalService
  ) {}

  dialogExpenseRef: BsModalRef;
  ngOnInit(): void {
    this.getExpenses();
  }

  expenses: IExpense[] = [];
  registerEdit: string | null = null;

  form = new FormGroup({
    register: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    descriptionName: new FormControl({ disabled: true, value: null }, [
      Validators.required,
    ]),
    import: new FormControl('', [Validators.required]),
  });

  expenseType: ISpentConcept[] = [];

  getExpenses(): void {
    this.spentService.getExpensesConcept().subscribe(res => {
      this.expenseType = res.data;
    });
  }

  selectedExpenseType(spent: ISpentConcept): void {
    this.form.patchValue({
      descriptionName: spent.description,
      register: spent.registryNumber,
    });
  }

  saveExpense(): void {
    if (this.form.invalid) {
      showToast({
        icon: 'error',
        title: 'Gasto invalido',
        text: 'Revise el gasto que va a ingresar unos de sus campos es invalido',
      });
      return;
    }
    if (!this.validateNotRepeatRegister()) {
      return;
    }
    const {
      register,
      description,
      descriptionName,
      import: importValue,
    } = this.form.getRawValue();

    if (this.registerEdit) {
      const expense = this.expenses.find(x => x.register == this.registerEdit);
      expense.register = register;
      expense.description = description;
      expense.descriptionName = descriptionName;
      expense.import = importValue;
    } else {
      const expense: IExpense = {
        register,
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
      this.registerEdit = id;
      const values = this.expenses.find(x => x.register == id);
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
    this.registerEdit = null;
    this.form.reset();
  }

  validateNotRepeatRegister(): boolean {
    const { register } = this.form.value;
    const expense = this.expenses.find(x => x.register === register);
    const preExpense = this.expenseType.find(
      x => x.registryNumber === this.registerEdit
    );
    if (expense && preExpense?.registryNumber !== register) {
      showToast({
        icon: 'error',
        title: 'Registro invalido',
        text: 'El registro ya esta ingresado',
      });
      return false;
    }
    return true;
  }
}

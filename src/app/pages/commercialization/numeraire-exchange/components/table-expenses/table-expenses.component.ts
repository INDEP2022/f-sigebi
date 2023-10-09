import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { showToast } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
import { ClassWidthAlert } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

interface IExpense {
  id: string;
  register?: string;
  description: string;
  import: number;
}
@Component({
  selector: 'app-table-expenses',
  templateUrl: './table-expenses.component.html',
  styles: [
    `
      .dialog-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
    `,
  ],
})
export class TableExpensesComponent extends ClassWidthAlert {
  @ViewChild('dialogExpense') dialogExpenseTemplateRef: TemplateRef<any>;
  constructor(
    private dialogService: BsModalService,
    private goodSpentService: GoodSpentService
  ) {
    super();
    this.getExpenseConcept(new ListParams());
  }

  dialogExpenseRef: BsModalRef;

  expenses: IExpense[] = [];
  idExpense: string | null = null;
  expenseData = new DefaultSelect<any>();
  form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    // descriptionName: new FormControl({ disabled: true, value: null }, [
    //   Validators.required,
    // ]),
    import: new FormControl(1, [Validators.required]),
  });

  selectedExpenseType(spent: ISpentConcept): void {
    this.form.patchValue(
      // descriptionName: spent.description,
      spent
    );
  }

  addExpense(): void {
    if (this.form.invalid) {
      this.alert(
        'warning',
        'Gasto inválido',
        'Revise el Gasto que va a Ingresar unos de sus Campos es Inválido o es Requerido'
      );
      return;
    }
    if (!this.validateNotRepeatExpense()) {
      return;
    }
    const { id, description, import: importValue } = this.form.getRawValue();

    let message = 'Gasto Agregado Correctamente';
    if (this.idExpense) {
      const expense = this.expenses.find(x => x.id == this.idExpense);
      expense.description = description;
      expense.import = importValue;
      message = 'Gasto Actualizado Correctamente';
    } else {
      const expense: IExpense = {
        id,
        description,
        import: importValue,
      };
      this.expenses.push(expense);
    }
    this.alert('success', message, '');
    this.closeDialogExpense();
  }

  async removeExpense(register: any) {
    const confirm = await this.alertQuestion(
      'warning',
      'Advertencia',
      '¿Estas Seguro de Eliminar el Gasto?'
    );
    if (!confirm.isConfirmed) {
      return;
    }
    const index = this.expenses.findIndex(x => x.register == register);
    this.expenses.splice(index, 1);
  }

  getExpense(): IExpense[] {
    return this.expenses;
  }

  initOptionExpenseConcept: IExpense;
  openCreateOrEditExpense(id?: any): void {
    if (id) {
      this.idExpense = id;
      const values = this.expenses.find(x => x.id == id);
      this.initOptionExpenseConcept = values;
      console.log(values);
      this.form.patchValue(values);
    }
    this.openDialogExpense();
  }

  openDialogExpense(): void {
    const config: ModalOptions = {
      class: 'modal-dialog-centered',
    };
    this.dialogExpenseRef = this.dialogService.show(
      this.dialogExpenseTemplateRef,
      config
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
        title: 'Gasto Inválido',
        text: 'El Gasto ya esta Ingresado',
      });
      return false;
    }
    return true;
  }
  getExpenseConcept(params: ListParams) {
    delete params['search'];
    if (!isNaN(parseFloat(params.text)) && isFinite(+params.text)) {
      if (params.text != undefined && params.text != '') {
        params['filter.id'] = `$eq:${params.text}`;
      }
    } else {
      if (params.text != undefined && params.text != '') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }
    this.goodSpentService.getExpenseConceptGetAll(params).subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.expenseData = new DefaultSelect(response.data, response.count);
      },
      error: (error: any) => {
        this.expenseData = new DefaultSelect([], 0, true);
      },
    });
  }
  isEdit(): boolean {
    return Boolean(this.idExpense);
  }

  clearTable(): void {
    this.expenses = [];
  }
}

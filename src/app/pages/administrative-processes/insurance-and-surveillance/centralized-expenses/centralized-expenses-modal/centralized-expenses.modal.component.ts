import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-centralized-expenses-modal',
  templateUrl: './centralized-expenses.modal.component.html',
  styles: [],
})
export class CentralizedExpensesModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  title: string;
  newOrEdit: any;

  maxDate = new Date();

  eventItems = new DefaultSelect();
  user1 = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private usersService: UsersService,
    private pentService: SpentService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Inicializa modal', this.newOrEdit);
    this.prepareForm();
    if (this.newOrEdit != null) {
      this.title = 'Editar Registro';
      this.loadData();
    } else {
      this.title = 'Nuevo Registro';
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      number: [null, Validators.required],
      concept: [null, Validators.required],
      description: [null, Validators.required],
      import: [null, Validators.required],
      date: [null, Validators.required],
      user: [null, Validators.required],
    });
  }

  close() {
    this.modalRef.hide();
  }

  loadData() {
    this.form.patchValue({
      number: this.newOrEdit.id,
      description: this.newOrEdit.description,
      import: this.newOrEdit.amount,
      date: this.newOrEdit.exercisedDate,
    });
    if (this.newOrEdit.expenseConceptNumber != null) {
      this.loadTranfer(this.newOrEdit.expenseConceptNumber);
    } else {
      console.log('No data');
    }
    this.loadUser(this.newOrEdit.user);
  }

  saveEdit() {
    const { number, concept, date, user } = this.form.value;
    console.log('Date Save 1->', date);
    console.log('Date Save 2->', this.formatDate(new Date(date)));
    if (this.newOrEdit != null) {
      let body = {
        id: number,
        expenseConceptNumber: concept,
        amount: this.form.get('import').value,
        exercisedDate:
          this.formatDate(new Date(date)) == 'NaN-NaN-NaN'
            ? null
            : this.formatDate(new Date(date)),
        user: user,
      };
      console.log('Update 3-> ', body);
      this.update(body);
    } else {
      let body = {
        id: number,
        expenseConceptNumber: concept,
        amount: this.form.get('import').value,
        exercisedDate: this.formatDate(new Date(date)),
        user: user,
      };
      console.log('Create-> ', body);
      this.newRegister(body);
    }
  }

  serviceConcept(params: ListParams) {
    this.expenseService.getExpenseConcep(params).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          this.eventItems = new DefaultSelect(resp.data, resp.count);
        }
      },
      error: err => {
        this.eventItems = new DefaultSelect();
      },
    });
  }

  loadTranfer(concept: any) {
    const _params: any = [];
    _params['filter.notConceptSpent'] = concept;
    this.expenseService.getExpenseConcep(_params).subscribe({
      next: response => {
        console.log('loadTranfer-> ', response);
        this.eventItems = new DefaultSelect(response.data, response.count);
        this.form.get('concept').setValue(response.data[0].notConceptSpent);
      },
      error: err => {
        this.form.get('concept').setValue('');
      },
    });
  }

  update(body: any) {
    console.log('Update-> ', body);
    this.pentService.putExpedientureExpended(body).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          this.alert('success', 'Registro actualizado correctamente', '');
          console.log('Resp Update-> ', resp);
          this.close();
        }
      },
      error: err => {
        this.alert('error', 'Error al actualizar', '');
        console.log('Err Update-> ', err);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  getAllSegUser1(params: any) {
    console.log('params: ', params);
    delete params['filter.name.$ilike:'];

    let name = params['search'];

    this.usersService.getAllSegUsers3(params, name).subscribe({
      next: resp => {
        console.log('getAllSegUser1-> ', resp);
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  loadUser(user: any) {
    this.usersService.getAllSegUsersbykey(user).subscribe({
      next: resp => {
        console.log('getAllSegUser1-> ', resp);
        this.user1 = new DefaultSelect(resp.data, resp.count);
        this.form.get('user').setValue(resp.data[0].user);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  newRegister(body: any) {
    this.pentService.postExpedientureExpended(body).subscribe({
      next: resp => {
        this.alert('success', 'Registro guardado correctamente', '');
        console.log('PostNewRegister-> ', resp);
        this.close();
      },
      error: err => {
        this.alert('error', 'Error al guardar', '');
        console.log('ErrorNewRegister-> ', err);
      },
    });
  }
}

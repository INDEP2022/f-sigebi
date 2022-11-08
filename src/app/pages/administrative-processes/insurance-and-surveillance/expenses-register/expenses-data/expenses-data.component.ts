import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-expenses-data',
  templateUrl: './expenses-data.component.html',
  styles: [],
})
export class ExpensesDataComponent implements OnInit {
  form: FormGroup;

  beneficiaries = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      folio: [null, Validators.required],
      expenseDate: [null, Validators.required],
      expenseType: [null, Validators.required],
      beneficiario: [null, Validators.required],
      importe: [null, Validators.required],
      retention: [null, Validators.required],
      concept: [null, Validators.required],
      institutionalActivity: [null, Validators.required],
      expenseConcept: [null, Validators.required],
      costCenter: [null, Validators.required],
      userRequest: [null, Validators.required],
      userAuthorize: [null, Validators.required],
    });
  }

  getBeneficiarios(evt: any): void {}
}

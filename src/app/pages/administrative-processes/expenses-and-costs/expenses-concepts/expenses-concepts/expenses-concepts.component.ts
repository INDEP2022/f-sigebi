import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expenses-concepts',
  templateUrl: './expenses-concepts.component.html',
  styles: [],
})
export class ExpensesConceptsComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      clasification: [null, Validators.required],
      concept: [null, Validators.required],
      status: [null, Validators.required],
    });
  }
}

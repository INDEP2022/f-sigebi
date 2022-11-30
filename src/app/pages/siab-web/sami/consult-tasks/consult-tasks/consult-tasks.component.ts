import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-consult-tasks',
  templateUrl: './consult-tasks.component.html',
  styles: [],
})
export class ConsultTasksComponent implements OnInit {
  consultTasksForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.consultTasksForm = this.fb.group({
      unlinked: [null, Validators.required],
      unlinked1: [null, Validators.required],
    });
  }
}

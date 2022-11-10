import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styles: [
    `
      :host ::ng-deep .form-control.ng-select {
        border: none;
        padding: 0;
      }
      :host ::ng-deep .ng-select.ng-select-single .ng-select-container {
        border: none;
      }
    `,
  ],
})
export class SelectUserComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.cell.newValue !== '') {
      if (this.cell.getValue() !== null) {
        let user = this.cell.getValue;
        this.form.controls['user'].setValue(user);
      }
    }

    this.form.controls['user'].valueChanges.subscribe(user => {
      this.cell.newValue = user;
    });
  }

  prepareForm(): void {
    this.form = this.fb.group({
      user: [null],
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-select-id',
  templateUrl: './select-id.component.html',
  styles: [],
})
export class SelectIdComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.controls['id'].valueChanges.subscribe(id => {
      this.cell.newValue = id;
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
@Component({
  selector: 'app-select-description',
  templateUrl: './select-description.component.html',
  styles: [],
})
export class SelectDescriptionComponent
  extends DefaultEditor
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.controls['description'].valueChanges.subscribe(description => {
      this.cell.newValue = description;
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      description: [null],
    });
  }
}

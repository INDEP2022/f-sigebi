import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-storehouse',
  templateUrl: './storehouse.component.html',
  styles: [],
})
export class StorehouseComponent implements OnInit {
  costStorehouseForm: ModelForm<any>;
  assignmentStorehouseForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.costStorehouseForm = this.fb.group({
      noStore: [null, Validators.required],
      typeStore: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      dateReport: [null, Validators.required],
      noGoods: [null, Validators.required],
      date1: [null, Validators.required],
      date2: [null, Validators.required],
    });
    this.assignmentStorehouseForm = this.fb.group({
      noStore: [null, Validators.required],
      idTypeStore: [null, Validators.required],
      noGoods: [null, Validators.required],
      section: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      position: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      date1: [null, Validators.required],
      date2: [null, Validators.required],
    });
  }
}

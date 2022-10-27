import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-return-confiscation-property',
  templateUrl: './return-confiscation-property.component.html',
  styles: [
  ]
})
export class ReturnConfiscationPropertyComponent implements OnInit {
  returnConfiscationForm: ModelForm<any>;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.returnConfiscationForm = this.fb.group({
      delegation: [null, Validators.required],
      subDelegation: [null, Validators.required],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
      receiptDateOf: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
      movementType: [null, Validators.required],
    });
  }
}

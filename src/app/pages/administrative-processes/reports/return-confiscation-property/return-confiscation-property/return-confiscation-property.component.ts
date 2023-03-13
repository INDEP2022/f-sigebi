import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-return-confiscation-property',
  templateUrl: './return-confiscation-property.component.html',
  styles: [],
})
export class ReturnConfiscationPropertyComponent implements OnInit {
  returnConfiscationForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.returnConfiscationForm = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
      receiptDateOf: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
      movementType: [null, Validators.required],
    });
  }
}

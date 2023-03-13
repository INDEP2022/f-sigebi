import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styles: [],
})
export class VaultsComponent implements OnInit {
  vaultsForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.vaultsForm = this.fb.group({
      regional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      vaults: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      statusGoods: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      entryDateFrom: [null, Validators.required],
      until: [null, Validators.required],
      departureDateOf: [null, Validators.required],
      until1: [null, Validators.required],
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styles: [
  ]
})
export class VaultsComponent implements OnInit {
  vaultsForm: ModelForm<any>;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.vaultsForm = this.fb.group({
      regional: [null, Validators.required],
      vaults: [null, Validators.required],
      statusGoods: [null, Validators.required],
      entryDateFrom: [null, Validators.required],
      until: [null, Validators.required],
      departureDateOf: [null, Validators.required],
      until1: [null, Validators.required],
    });
  }

}

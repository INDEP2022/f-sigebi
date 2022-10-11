import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-pe-rdde-c-daily-control-reception',
  templateUrl: './pe-rdde-c-daily-control-reception.component.html',
  styles: [
  ]
})
export class PeRddeCDailyControlReceptionComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subDelegation: ['', [Validators.required]],
      fromYear: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(1950), Validators.max(2022)]],
      fromMonth: ['', [Validators.required]],
    });
  }


}

import { Component, OnInit } from '@angular/core';
//Reactive Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      issuingUser: [null, [Validators.required]],
      policy: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      requestFrom: [null, [Validators.required]],
      requestTo: [null, [Validators.required]],
    });
  }

  confirm(): void {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    console.log(this.form.value);
    setTimeout(st => {
      this.loading = false;
    }, 5000);
  }
}

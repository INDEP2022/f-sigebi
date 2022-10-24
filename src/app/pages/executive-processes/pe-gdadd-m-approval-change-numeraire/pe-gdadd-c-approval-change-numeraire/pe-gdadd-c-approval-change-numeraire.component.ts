import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-pe-gdadd-c-approval-change-numeraire',
  templateUrl: './pe-gdadd-c-approval-change-numeraire.component.html',
  styles: [
  ]
})
export class PeGdaddCApprovalChangeNumeraireComponent implements OnInit {

  form : FormGroup = new FormGroup({});

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group({
      noBien: [null, [Validators.maxLength(10), Validators.minLength(1), Validators.pattern(NUMBERS_PATTERN)], ],
      description: [null, []],
      status: [null, []],
      applicant: [null, []],
      reason: [null, []],
      appDate: [null, []],
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';

@Component({
  selector: 'app-sw-avaluos-c-res-cancel-valuation',
  templateUrl: './sw-avaluos-c-res-cancel-valuation.component.html',
  styles: [],
})
export class SwAvaluosCResCancelValuationComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      folios: [null, [Validators.required]],
      radio: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      cve: [null, [Validators.required]],
      city: [null, [Validators.required]],
      receptionDate: [null, [Validators.required, maxDate(new Date())]],
      elaborationDate: [null, [Validators.required, maxDate(new Date())]],
      sender: [null, [Validators.required]],
      senderTxt: [null, [Validators.required]],

      addressee: [null, [Validators.required]],
      addresseeTxt: [null, [Validators.required]],
    });
  }
}

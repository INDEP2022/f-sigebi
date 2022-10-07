import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-c-b-ge-can-c-numeraire-conversion-allotments',
  templateUrl: './c-b-ge-can-c-numeraire-conversion-allotments.component.html',
  styles: [
  ]
})
export class CBGeCanCNumeraireConversionAllotmentsComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      cveEvent: ['', [Validators.required]],
      nameEvent: ['', [Validators.required]],
      obsEvent: ['', [Validators.required]],
      place: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      failureDate: ['', [Validators.required]],
    });
  }

}

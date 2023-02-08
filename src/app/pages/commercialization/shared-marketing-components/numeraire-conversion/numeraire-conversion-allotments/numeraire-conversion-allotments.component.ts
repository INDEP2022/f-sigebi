import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-numeraire-conversion-allotments',
  templateUrl: './numeraire-conversion-allotments.component.html',
  styles: [],
})
export class NumeraireConversionAllotmentsComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      cveEvent: ['', [Validators.required]],
      nameEvent: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      obsEvent: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      place: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      eventDate: ['', [Validators.required]],
      failureDate: ['', [Validators.required]],
    });
  }
}

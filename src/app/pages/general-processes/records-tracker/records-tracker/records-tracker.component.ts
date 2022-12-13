import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-records-tracker',
  templateUrl: './records-tracker.component.html',
  styles: [],
})
export class RecordsTrackerComponent implements OnInit {
  form = this.fb.group({
    noExpediente: [null, [Validators.required]],
    averPrevia: [null, [Validators.required]],
    causaPenal: [null, [Validators.required]],
    noVolante: [null, [Validators.required]],
    indiciado: [null, [Validators.required]],
    fechaRec: [null, [Validators.required]],
    amparo: [null, [Validators.required]],
    tocaPenal: [null, [Validators.required]],
    noJuzgado: [null, [Validators.required]],
    fechaOficio: [null, [Validators.required]],
    minPub: [null, [Validators.required]],
    oficioExterno: [null, [Validators.required]],
    entFed: [null, [Validators.required]],
    type: [null, [Validators.required]],
    subtype: [null, [Validators.required]],
    ssubtype: [null, [Validators.required]],
    sssubtype: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}

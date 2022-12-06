import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-purging-records',
  templateUrl: './purging-records.component.html',
  styles: [
    `
      .b-content {
        margin-top: -35px;
      }
    `,
  ],
})
export class PurgingRecordsComponent implements OnInit {
  form = this.fb.group({
    noExpediente: [null, [Validators.required]],
    averPrevia: [null, [Validators.required]],
    causaPenal: [null, [Validators.required]],
    acta: [null, [Validators.required]],
    amparo: [null, [Validators.required]],
    tocaPenal: [null, [Validators.required]],
    identificador: [null, [Validators.required]],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}

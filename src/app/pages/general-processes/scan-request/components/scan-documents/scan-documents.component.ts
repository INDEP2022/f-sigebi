import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-scan-documents',
  templateUrl: './scan-documents.component.html',
  styles: [
    `
      .float-check {
        position: absolute;
        top: -10px;
        right: -10px;
      }

      .docs-scroll {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    `,
  ],
})
export class ScanDocumentsComponent implements OnInit {
  form = this.fb.group({
    expediente: [null, [Validators.required]],
    folio: [null, [Validators.required]],
    de: [null, [Validators.required]],
    a: [null, [Validators.required]],
    mantener: [null, [Validators.required]],
    mostrat: [null, [Validators.required]],
  });
  data: any[] = [];
  constructor(private fb: FormBuilder) {
    this.data.length = 15;
  }

  ngOnInit(): void {}
}

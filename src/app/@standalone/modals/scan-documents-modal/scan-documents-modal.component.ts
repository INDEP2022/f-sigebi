import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-scan-documents-modal',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './scan-documents-modal.component.html',
  styleUrls: ['./scan-documents-modal.component.scss'],
})
export class ScanDocumentsModalComponent implements OnInit {
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

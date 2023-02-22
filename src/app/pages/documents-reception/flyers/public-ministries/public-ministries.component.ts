import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-public-ministries',
  templateUrl: './public-ministries.component.html',
  styles: [],
})
export class PublicMinistriesComponent implements OnInit {
  publicMinistriesForm = this.fb.group({
    noCity: [null, [Validators.required]],
    noMinpub: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });
  callback?: (next: string | number) => void;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalRef: BsModalRef
  ) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}

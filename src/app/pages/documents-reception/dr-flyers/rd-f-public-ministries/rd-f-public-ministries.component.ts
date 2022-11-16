import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';


@Component({
  selector: 'app-rd-f-public-ministries',
  templateUrl: './rd-f-public-ministries.component.html',
  styles: [
  ]
})
export class RdFPublicMinistriesComponent implements OnInit {
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
  ) { }

  ngOnInit(): void { }

  close() {
    this.modalRef.hide();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-good-actions',
  templateUrl: './good-actions.component.html',
  styles: [],
})
export class GoodActionsComponent implements OnInit {
  form: FormGroup;
  loading = false;
  statusActaValue: string;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      goodId: [null],
      action: [null],
    });
  }

  ngOnInit(): void {}

  addGood() {}

  openModals() {}

  updateGoods() {}
}

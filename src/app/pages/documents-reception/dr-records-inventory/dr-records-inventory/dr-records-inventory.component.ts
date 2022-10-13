import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';

@Component({
  selector: 'app-dr-records-inventory',
  templateUrl: './dr-records-inventory.component.html',
  styles: [],
})
export class DrRecordsInventoryComponent implements OnInit {
  form: FormGroup;
  record = new FormControl(null);
  settings = { ...TABLE_SETTINGS, actions: false };
  constructor(private fb: FormBuilder) {
    this.settings.columns = {
      inventario: {
        title: 'Inventario',
        sort: false,
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      realizo: [null, [Validators.required]],
      anexar: [null, [Validators.required]],
    });
  }
}

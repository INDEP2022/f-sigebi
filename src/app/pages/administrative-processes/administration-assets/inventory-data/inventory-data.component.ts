import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from './../../../../core/interfaces/model-form';

@Component({
  selector: 'app-inventory-data',
  templateUrl: './inventory-data.component.html',
  styles: [],
})
export class InventoryDataComponent implements OnInit {
  inventoryDataForm: ModelForm<any>;
  list: any[] = [];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.inventoryDataForm = this.fb.group({
      noInventario: [null, [Validators.required]],
      fechaInventario: [new Date(), [Validators.required]],
      responsable: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}

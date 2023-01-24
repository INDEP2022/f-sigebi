import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styles: [],
})
export class InventoryReportComponent implements OnInit {
  inventorReportForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.inventorReportForm = this.fb.group({
      good: [null, Validators.required],
      inventoryType: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      date: [null, Validators.required],
    });
  }
}

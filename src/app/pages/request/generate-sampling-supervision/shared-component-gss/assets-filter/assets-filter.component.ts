import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-assets-filter',
  templateUrl: './assets-filter.component.html',
  styles: [],
})
export class AssetsFilterComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<any>();
  filterForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  search(): void {
    this.searchEvent.emit(this.filterForm.value);
  }

  reset(): void {
    this.filterForm.reset();
  }
}

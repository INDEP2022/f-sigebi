import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-service-orders-filter',
  templateUrl: './service-orders-filter.component.html',
  styles: [],
})
export class ServiceOrdersFilterComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<any>();
  filterForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noServiceOrder: [null],
      folioServiseOrder: [null, [Validators.pattern(STRING_PATTERN)]],
      noRequest: [null],
    });
  }

  search(): void {
    this.searchEvent.emit(this.filterForm.value);
  }

  reset(): void {
    this.filterForm.reset();
  }
}

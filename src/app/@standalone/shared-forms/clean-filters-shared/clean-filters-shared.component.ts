import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-clean-filters-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './clean-filters-shared.component.html',
  styles: [],
})
export class CleanFiltersSharedComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formStorage: string;
  constructor() {}

  ngOnInit(): void {}

  cleanFilters() {
    this.form.reset();
    if (this.formStorage && window.localStorage.getItem(this.formStorage))
      window.localStorage.removeItem(this.formStorage);
  }
}

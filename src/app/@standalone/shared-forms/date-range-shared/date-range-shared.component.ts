import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-date-range-shared',
  templateUrl: './date-range-shared.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styles: [],
})
export class DateRangeSharedComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() rangeDateField: string = 'rangeDate';

  get rangeDate() {
    return this.form.get(this.rangeDateField);
  }

  today: Date;
  maxDate: Date;
  minDate: Date;

  constructor() {
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
    // this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth(), 25);
  }

  ngOnInit(): void {}
}

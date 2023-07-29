import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilter } from 'ng2-smart-table';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-filter-date-picker',
  templateUrl: './filter-date-picker.component.html',
  styles: [],
})
export class FilterDatePickerComponent extends DefaultFilter implements OnInit {
  @Input() onChangeInp: any;
  @Input() placeholder: any;

  inputControl = new FormControl('');

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(this.delay))
      .subscribe((value: string) => {
        if (this.inputControl.status === 'VALID') {
          this.query = value !== null ? this.inputControl.value : '';
          this.query = new DatePipe('en-EN').transform(
            this.query,
            'dd/MM/yyyy',
            'UTC'
          );
          this.setFilter();
        }
      });
  }
}

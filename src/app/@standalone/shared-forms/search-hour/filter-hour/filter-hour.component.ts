import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';

@Component({
  selector: 'app-filter-hour',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-hour.component.html',
  styles: [],
})
export class FilterHourComponent extends DefaultFilter implements OnChanges {
  @Input() someInput: any;
  onChange(event: any): void {
    this.query = event;
    this.setFilter();
  }
  ngOnChanges() {}
  clearDate(event: any) {
    event.stopPropagation();
    this.query = '';
    this.setFilter();
  }
}

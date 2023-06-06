import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilter, ViewCell } from 'ng2-smart-table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-date-cell',
  standalone: true,
  templateUrl: './date-cell.component.html',
  imports: [SharedModule],
  styles: [],
})
export class DateCellComponent
  extends DefaultFilter
  implements OnInit, ViewCell, OnChanges
{
  @Input() value: string;
  @Input() rowData: any;
  @Input() label: string;
  @Output() inputChange = new EventEmitter<{
    row: any;
    value: Date;
  }>();
  readonly control = new FormControl<Date>(null);

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.value) {
      this.control.setValue(new Date(this.value));
    }
    this.control.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(this.delay))
      .subscribe((value: Date) => {
        this.onInputChange();
        this.query =
          value !== null ? this.control.value?.toString() ?? 'skip' : '';
        console.log(this.query);
        this.setFilter();
        this.query = '';
        this.setFilter();
      });
  }

  onInputChange() {
    this.inputChange.emit({ row: this.rowData, value: this.control.value });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['source']) {
      console.log(this.value);
      if (this.value) {
        this.control.setValue(new Date(this.value));
      }
    }
  }
}

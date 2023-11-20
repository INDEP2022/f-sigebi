import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radiobutton-element',
  template: `
    <div class="col">
      <label class="mr-3">
        <input
          type="radio"
          name="selection"
          value="name"
          [checked]="selectedOption === 'name'"
          (change)="selectOption('name')" />
      </label>
    </div>
  `,
  styles: [],
})
export class RadiobuttonElementComponent<T = any> implements OnInit, OnChanges {
  items: any[];
  disabled: boolean;
  checked: boolean;
  form: FormGroup;

  @Input() data: any[];
  @Input() selectedOption: any;
  @Output() select: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.items = this.data;
  }

  selectOption(option: any) {
    this.select.emit(option);
  }
}

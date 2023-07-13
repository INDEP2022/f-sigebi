import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="disabled"
        #box
<<<<<<< HEAD
        class="common-check form-control"
=======
        class="common-check custom-checkbox"
>>>>>>> 53f8457b23297af4c094d5e9ce9d3f84d08a27fb
        [checked]="checked"
        (change)="onToggle($event)"
        type="checkbox" />
    </div>
  `,
  styles: [],
})
export class CheckboxElementComponent<T = any> implements OnInit, OnChanges {
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: T;

  @Output() toggle: EventEmitter<{ row: T; toggle: boolean }> =
    new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.checked = this.value;
    console.log(this.checked);
  }

  onToggle($event: Event) {
    let row: any = this.rowData;
    let toggle = ($event.currentTarget as HTMLInputElement).checked;
    this.toggle.emit({ row, toggle });
  }

  setValue(value: boolean) {
    this.checked = value;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <form [formGroup]="form">
      <div class="col-md-12">
        <input
          formControlName="check"
          (change)="onToggle($event)"
          type="checkbox" />
      </div>
    </form>
  `,
  styles: [],
})
export class CheckboxDisabledElementComponent<T = any>
  extends DefaultEditor
  implements OnInit
{
  disabled: boolean;
  form: FormGroup = new FormGroup({});
  checked: boolean = null;
  @Input()
  set value(value: { checked: boolean; disabled: boolean }) {
    this.disabled = value.disabled;
    this.checked = value.checked;
    this.form = this.fb.group({
      check: [value.checked],
    });
  }

  @Output() toggle: EventEmitter<{ toggle: boolean }> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    console.log(this.checked);
    this.form = this.fb.group({
      check: [this.checked],
    });
    if (this.disabled) this.form.get('check')?.disable();
    if (this.cell && this.cell.newValue !== '') {
      if (this.cell.getValue() !== null) {
        let check = this.cell.getValue;
        this.form.controls['check'].setValue(check);
      }
    }

    this.form.controls['check'].valueChanges.subscribe(check => {
      this.cell.newValue = check;
    });
  }

  onToggle($event: any) {
    if (this.cell) this.cell.newValue = this.form.controls['check'].value;
    let toggle = ($event.target.form[0] as HTMLInputElement).checked;
    this.toggle.emit({ toggle });
  }
}

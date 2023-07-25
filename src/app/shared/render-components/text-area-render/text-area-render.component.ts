import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-text-area-render',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './text-area-render.component.html',
  styles: [],
})
export class TextAreaRenderComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});
  description: string;
  @Input() set value(value: { description: string; disabled: boolean }) {
    // debugger;
    // this.disabled = value.disabled;
    this.description = value.description;
    this.form = this.fb.group({
      text: [value.description],
    });
  }
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.cell && this.cell.newValue !== '' && this.cell.newValue !== null) {
      if (this.cell.getValue() !== null) {
        let text = this.cell.getValue();
        this.form.controls['text'].setValue(text);
      }
    }

    this.form.controls['text'].valueChanges.subscribe(text => {
      this.cell.newValue = text;
    });
  }

  prepareForm(): void {
    this.form = this.fb.group({
      text: [this.value],
    });
  }
}

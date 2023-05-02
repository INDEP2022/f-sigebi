import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-area-render',
  templateUrl: './text-area-render.component.html',
  styles: [],
})
export class TextAreaRenderComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Input() value: string;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    // if (this.cell.newValue !== '') {
    //   if (this.cell.getValue() !== null) {
    //     let user = this.cell.getValue;
    //     this.form.controls['text'].setValue(user);
    //   }
    // }

    // this.form.controls['text'].valueChanges.subscribe(user => {
    //   this.cell.newValue = user;
    // });
  }

  prepareForm(): void {
    this.form = this.fb.group({
      text: [{ value: this.value, disabled: true }],
    });
  }
}

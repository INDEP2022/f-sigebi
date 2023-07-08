import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-change-goods-random',
  templateUrl: './change-goods-random.component.html',
  styles: [],
})
export class ChangeGoodsRandomComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  form: FormGroup;
  public delegations = new DefaultSelect();
  @Output() eventChangeGoodsRandom = new EventEmitter();
  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);

  ngOnInit(): void {
    this.prepareForm();
  }

  getFormChangeGoodsRandom() {
    return this.form;
  }

  onClickChangeGoodRandom() {
    console.log(this.form.value);
    this.eventChangeGoodsRandom.emit(this.form.value);
  }

  prepareForm() {
    this.form = this.fb.group({
      year: [null, Validators.required],
      period: [null, Validators.required],
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      random: [null, Validators.required],
      goodNumber: [null, Validators.required],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      transference: [null, Validators.required],
    });
  }
}

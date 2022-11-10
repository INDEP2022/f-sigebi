import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styles: [],
})
export class SelectInputComponent implements OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();

  selectForm: ModelForm<any>;
  select = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      select: [null],
    });
  }

  getStationSelect(event: any) {}
}

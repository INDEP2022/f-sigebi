import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RequestHelperService } from '../../../request-helper-services/request-helper.service';

const resultEvaList = [
  {
    id: 'NO_CUMPLE',
    description: 'No Cumple',
  },
  {
    id: 'CUMPLE',
    description: 'Cumple',
  },
];

@Component({
  selector: 'app-evaluation-select-field',
  templateUrl: './evaluation-select-field.component.html',
  styles: [],
})
export class EvaluationSelectFieldComponent implements ViewCell, OnInit {
  @Input() value: any = null;
  @Input() rowData: any = null;
  @Output() input: EventEmitter<any> = new EventEmitter();

  form: FormGroup = new FormGroup({});
  list = new DefaultSelect();
  readonly: boolean = false;

  private fb = inject(FormBuilder);
  private requestHelpService = inject(RequestHelperService);

  constructor() {
    this.list = new DefaultSelect(resultEvaList, resultEvaList.length);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      evaluation: [null],
    });

    if (this.value) {
      this.form.controls['evaluation'].setValue(this.value);
    }

    this.requestHelpService.currentReadOnly.subscribe(data => {
      if (data == true) {
        this.setReadOnly();
      }
    });
  }

  selectChange(event: any) {
    const value =
      this.form.get('evaluation').value == null
        ? ''
        : this.form.get('evaluation').value;
    this.input.emit({ row: this.rowData, text: value });
  }

  setReadOnly() {
    this.readonly = true;
  }
}

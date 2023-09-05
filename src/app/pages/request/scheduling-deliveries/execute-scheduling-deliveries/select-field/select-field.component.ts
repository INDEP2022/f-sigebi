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
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RequestHelperService } from '../../../request-helper-services/request-helper.service';

const data = [
  { id: 'FALTANTE', description: 'Faltante' },
  { id: 'DAÑADO', description: 'Dañado' },
];

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styles: [],
})
export class SelectFieldComponent extends BasePage implements ViewCell, OnInit {
  @Input() value: string = '';
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();
  form: FormGroup = new FormGroup({});
  list = new DefaultSelect();
  readonly: boolean = false;

  private fb = inject(FormBuilder);
  private requestHelpService = inject(RequestHelperService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      reason: [null],
    });
    this.list = new DefaultSelect(data, 2);
    this.form.controls['reason'].setValue(this.value);
    this.requestHelpService.currentReadOnly.subscribe(data => {
      if (data == true) {
        this.readonly = true;
      }
    });
  }

  selectChange(event: any) {
    const value = event.id;
    this.rowData.causeNotDelivered = value;
    this.input.emit({ row: this.rowData, selected: this.value });
  }
}

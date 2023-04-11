import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styles: [],
})
export class CheckboxComponent implements OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();
  inputText: String = '';
  isreadOnly: boolean = false;

  private requestHelperService = inject(RequestHelperService);
  constructor() {}

  ngOnInit(): void {
    this.requestHelperService.currentReadOnly.subscribe({
      next: resp => {
        this.isreadOnly = resp;
      },
    });
  }

  checked(event: any) {
    //console.log(event);
    let text = event.target.value;
    this.input.emit(this.rowData);
  }
}

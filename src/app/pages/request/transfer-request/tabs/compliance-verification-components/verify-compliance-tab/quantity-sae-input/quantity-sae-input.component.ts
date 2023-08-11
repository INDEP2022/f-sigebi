import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';

@Component({
  selector: 'app-quantity-sae-input',
  templateUrl: './quantity-sae-input.component.html',
  styles: [],
})
export class QuantitySaeInputComponent implements ViewCell, OnInit {
  constructor(requestHelperService: RequestHelperService) {}
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();
  isreadOnly: boolean = false;
  private requestHelperService = inject(RequestHelperService);
  ngOnInit(): void {
    this.requestHelperService.currentReadOnly.subscribe({
      next: resp => {
        this.isreadOnly = resp;
      },
    });
  }

  onKeyUp(event: any) {
    let text = event.target.value;
    this.input.emit({ data: this.rowData, text: text });
  }
}

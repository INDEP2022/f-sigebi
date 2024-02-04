import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';
import { Observable, Subject } from 'rxjs';
import { CommunicationService } from './communication-service/communication-service';

@Component({
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="isDisabled"
        #box
        id="checkbox-input"
        class="common-check custom-checkbox"
        [checked]="checked"
        (change)="onChange($event)"
        type="checkbox" />
    </div>
  `,
})
export class FilterCheckboxComponent<T = any>
  extends DefaultFilter
  implements OnChanges, OnInit
{
  public toggleAll$: Observable<any | undefined> | undefined;
  @Input() isDisabled: boolean;
  checked: boolean;
  @Output() toggle: EventEmitter<{ row: T; toggle: boolean }> =
    new EventEmitter();
  private _unsubscribeAll: Subject<void>;
  constructor(private communicationService: CommunicationService) {
    super();
  }
  ngOnInit(): void {}

  onChange($event: Event) {
    let toggle = ($event.currentTarget as HTMLInputElement).checked;
    this.changeValSelect(toggle);
    this.toggle.emit({ row: null, toggle });
  }

  ngOnChanges() {}
  async changeValSelect(bool: boolean) {
    this.communicationService.changeValSelect(bool);
  }
}

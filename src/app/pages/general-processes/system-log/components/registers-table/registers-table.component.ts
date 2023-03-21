import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'system-log-registers-table',
  templateUrl: './registers-table.component.html',
  styles: [],
})
export class RegistersTableComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() columns: any = {};
  @Input() params: BehaviorSubject<FilterParams>;
  @Input() totalItems = 0;
  @Input() registers: any[] = [];
  registerNum: number = null;
  constructor() {
    super();
    this.settings = { ...this.settings, actions: false };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registers']) {
      if (this.registers?.length == 0) {
        this.registerNum = null;
      }
    }
    if (changes['columns']) {
      if (this.columns) {
        const columns = {
          no_registro: {
            title: 'No. Regsitro',
            sort: false,
          },
          ...this.columns,
        };
        this.settings = { ...this.settings, columns };
      }
    }
  }

  ngOnInit(): void {}

  onSelectTable(row: any) {
    const { no_registro } = row;
    if (!no_registro) {
      this.registerNum = null;
      this.onLoadToast(
        'warning',
        'Advertencia',
        'El dato no tiene el número de registro'
      );
      return;
    }
    this.registerNum = Number(no_registro);
  }
}

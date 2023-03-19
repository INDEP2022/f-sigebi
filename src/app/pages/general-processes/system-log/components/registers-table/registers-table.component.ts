import { Component, Input, OnInit } from '@angular/core';
import { ITableField } from 'src/app/core/models/ms-audit/table-field.model';

@Component({
  selector: 'system-log-registers-table',
  templateUrl: './registers-table.component.html',
  styles: [],
})
export class RegistersTableComponent implements OnInit {
  @Input() fields: ITableField[] = [];
  constructor() {}

  ngOnInit(): void {}
}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { COORDINATIONS_COLUMNS } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance/interfaces/columns';

@Component({
  selector: 'app-recibe-form',
  templateUrl: './recibe-form.component.html',
  styles: [],
})
export class RecibeFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() formField: string;
  @Input() formFieldName: string;
  columnsType = COORDINATIONS_COLUMNS;
  operator = SearchFilter.EQ;
  constructor(public service: DelegationService) {}

  ngOnInit(): void {}
}

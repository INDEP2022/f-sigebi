import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TypeEvents } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance/interfaces/typeEvents';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectFormComponent } from '../select-form/select-form.component';

@Component({
  selector: 'app-proceeding-types-shared',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectFormComponent],
  templateUrl: './proceeding-types-shared.component.html',
  styles: [],
})
export class ProceedingTypesSharedComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formField: string = 'tipoEvento';
  @Input() label: string = 'Tipo de Evento';
  @Input() haveTodos = false;
  @Input() clearable = false;
  @Input() readonly = false;
  tiposEvento = TypeEvents;
  params: ListParams = new ListParams();
  constructor() {}

  ngOnInit(): void {}
}

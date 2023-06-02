import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { SelectModalTableSharedComponent } from '../select-modal-table-shared/select-modal-table-shared.component';

@Component({
  selector: 'app-safe-table-shared',
  standalone: true,
  imports: [CommonModule, SelectModalTableSharedComponent],
  templateUrl: './safe-table-shared.component.html',
  styles: [],
})
export class SafeTableSharedComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() disabled: boolean;
  @Input() label: string = 'No. Bóveda';
  @Input() labelName: string = 'Descripción de bóveda';
  @Input() formField: string = 'vaultId';
  @Input() formFieldName: string = 'vaultDescription';
  columnsType = {
    idSafe: {
      title: 'ID',
      type: 'string',
      sort: false,
    },
    description: {
      title: 'Descripción',
      type: 'string',
      sort: false,
    },
  };

  constructor(public service: SafeService) {}

  ngOnInit(): void {}
}

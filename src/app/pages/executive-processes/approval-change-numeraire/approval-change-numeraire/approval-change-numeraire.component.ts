import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-approval-change-numeraire',
  templateUrl: './approval-change-numeraire.component.html',
  styles: [],
})
export class ApprovalChangeNumeraireComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  selectedBien: any = null;
  bienItems = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getBien({ page: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [
        null,
        [
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      // description: [null, []],
      // status: [null, []],
      // applicant: [null, []],
      // reason: [null, []],
      // appDate: [null, []],
    });
  }

  data: any[] = [
    {
      id: 159,
      description: 'Productos de joyeria',
      status: 'Disponible',
      applicant: 'Miguel Angel Sandoval',
      reason: 'Contiene minerales bajo investigación',
      appDate: '01/05/2020',
    },
    {
      id: 897,
      description: 'Alfombra de piel',
      status: 'No disponible',
      applicant: 'Pedro Sosa',
      reason: 'Productos no aptos hechos con animales',
      appDate: '01/05/2020',
    },
    {
      id: 654,
      description: 'Automovil Nissan 4x4',
      status: 'Disponible',
      applicant: 'Juan Escutia',
      reason: 'Cambio de llanta en espera',
      appDate: '31/10/2018',
    },
  ];

  getBien(params: ListParams) {
    if (params.text == '') {
      this.bienItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.bienItems = new DefaultSelect(item[0], 1);
    }
  }

  selectBien(event: any) {
    this.selectedBien = event;
  }
}

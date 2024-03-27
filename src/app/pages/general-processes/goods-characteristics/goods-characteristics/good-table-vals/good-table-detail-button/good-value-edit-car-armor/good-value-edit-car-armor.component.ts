import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';
import { SharedModule } from '../../../../../../../shared/shared.module';

@Component({
  selector: 'app-good-value-edit-car-armor',
  standalone: true,
  templateUrl: './good-value-edit-car-armor.html',
  styleUrls: ['./good-value-edit-car-armor.component.css'],
  imports: [CommonModule, SharedModule],
})
export class GoodValueEditCarArmorComponent extends BasePage implements OnInit {
  test: any;
  armor: string;

  constructor(public modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      mode: 'inline',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'left',
      },
      columns: {
        options: {
          title: 'Opciones',
          type: 'string',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    console.log('test', this.test);
  }

  data = [{ options: 'Si' }, { options: 'No' }, { options: 'N/A' }];

  rowSelect(event: any) {
    console.log('Opción Seleccionada:', event.data.options);
    this.armor = event.data.options;
  }

  confirm() {
    const cadena = this.armor;
    console.log('Lo que se envia desde el modal: ', cadena);
    this.modalRef.content.callback(cadena);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}

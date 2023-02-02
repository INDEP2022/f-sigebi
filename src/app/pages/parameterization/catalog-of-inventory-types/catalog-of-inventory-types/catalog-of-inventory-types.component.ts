import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalCatalogOfInventoryTypesComponent } from '../modal-catalog-of-inventory-types/modal-catalog-of-inventory-types.component';

@Component({
  selector: 'app-catalog-of-inventory-types',
  templateUrl: './catalog-of-inventory-types.component.html',
  styles: [],
})
export class CatalogOfInventoryTypesComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: {
        number: {
          title: 'Numero',
          sort: false,
        },
        propertyInventory: {
          title: 'Atributo Inventario',
          sort: false,
        },
        dateType: {
          title: 'Tipo de Dato',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getPagination();
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      inventoryType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  openModal(context?: Partial<ModalCatalogOfInventoryTypesComponent>) {
    const modalRef = this.modalService.show(
      ModalCatalogOfInventoryTypesComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getData();
        this.onLoadToast('success', 'Guardado Correctamente', '');
      }
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      number: '3',
      propertyInventory: '2022',
      dateType: 1,
    },
    {
      number: '2',
      propertyInventory: '2022',
      dateType: 2,
    },
  ];

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Eliminado correctamente', '');
      }
    });
  }
}

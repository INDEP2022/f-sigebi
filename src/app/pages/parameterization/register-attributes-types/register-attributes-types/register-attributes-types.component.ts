import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegisterAttributesTypesModalComponent } from '../register-attributes-types-modal/register-attributes-types-modal.component';
import { REGISTER_ATT_TYPES_COLUMNS } from './register-attributes-types-columns';

@Component({
  selector: 'app-register-attributes-types',
  templateUrl: './register-attributes-types.component.html',
  styles: [],
})
export class RegisterAttributesTypesComponent
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
        delete: false,
        position: 'right',
      },
      columns: { ...REGISTER_ATT_TYPES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null, [Validators.required]],
      record: [null, [Validators.required]],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<RegisterAttributesTypesModalComponent>) {
    const modalRef = this.modalService.show(
      RegisterAttributesTypesModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
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
      cve: 1,
      attributes: 'Calle',
      description: 'Calle',
      typeDate: 'Alfanumérico',
      longMax: 80,
      update: true,
      unique: true,
      requerid: true,
      tableSupport: '',
    },
    {
      cve: 2,
      attributes: 'Colonia',
      description: 'Colonia',
      typeDate: 'Alfanumérico',
      longMax: 80,
      update: true,
      unique: false,
      requerid: true,
      tableSupport: '',
    },
    {
      cve: 3,
      attributes: 'Delegación o municipio',
      description: 'Municipio',
      typeDate: 'Alfanumérico',
      longMax: 80,
      update: true,
      unique: false,
      requerid: true,
      tableSupport: 'CAT_CIUDAD',
    },
    {
      cve: 4,
      attributes: 'Entidad federativa',
      description: 'Entidad federativa',
      typeDate: 'Alfanumérico',
      longMax: 80,
      update: true,
      unique: false,
      requerid: true,
      tableSupport: 'CAT_ENIFED',
    },
  ];
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CheckPermissionsNonWinnersComponent } from '../components/check-permissions-non-winners/check-permissions-non-winners.component';
import { CheckPermissionsWinnersComponent } from '../components/check-permissions-winners/check-permissions-winners.component';
import { CREATION_PERMISSIONS_COLUMNS } from './creation-permissions-columns';

@Component({
  selector: 'app-creation-permissions-modal',
  templateUrl: './creation-permissions-modal.component.html',
  styles: [],
})
export class CreationPermissionsModalComponent
  extends BasePage
  implements OnInit
{
  title: 'Permisos de Creación';
  isCollapsed: boolean = true;
  adding: boolean = false;
  selectedUser: any = null;
  userItems = new DefaultSelect();
  creationForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  creationColumns: any[] = [];
  creationSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  usersTestData = [
    {
      user: 'NESTEVEZ',
      name: 'NANCY ESTEVEZ',
    },
    {
      user: 'IJIMENEZ',
      name: 'IGNACIO JIMENEZ',
    },
    {
      user: 'PTORRES',
      name: 'PAMELA TORRES',
    },
    {
      user: 'MORTEGA',
      name: 'MARIO ORTEGA',
    },
    {
      user: 'PALVAREZ',
      name: 'PEDRO ALVAREZ',
    },
    {
      user: 'OHERNANDEZ',
      name: 'OLGA HERNANDEZ',
    },
    {
      user: 'SMARADIAGA',
      name: 'SANTIAGO MARADIAGA',
    },
    {
      user: 'FMENDOZA',
      name: 'FRANCISCO MENDOZA',
    },
  ];

  permissionsTestData = [
    {
      user: 'PALVAREZ',
      name: 'PEDRO ALVAREZ',
      createNonWinners: 'S',
      createWinners: 'N',
    },
    {
      user: 'OHERNANDEZ',
      name: 'OLGA HERNANDEZ',
      createNonWinners: 'S',
      createWinners: 'S',
    },
    {
      user: 'SMARADIAGA',
      name: 'SANTIAGO MARADIAGA',
      createNonWinners: 'N',
      createWinners: 'S',
    },
    {
      user: 'FMENDOZA',
      name: 'FRANCISCO MENDOZA',
      createNonWinners: 'S',
      createWinners: 'S',
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.creationSettings.columns = CREATION_PERMISSIONS_COLUMNS;
    this.creationSettings.columns = {
      ...this.creationSettings.columns,
      createNonWinners: {
        title: 'Crea Controles No Ganadores',
        type: 'custom',
        sort: false,
        renderComponent: CheckPermissionsNonWinnersComponent,
      },
      createWinners: {
        title: 'Crea Controles Ganadores',
        type: 'custom',
        sort: false,
        renderComponent: CheckPermissionsWinnersComponent,
      },
    };
  }

  ngOnInit(): void {
    this.getData();
    this.prepareForm();
    this.getUsers({ page: 1, text: '' });
  }

  private prepareForm(): void {
    this.creationForm = this.fb.group({
      user: [null, [Validators.required]],
      createNonWinners: [''],
      createWinners: [''],
    });
  }

  getData() {
    this.creationColumns = this.permissionsTestData;
    this.totalItems = this.creationColumns.length;
  }

  close() {
    this.modalRef.hide();
  }

  getUsers(params: ListParams) {
    if (params.text == '') {
      this.userItems = new DefaultSelect(this.usersTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.usersTestData.filter((i: any) => i.id == id)];
      this.userItems = new DefaultSelect(item[0], 1);
    }
  }

  showAdd() {
    this.adding = true;
    this.isCollapsed = false;
  }

  addPermission() {
    console.log(this.creationForm.value);
    // Llamar servicio para agregar
    this.creationForm.reset();
    this.adding = false;
    this.isCollapsed = true;
  }
}

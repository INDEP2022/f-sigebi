import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';
import { USUARIOS_COLUMNS } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance/interfaces/columns';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-elaborate-users-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './elaborate-users-shared.component.html',
  styles: [],
})
export class ElaborateUsersSharedComponent
  extends OpenModalListFiltered
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() label: string = 'Usuario';
  @Input() formField: string = 'usuario';
  @Input() formFieldName: string = 'userName';
  @Input() disabled = false;
  constructor(
    protected override modalService: BsModalService,
    private userService: UsersService
  ) {
    super(modalService);
  }

  ngOnInit(): void {}

  openModal() {
    this.openModalSelect(
      {
        title: 'Usuarios',
        columnsType: { ...USUARIOS_COLUMNS },
        service: this.userService,
        settings: { ...TABLE_SETTINGS },
        dataObservableFn: this.userService.getAllSegUsersModal,
        searchFilter: { field: 'id', operator: SearchFilter.LIKE },
      },
      this.selectUsuario
    );
  }

  selectUsuario(
    usuario: { id: string; name: string },
    self: ElaborateUsersSharedComponent
  ) {
    self.form.get(self.formField).setValue(usuario.id);
    if (self.form.get(self.formFieldName))
      self.form.get(self.formFieldName).setValue(usuario.name);
  }
}

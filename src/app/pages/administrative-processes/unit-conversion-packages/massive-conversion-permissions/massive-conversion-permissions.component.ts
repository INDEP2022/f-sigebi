import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITvaltables1 } from 'src/app/core/models/catalogs/tvaltable-model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MasiveConversionPermissionsDeleteComponent } from '../masive-conversion-permissions-delete/masive-conversion-permissions-delete.component';
import {
  PERMISSIONSUSER_COLUMNS,
  PRIVILEGESUSER_COLUMNS,
} from './massive-conversion-permissions-columns';
interface permissions {
  proy: boolean;
  val: boolean;
  aut: boolean;
  cerr: boolean;
  can: boolean;
}
@Component({
  selector: 'app-massive-conversion-permissions',
  templateUrl: './massive-conversion-permissions.component.html',
  styles: [],
})
export class MassiveConversionPermissionsComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };

  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  permissions: any;
  data2: LocalDataSource = new LocalDataSource();
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private usersService: UsersService,
    private tvalTable1Service: TvalTable1Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PERMISSIONSUSER_COLUMNS,
    };
    this.settings2.columns = PRIVILEGESUSER_COLUMNS;
  }

  selectEvent(data: any) {
    this.permissions = data.data;
  }
  ngOnInit(): void {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          this.params = this.pageFilter(this.params);
          this.getValuesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }

  close() {
    this.modalRef.hide();
  }

  getValuesAll() {
    let params = {
      ...this.params.getValue(),
    };

    this.tvalTable1Service.getById5All(params).subscribe({
      next: response => {
        this.data1.load(response.data);

        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openPermissionsDelete(data: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: false,
    };
    this.modalService.show(
      MasiveConversionPermissionsDeleteComponent,
      modalConfig
    );
  }

  selectUserPermissions(event: any) {
    let otkey = event.data.otKey;

    this.tvalTable1Service.getById6(otkey).subscribe({
      next: response => {
        if (response) {
          // Se encontraron registros
          this.permissions = this.convertirStringAObjeto(response.data.value);
          this.data2.load([
            {
              proy: this.permissions.proy,
              val: this.permissions.val,
              aut: this.permissions.aut,
              cerr: this.permissions.cerr,
              can: this.permissions.can,
              otkey,
            },
          ]);
        } else {
          // No se encontraron registros
          this.insertDataInTable(otkey);
        }
      },
      error: error => {
        // Error al obtener los registros
        this.insertDataInTable(otkey);
      },
    });
  }

  insertDataInTable(id: string) {
    this.data2.load([
      {
        proy: false,
        val: false,
        aut: false,
        cerr: false,
        can: false,
        id,
      },
    ]);
  }

  convertirObjetoAString(objeto: any) {
    const letras = ['P', 'V', 'A', 'C', 'X'];
    let cadena = '';

    letras.forEach((letra, index) => {
      const propiedad = Object.keys(objeto)[index];
      if (objeto[propiedad]) {
        cadena += letra + 'X-';
      } else {
        cadena += letra + '-';
      }
    });

    cadena = cadena.slice(0, -1);
    return cadena;
  }

  convertirStringAObjeto(cadena: string): permissions {
    const letras = ['P', 'V', 'A', 'C', 'X'];
    const valores = cadena.split('-');
    const objeto: any = {
      proy: false,
      val: false,
      aut: false,
      cerr: false,
      can: false,
    };

    letras.forEach((letra, index) => {
      const valor = valores[index];
      if (valor === letra || valor === letra + 'X') {
        const propiedad = Object.keys(objeto)[index];
        objeto[propiedad] = valor.length === 2 ? true : false;
      }
    });

    return objeto;
  }

  async saveOrUpdatePermissions() {
    let data: Partial<ITvaltables1> = {
      otkey: '',
      otvalor: '',
      nmtable: 0,
    };
    const permissions = this.convertirObjetoAString(this.permissions);
    data.otkey = this.permissions.otkey;
    data.otvalor = permissions;
    data.nmtable = 423;
    this.tvalTable1Service.updateTvalTable1(data).subscribe({
      next: response => {
        if (response) {
          // Se encontraron registros
          this.alert('success', 'Registro Actualizado', '');
        } else {
          // No se encontraron registros
          this.alert('error', 'Error al actualizar el registro', '');
        }
      },
    });
  }
}
// let config: ModalOptions = {
//   initialState: {
//     data,
//     callback: (next: boolean) => { },
//   },
//   class: 'modal-xl modal-dialog-centered',
//   ignoreBackdropClick: true,
// };
// this.modalService.show(MassiveConversionPermissionsComponent, config);
// const modalRef = this.modalService.show(
//   MasiveConversionPermissionsDeleteComponent,
//   {
//     class: 'modal-lg modal-dialog-centered',
//     ignoreBackdropClick: true,
//   }
// );

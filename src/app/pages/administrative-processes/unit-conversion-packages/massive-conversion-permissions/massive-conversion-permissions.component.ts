import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  ITvaltable1,
  ITvaltables1,
} from 'src/app/core/models/catalogs/tvaltable-model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SelectElementComponent } from 'src/app/shared/components/select-element-smarttable/select-element';
import { MasiveConversionPermissionsDeleteComponent } from '../masive-conversion-permissions-delete/masive-conversion-permissions-delete.component';
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
      columns: {
        value: {
          title: 'Usuario',
          sort: false,
        },
        user: {
          title: 'Nombre',
          sort: false,
        },
        abbreviation: {
          title: 'Valida',
          sort: false,
          type: 'custom',
          renderComponent: SelectElementComponent,
          /* OnComponentInitFunction: (instance: SelectElementComponent) => {
            this.onSelectRow(instance);
          }, */
          onComponentInitFunction: (instance: any) => {
            const values = [
              { value: 'S', msg: 'Sí' },
              { value: 'N', msg: 'No' },
              { value: null, msg: '' },
            ];
            instance.values.emit(values);
            instance.toggle.subscribe((data: any) => {
              data.row.abbreviation = data.toggle == '' ? null : data.toggle;
              const model: ITvaltables1 = {
                nmtable: 422,
                otkey: data.row.otKey.toString(),
                otvalor: data.row.value,
                registerNumber: data.row.numRegister,
                abbreviation: data.row.abbreviation.value,
              };
              console.log(model);
              this.tvalTable1Service.updateTvalTable1(model).subscribe(
                res => {
                  this.alert(
                    'success',
                    'Fue Actualizado el Dato de Usuario',
                    ''
                  );
                },
                err => {
                  this.alert('error', 'Se Presentó un Error Inesperado', '');
                }
              );
            });
          },
        },
        proy: {
          title: 'PROY.',
          width: '5%',
          sort: false,
          showAlways: true,
          filter: false,
          editable: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            instance.toggle.subscribe((data: any) => {
              data.row.proy = data.toggle;
              const cve = this.createPer(
                data.row.proy,
                data.row.val,
                data.row.aut,
                data.row.cerr,
                data.row.can
              );
              console.log(cve);
              this.update423(data, cve);
            });
          },
        },
        val: {
          title: 'VAL.',
          width: '5%',
          sort: false,
          showAlways: true,
          filter: false,
          editable: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            instance.toggle.subscribe((data: any) => {
              data.row.val = data.toggle;
              const cve = this.createPer(
                data.row.proy,
                data.row.val,
                data.row.aut,
                data.row.cerr,
                data.row.can
              );
              console.log(cve);
              this.update423(data, cve);
            });
          },
        },
        aut: {
          title: 'AUT.',
          width: '5%',
          sort: false,
          showAlways: true,
          filter: false,
          editable: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            instance.toggle.subscribe((data: any) => {
              data.row.aut = data.toggle;
              const cve = this.createPer(
                data.row.proy,
                data.row.val,
                data.row.aut,
                data.row.cerr,
                data.row.can
              );
              console.log(cve);
              this.update423(data, cve);
            });
          },
        },
        cerr: {
          title: 'CERR.',
          width: '5%',
          sort: false,
          showAlways: true,
          filter: false,
          editable: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            instance.toggle.subscribe((data: any) => {
              data.row.cerr = data.toggle;
              const cve = this.createPer(
                data.row.proy,
                data.row.val,
                data.row.aut,
                data.row.cerr,
                data.row.can
              );
              console.log(cve);
              this.update423(data, cve);
            });
          },
        },
        can: {
          title: 'CAN.',
          width: '5%',
          sort: false,
          showAlways: true,
          filter: false,
          editable: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            instance.toggle.subscribe((data: any) => {
              data.row.can = data.toggle;
              const cve = this.createPer(
                data.row.proy,
                data.row.val,
                data.row.aut,
                data.row.cerr,
                data.row.can
              );
              console.log(cve);
              this.update423(data, cve);
            });
          },
        },
      },
    };
    /* this.settings2.columns = PRIVILEGESUSER_COLUMNS; */
  }

  createPer(
    proy: boolean,
    val: boolean,
    aut: boolean,
    cerr: boolean,
    can: boolean
  ) {
    let newCve: string = '';
    try {
      proy ? (newCve = 'P') : (newCve = 'PX');
      val ? (newCve = `${newCve}-V`) : (newCve = `${newCve}-VX`);
      aut ? (newCve = `${newCve}-A`) : (newCve = `${newCve}-AX`);
      cerr ? (newCve = `${newCve}-C`) : (newCve = `${newCve}-CX`);
      can ? (newCve = `${newCve}-X`) : (newCve = `${newCve}-XX`);
    } catch (error) {
    } finally {
      return newCve;
    }
  }

  update423(generalData: any, cve: string) {
    const data = generalData.row;
    const model: ITvaltables1 = {
      nmtable: 423,
      otkey: data.otKey,
      otvalor: cve,
      registerNumber: data.numRegister,
      abbreviation: data.abbreviation,
    };
    console.log(model);
    this.tvalTable1Service.updateTvalTable1(model).subscribe(
      res => {
        this.alert('success', 'Fue Actualizado el Dato de Usuario', '');
      },
      err => {
        this.tvalTable1Service.createTvalTable1(model).subscribe(
          res => {
            this.alert('success', 'Se Generaron Permisos para el Usuario', '');
          },
          err => {
            this.alert('error', 'Se Presentó un Error Inesperado', '');
            generalData.toggle = false;
          }
        );
      }
    );
  }

  onSelectRow(instance: SelectElementComponent) {
    instance.values.emit(['S', 'N', '']);

    instance.toggle.subscribe((data: any) => {
      data.row.abbreviation = data.toggle == '' ? null : data.toggle;
      const model: ITvaltable1 = {
        table: 422,
        otKey: data.row.otKey,
        value: data.row.value,
        numRegister: data.row.numRegister,
        abbreviation: data.row.abbreviation,
      };
      console.log(model);
      this.tvalTable1Service.updateTvalTable1(model).subscribe(
        res => {
          this.alert('success', 'Fue Actualizado el Dato de Usuario', '');
        },
        err => {
          this.alert('error', 'Se Presentó un Error Inesperado', '');
        }
      );
    });
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
    this.loading = true;
    let params = {
      ...this.params.getValue(),
    };

    this.tvalTable1Service.getById5All(params).subscribe({
      next: async response => {
        console.log(response.data);

        const perUser = await Promise.all(
          response.data.map(async (e: any) => {
            const dataResp = await this.selectUserPermissions(e);
            const respPer = JSON.parse(JSON.stringify(dataResp));
            return {
              ...e,
              proy: respPer.proy,
              val: respPer.val,
              aut: respPer.aut,
              cerr: respPer.cerr,
              can: respPer.can,
            };
          })
        );
        // this.data1.load(response.data);
        this.data1.load(perUser);
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

  async selectUserPermissions(event: any) {
    return new Promise((resolve, reject) => {
      let otkey = event.otKey;
      console.log(event);
      this.tvalTable1Service.getById6(otkey).subscribe({
        next: response => {
          if (response) {
            // Se encontraron registros
            this.permissions = this.convertirStringAObjeto(response.data.value);
            resolve({
              proy: this.permissions.proy,
              val: this.permissions.val,
              aut: this.permissions.aut,
              cerr: this.permissions.cerr,
              can: this.permissions.can,
            });
            /* this.data2.load([
              {
                proy: this.permissions.proy,
                val: this.permissions.val,
                aut: this.permissions.aut,
                cerr: this.permissions.cerr,
                can: this.permissions.can,
                otkey,
              },
            ]); */
          } else {
            // No se encontraron registros
            resolve({
              proy: false,
              val: false,
              aut: false,
              cerr: false,
              can: false,
            });
          }
        },
        error: error => {
          // Error al obtener los registros
          resolve({
            proy: false,
            val: false,
            aut: false,
            cerr: false,
            can: false,
          });
        },
      });
    });
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
        objeto[propiedad] = valor.length === 2 ? false : true;
      }
    });
    console.log(objeto);
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

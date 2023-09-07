import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-edit-modal-conf',
  templateUrl: './edit-modal-conf.component.html',
  styles: [],
})
export class EditModalConfComponent extends BasePage implements OnInit {
  form: ModelForm<any>;
  data: any;
  user1 = new DefaultSelect();
  edit: boolean = false;

  @Output() refresh = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private usersService: UsersService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.data) {
      console.log('this.data -> ', this.data);
      console.log(' his.data.dateRenderDecoDev ', this.data.dateRenderDecoDev);
      console.log(
        'this.data.promoterUserDecoDevo ',
        this.data.promoterUserDecoDevo
      );
      console.log(
        'Fecha Formateada ',
        this.formatDate(this.data.dateRenderDecoDev)
      );
      console.log('promoterUserDecoDevo ', this.data.promoterUserDecoDevo);
      this.form.patchValue({
        fecha:
          this.data.dateRenderDecoDev != null
            ? this.formatDate(this.data.dateRenderDecoDev)
            : null,
      });

      if (this.data.promoterUserDecoDevo != null) {
        //this.params(this.data.promoterUserDecoDevo);
      }
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      promoter: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    /*const model: any = {
      inventoryNumber: this.form.get('noInventario').value,
      //goodNumber: this.goodId,
      dateInventory: this.form.get('fechaInventario').value,
      responsible: this.form.get('responsable').value,
    };*/

    let item = {
      id: this.data.id,
      goodId: this.data.goodId,
      scheduledDateDecoDev:
        this.formatDate2(this.form.get('fecha').value) == null
          ? this.data.dateRenderDecoDev
          : this.formatDate2(this.form.get('fecha').value),
      promoterUserDecoDevo: this.form.get('promoter').value,
    };
    console.log('item a upd-> ', item);
    this.goodService.updateGood(item).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp UpdateGood-> ', resp);
          this.alert('success', '', 'Registros Actualizados Correctamente');
          this.close();
        }
      },
      err => {
        this.alert('error', '', 'Error al Actualizar Registros');
      }
    );
  }

  params(user: any) {
    let params = {
      page: 1,
      limit: 10,
      'filter.user': `$ilike:${user}`,
    };
    this.getAllSegUserFind(params);
  }

  getAllSegUser1(params: ListParams) {
    console.log('params: ', params);
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  getAllSegUserFind(params: ListParams) {
    console.log('params: ', params);
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        console.log('resp data ', resp.data[0]);
        //this.user1.data = resp.data[0];
        this.form.get('promoter').setValue(resp.data[0]);
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  formatDate(fecha: string) {
    const fecha_original = new Date(fecha);
    // Obtener los componentes de fecha (día, mes, año)
    const dia = fecha_original.getUTCDate();
    const mes = (fecha_original.getUTCMonth() + 1).toString().padStart(2, '0'); // Añade cero inicial si es necesario
    const año = fecha_original.getUTCFullYear();
    // Formatear la fecha en el nuevo formato DD/MM/YYYY
    const nuevo_formato = `${dia}/${mes}/${año}`;
    return nuevo_formato;
  }

  formatDate2(fecha: string) {
    const fecha_original = new Date(fecha);
    // Obtener los componentes de fecha (día, mes, año)
    const dia = fecha_original.getUTCDate();
    const mes = (fecha_original.getUTCMonth() + 1).toString().padStart(2, '0'); // Añade cero inicial si es necesario
    const año = fecha_original.getUTCFullYear();
    // Formatear la fecha en el nuevo formato DD/MM/YYYY
    return `${año}-${mes}-${dia}`;
  }
}

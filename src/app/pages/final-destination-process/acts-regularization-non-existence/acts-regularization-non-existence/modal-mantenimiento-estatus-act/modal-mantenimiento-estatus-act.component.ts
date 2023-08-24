import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNSESTATUS } from './columns';

@Component({
  selector: 'app-modal-mantenimiento-estatus-act',
  templateUrl: './modal-mantenimiento-estatus-act.component.html',
  styles: [],
})
export class ModalMantenimientoEstatusActComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private modalRef: BsModalRef,
    private screenStatusService: ScreenStatusService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNSESTATUS;
  }

  ngOnInit(): void {
    let obj = {
      vc_pantalla: 'FACTDESACTASRIF',
    };

    this.screenStatusService.getAllFiltroScreenKey(obj).subscribe({
      next: (response: any) => {
        console.log(response);
        const { data } = response;
        this.data.load(data);

        console.log(' data[0].statusFinal.status ', data[0].statusFinal.status);
      },
      error: () => {
        this.alertInfo('error', 'Atención', 'No se encontraron datos');
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}

import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS } from './table-check-portal-columns';

@Component({
  selector: 'app-table-check-portal-dialog',
  templateUrl: './table-check-portal-dialog.component.html',
  styleUrls: ['./table-check-portal-dialog.component.css'],
})
export class TableCheckPortalDialogComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //data: LocalDataSource = new LocalDataSource();
  datacheck: any;

  loadingBtn: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,

      columns: { ...COLUMNS },
    };
  }

  ngOnInit() {}

  export() {
    let copiaArray = this.datacheck.map(objeto => ({ ...objeto }));
    copiaArray.forEach(objeto => {
      objeto.CreadoPor = objeto.cretedBy;
      delete objeto.cretedBy;

      objeto.Registros = objeto.records;
      delete objeto.records;

      objeto.Importe = objeto.amount;
      delete objeto.amount;

      objeto.FechaValidacion = objeto.validation;
      delete objeto.validation;

      objeto.Creador = objeto.creador;
      delete objeto.creador;

      /*objeto.cretedBy = 'Creado por';
      objeto.records = 'Registros';
      objeto.amount = 'Importe'*/
    });
    console.log('Chques', copiaArray);

    const filename: string = 'Cheques';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(copiaArray, { filename });
    this.loadingBtn = true;
  }

  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}

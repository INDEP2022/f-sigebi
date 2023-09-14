import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { JuridicalFileUpdateService } from '../../../file-data-update/services/juridical-file-update.service';
import { COLUMNS_OFICIO } from '../columns';

@Component({
  selector: 'app-listoficios',
  templateUrl: './listoficios.component.html',
  styles: [],
})
export class ListoficiosComponent extends BasePage implements OnInit {
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() dataText = new EventEmitter<any>();
  dataEdit: any;
  noVolante_: any;
  form: FormGroup = new FormGroup({});
  settings1 = { ...this.settings };
  data1: any = [];
  dictumSeleccionada: any;
  params: any = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private datePipe: DatePipe,
    private modalRef: BsModalRef,
    public fileUpdateService: JuridicalFileUpdateService,
    private mJobManagementService: MJobManagementService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS_OFICIO },
    };
  }

  ngOnInit(): void {
    this.checkOficio(this.noVolante_);
  }

  async checkOficio(data: any) {
    this.loading = true;
    let params = {
      ...this.params,
    };
    params['filter.flyerNumber'] = `$eq:${data}`;

    this.mJobManagementService.getAll(params).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['dateOficio'] = this.datePipe.transform(
            item.insertDate,
            'dd/MM/yyyy'
          );
        });

        this.data1 = data.data;

        console.log('DATA DICTAMENES MODAL', data);
        this.loading = false;
      },
      error: error => {
        this.data1 = [];
        this.loading = false;
        console.log('ERR', error.error.message);
      },
    });
  }

  selectProceedings(event: any) {
    console.log('EVENT', event);
    this.dictumSeleccionada = event.data;
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    const data = {
      data: this.dictumSeleccionada,
    };

    this.loading = false;
    // this.refresh.emit(true);
    this.dataText.emit(data);
    this.modalRef.hide();
  }
}

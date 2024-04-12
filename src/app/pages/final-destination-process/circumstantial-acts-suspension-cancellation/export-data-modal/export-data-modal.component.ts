import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IPupLaunchReport,
  ProceedingSusPcancelService,
} from 'src/app/core/services/ms-proceedings/proceeding-suspcancel.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-export-data-modal',
  templateUrl: './export-data-modal.component.html',
  styleUrls: [],
})
export class ExportDataModal extends BasePage implements OnInit {
  form: FormGroup;
  expedientNumber: string;
  proceedingNumber: string;
  data = new DefaultSelect();

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private proceedingSusCanService: ProceedingSusPcancelService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.expedientNumber);
    this.initForms();
    this.getProceedingsList();
  }

  initForms() {
    this.form = this.fb.group({
      proceddingsList: [null],
    });
  }

  getData(e: ListParams) {
    console.log(e);
  }

  close() {
    this.bsModalRef.hide();
  }

  getProceedingsList() {
    this.proceedingSusCanService
      .preblockListProceedings(this.expedientNumber)
      .subscribe(
        res => {
          console.log(res);
          this.data = new DefaultSelect(res.data);
        },
        err => {
          console.log(err);
          this.alert(
            'error',
            'Error',
            'Error al obtener la lista de procedimientos'
          );
        }
      );
  }

  exportFile() {
    if (this.form.get('proceddingsList').value == null) {
      this.alert('warning', 'Debe seleccionar una opción', '');
      return;
    }

    const body: IPupLaunchReport = {
      minuteList: this.form.get('proceddingsList').value.minutesKey,
      minutesNumber: this.proceedingNumber,
      proceedingsNumber: this.expedientNumber,
    };

    this.proceedingSusCanService.pupLaunchReport(body).subscribe(
      res => {
        console.log(res);
        this._downloadExcelFromBase64(res.base64File, res.nameFile);
      },
      err => {
        console.log(err);
        this.alert('error', 'Error', 'Error al exportar el archivo');
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-jp-d-rr-c-return-ruling',
  templateUrl: './jp-d-rr-c-return-ruling.component.html',
  styles: [],
})
export class JpDRrCReturnRulingComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data: any = [
    {
      numberGood: 'Bien 1',
      description: 'Descripcion del bien 1',
      dateReceived: '02/07/2022',
      status: 'Estatus 1',
    },
    {
      numberGood: 'Bien 1',
      description: 'Descripcion del bien 1',
      dateReceived: '02/07/2022',
      status: 'Estatus 1',
    },
    {
      numberGood: 'Bien 1',
      description: 'Descripcion del bien 1',
      dateReceived: '02/07/2022',
      status: 'Estatus 1',
    },
    {
      numberGood: 'Bien 1',
      description: 'Descripcion del bien 1',
      dateReceived: '02/07/2022',
      status: 'Estatus 1',
    },
  ];
  //Reactive Forms
  form: FormGroup;

  get numberFile() {
    return this.form.get('numberFile');
  }
  get causePenal() {
    return this.form.get('causePenal');
  }
  get preliminaryInquiry() {
    return this.form.get('preliminaryInquiry');
  }
  get dateReturn() {
    return this.form.get('dateReturn');
  }
  get numberGood() {
    return this.form.get('numberGood');
  }
  get description() {
    return this.form.get('description');
  }
  get statusGood() {
    return this.form.get('statusGood');
  }
  get statusRuling() {
    return this.form.get('statusRuling');
  }
  get observation() {
    return this.form.get('observation');
  }

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        numberGood: {
          title: 'Cve Documento',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          sort: false,
        },
        dateReceived: {
          title: 'Fecha Recibió',
          sort: false,
        },
        status: {
          title: 'Estatus',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      numberFile: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      preliminaryInquiry: [null, [Validators.required]],
      dateReturn: [null, [Validators.required]],
      numberGood: [null, [Validators.required]],
      description: [null, [Validators.required]],
      statusGood: [null, [Validators.required]],
      statusRuling: [null, [Validators.required]],
      observation: [null, [Validators.required]],
    });
  }

  approve() {
    this.onLoadToast('success', 'Aprobado', '');
  }
}

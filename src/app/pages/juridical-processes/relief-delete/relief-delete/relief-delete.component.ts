/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { INotificationDictum } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-relief-delete',
  templateUrl: './relief-delete.component.html',
  styleUrls: ['./relief-delete.component.scss'],
})
export class ReliefDeleteComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  selectWheel = new DefaultSelect<any>();
  ltrModel: string = '';
  constructor(
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noVolante: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      noExpediente: [''],
      cveDictamen: ['', Validators.required],
    });
  }
  listWheels(params?: ListParams) {
    params['filter.wheelNumber'] = `$eq:${params.text}`;

    this.notificationService.getAllWithFilter(params).subscribe({
      next: (data: any) => {
        console.log('RESSSS', data);

        this.selectWheel = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log('', error);
        this.selectWheel = new DefaultSelect();
      },
    });
  }
  getWheel(item: any) {
    this.loading = true;
    console.log('ITEM', item);

    if (item != undefined) {
      this.loading = false;

      if (item.dictumKey == null || item.dictumKey == '') {
        this.onLoadToast(
          'warning',
          'Desahogo',
          'El volante no tiene desahogo por borrar'
        );
      } else {
        this.form.get('noExpediente').setValue(item.expedientNumber);
        this.form.get('cveDictamen').setValue(item.dictumKey);
      }
    } else {
      this.cleanForm();
    }
  }
  cleanForm() {
    this.form.get('noVolante').setValue('');
    this.form.get('noExpediente').setValue('');
    this.form.get('cveDictamen').setValue('');
  }
  btnBorrarDesahogo() {
    let idWheel = this.form.get('noVolante').value;

    const WheelObj: INotificationDictum = {
      dictumKey: null,
    };

    this.notificationService.update(idWheel, WheelObj).subscribe({
      next: (data: any) => {
        if (data) {
          this.cleanForm();
          this.onLoadToast(
            'success',
            'Desahogo',
            'El desahogo se ha borrado con éxito'
          );
          this.selectWheel = new DefaultSelect();
        }
      },
      error: error => {
        this.onLoadToast('success', 'Desahogo', error.error.message);
      },
    });
  }
}

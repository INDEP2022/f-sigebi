import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { compensationService } from 'src/app/core/services/compensation-option/compensation.option';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-register-dictum-val',
  templateUrl: './register-dictum-val.component.html',
  styles: [],
})
export class RegisterDictumValComponent extends BasePage implements OnInit {
  validateForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<boolean>();

  @Input() requestId = null;

  respDoc: Object;

  private requestService = inject(RequestService);
  private compenstionService = inject(compensationService);

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.getAllCompensation();
    this.getRequestInfo();
  }

  prepareForm() {
    this.validateForm = this.fb.group({
      opinionNumber: [null, [Validators.required]],
      veredict: [null, [Validators.required]],
      nullityTrial: [null, [Validators.required]],
    });
  }

  getAllCompensation() {
    // Llamar servicio para obtener informacion de la documentacion de la orden
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${this.requestId}`;
    this.compenstionService
      .getAllcompensation(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          if (!isNullOrEmpty(resp)) {
            this.respDoc = resp;
            this.validateForm.patchValue({
              opinionNumber: resp.opinionNumber,
              veredict: resp.veredict,
              nullityTrial: resp.nullityTrial,
            });
          }
        },
      });
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion de la documentacion de la solicitud
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.requestId}`;
    this.requestService
      .getAll(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          this.respDoc = resp;
        },
      });
  }

  createCompensation(compens: Object) {
    this.compenstionService.createcompensation(compens).subscribe({
      next: resp => {
        this.onSave.emit(true);
        this.getRequestInfo();
        this.onLoadToast('success', 'Datos de dictamen guardados con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo guardar los datos del dictamen');
      },
    });
  }

  updatedCompensation(compens: Object) {
    this.compenstionService.updatecompensation(compens).subscribe({
      next: resp => {
        this.onSave.emit(true);
        this.getRequestInfo();
        this.onLoadToast('success', 'Datos de dictamen actualizados con éxito');
      },
      error: error => {
        this.onLoadToast(
          'error',
          'No se pudo actualizar los datos del dictamen'
        );
      },
    });
  }
  save() {
    let date = new Date();
    let object = this.validateForm.getRawValue();

    object['requestId'] = this.requestId;
    object['orderDate'] = date.toISOString();
    this.onSave.emit(true);

    if (isNullOrEmpty(this.respDoc)) {
      this.createCompensation(object);
    } else {
      this.updatedCompensation(object);
    }
  }
}

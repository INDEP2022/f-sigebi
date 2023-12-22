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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-register-dictum-val',
  templateUrl: './register-dictum-val.component.html',
  styles: [],
})
export class RegisterDictumValComponent extends BasePage implements OnInit {
  maxDate: Date = new Date();

  dictumForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<boolean>();

  @Input() requestId = null;

  @Input() steap1: boolean = false;
  @Input() steap2: boolean = false;
  @Input() steap3: boolean = false;
  @Input() isEdit: boolean = false;

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
    this.dictumForm = this.fb.group({
      datetime: [null, [Validators.required]],
      place: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      opinionNumber: [null, [Validators.required]],
      veredict: [null, [Validators.required]],
      nullityTrial: [null, [Validators.required]],

      contributor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paymentAmount: [null],
      dictumDate: [null],

      adminiResolutionNo: [null],
      paymentOrderNo: [null],
      address1: [null, [Validators.pattern(STRING_PATTERN)]],
      address2: [null, [Validators.pattern(STRING_PATTERN)]],
      legalRepresentative: [null, [Validators.pattern(STRING_PATTERN)]],
      requiredSatCopy: [null],
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
            this.dictumForm.patchValue({
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
    let object = this.dictumForm.getRawValue();

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

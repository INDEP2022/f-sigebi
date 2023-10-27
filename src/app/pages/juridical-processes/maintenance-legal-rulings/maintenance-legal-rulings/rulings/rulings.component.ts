/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { HasMoreResultsComponent } from 'src/app/@standalone/has-more-results/has-more-results.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-rulings',
  templateUrl: './rulings.component.html',
})
export class RulingsComponent extends BasePage implements OnInit, OnDestroy {
  @Output() formValues = new EventEmitter<any>();
  params: any;

  form = new FormGroup({
    id: new FormControl(null),
    passOfficeArmy: new FormControl('', [
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
    expedientNumber: new FormControl(null, [Validators.required]),
    typeDict: new FormControl(''),
    statusDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    dictDate: new FormControl(null),
    userDict: new FormControl('', [
      Validators.pattern(STRING_PATTERN),
      Validators.required,
    ]),
    observations: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    delegationDictNumber: new FormControl(null),
    areaDict: new FormControl(null, [Validators.pattern(STRING_PATTERN)]),
    instructorDate: new FormControl(),
    esDelit: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    wheelNumber: new FormControl(null),
    notifyAssuranceDate: new FormControl(null),
    resolutionDate: new FormControl(null),
    notifyResolutionDate: new FormControl(null),
    folioUniversal: new FormControl(null, [
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
    entryDate: new FormControl(null),
    dictHcDAte: new FormControl(null),
    entryHcDate: new FormControl(null),
  });
  searchForm = new FormGroup({
    id: new FormControl(''),
    typeDict: new FormControl(''),
  });

  constructor(
    // private fb: FormBuilder,
    private dictationService: DictationService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.loading = true;
  }

  // private prepareForm() {
  //   this.searchForm = this.fb.group({
  //     id: ['', Validators.required],
  //     typeDict: '',
  //   });
  // }

  fillData(data: any) {
    this.form.patchValue(data);
    console.log(this.form.value);
    console.log(this.searchForm.value);
    this.form.get('id').patchValue(this.searchForm.get('id').value);
    this.form.get('typeDict').patchValue(data.typeDict);
    this.searchForm.get('typeDict').patchValue(data.typeDict);
    const value = this.form.value;
    this.form
      .get('dictDate')
      .patchValue(value.dictDate ? new Date(value.dictDate) : null);
    this.form
      .get('entryDate')
      .patchValue(value.entryDate ? new Date(value.entryDate) : null);
    this.form
      .get('entryHcDate')
      .patchValue(value.entryHcDate ? new Date(value.entryHcDate) : null);
    this.form
      .get('instructorDate')
      .patchValue(value.instructorDate ? new Date(value.instructorDate) : null);
    this.form
      .get('notifyResolutionDate')
      .patchValue(
        value.notifyResolutionDate ? new Date(value.notifyResolutionDate) : null
      );
    this.form
      .get('notifyAssuranceDate')
      .patchValue(
        value.notifyAssuranceDate ? new Date(value.notifyAssuranceDate) : null
      );
    this.form
      .get('resolutionDate')
      .patchValue(value.resolutionDate ? new Date(value.resolutionDate) : null);
    this.form
      .get('dictHcDAte')
      .patchValue(value.dictHcDAte ? new Date(value.dictHcDAte) : null);
    this.emitChange();
  }

  setFormData() {
    // const dictationNumber = this.searchForm.get('id').value;
    const params = new ListParams();
    const { id, typeDict } = this.searchForm.value;
    id && (params['filter.id'] = id);
    typeDict && (params['filter.typeDict'] = typeDict);
    this.dictationService.getAll(params).subscribe({
      next: res => {
        if (res.count == 1) {
          this.fillData(res.data[0]);
        } else if (res.count > 1) {
          this.openMoreOneResults(res);
        }
        // const data = res.data[0];
      },
      error: err => {
        this.form.reset();
        console.log(err);
        this.onLoadToast('warning', '', 'No se encontró el dictamen');
      },
    });
  }

  generateParamsSearchDictation() {
    const { id, typeDict } = this.searchForm.value;
    const params: any = {};
    id && (params['filter.id'] = id);
    // id && (params['filter.id'] = expedientNumber);
    typeDict && (params['filter.typeDict'] = typeDict);
    return params;
  }

  openMoreOneResults(data?: IListResponse<any>) {
    let context: Partial<HasMoreResultsComponent> = {
      queryParams: this.generateParamsSearchDictation(),
      columns: {
        id: {
          title: 'Identificador',
          sort: false,
        },
        passOfficeArmy: {
          title: 'Clave Armada',
          sort: false,
        },
        expedientNumber: {
          title: 'No. de Expediente',
          sort: false,
        },
        wheelNumber: {
          title: 'No. de Volante',
          sort: false,
        },
        typeDict: {
          title: 'Tipo de Dictamen',
          sort: false,
        },
        status: {
          title: 'Estatus',
          sort: false,
        },
      },
      totalItems: data ? data.count : 0,
      ms: 'dictation',
      path: 'dictation',
    };

    console.log({ context });

    const modalRef = this.modalService.show(HasMoreResultsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onClose.pipe(take(1)).subscribe((result: any) => {
      console.log({ result });
      if (result) {
        this.fillData(result);
      }
    });
  }

  public emitChange() {
    this.formValues.emit(this.form.value);
  }

  resetForm() {
    this.form.reset();
    this.searchForm.reset();
  }

  send() {
    this.dictationService.update(this.form.value).subscribe({
      next: data => {
        this.alert(
          'success',
          'Se ha agregado la información correctamente',
          ''
        );
      },
      error: err => {
        this.alert('error', 'No se ha podido agregar la información', '');
      },
    });
  }
}

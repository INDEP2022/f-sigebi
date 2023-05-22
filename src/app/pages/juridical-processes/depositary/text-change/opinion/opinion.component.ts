import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IDictation,
  IDictationCopies,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styles: [],
})
export class OpinionComponent extends BasePage implements OnInit, OnChanges {
  form: FormGroup = this.fb.group({
    expedientNumber: [null, [Validators.required]],
    registerNumber: [null, [Validators.required]],
    wheelNumber: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    typeDict: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    senderUserRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
    addressee: [null, [Validators.pattern(STRING_PATTERN)]],
    addressee_I: [null, [Validators.pattern(STRING_PATTERN)]],
    paragraphInitial: [null, [Validators.pattern(STRING_PATTERN)]],
    paragraphFinish: [null, [Validators.pattern(STRING_PATTERN)]],
    paragraphOptional: [null, [Validators.pattern(STRING_PATTERN)]],
    descriptionSender: [null, [Validators.pattern(STRING_PATTERN)]],
    typePerson: [null, [Validators.required]],
    senderUser: [null, null],
    personaExt: [null, null],
    typePerson_I: [null, null],
    senderUser_I: [null, null],
    personaExt_I: [null, null],

    key: [
      null,
      [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
    ],
    numberDictamination: [null, [Validators.required]],
  });
  intIDictation: IDictation;
  localInterfazOfficialDictation: IOfficialDictation;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  options: any[];
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  UserDestinatario: ISegUsers[] = [];
  nameUserDestinatario: ISegUsers;
  verBoton: boolean = false;
  filterParamsLocal = new BehaviorSubject<FilterParams>(new FilterParams());

  //===================
  users$ = new DefaultSelect<ISegUsers>();
  @Input() oficnum: number | string;

  constructor(
    private fb: FormBuilder,
    private oficialDictationService: OficialDictationService,
    private dictationService: DictationService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabServiceReport: SiabService,
    private usersService: UsersService,
    private dynamicCatalogsService: DynamicCatalogsService
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.oficnum != null) {
      this.form.get('expedientNumber').setValue(this.oficnum);
      this.buscardictamen();
    }
  }

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'S', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
    this.loadUserDestinatario();
    this.buildForm();
    this.form.get('typePerson').valueChanges.subscribe(value => {
      if (value === 'S') {
        this.form.get('senderUser').setValue(null);
      } else {
        this.form.get('senderUser').setValue('');
      }
    });
    this.form.get('typePerson_I').valueChanges.subscribe(value => {
      if (value === 'S') {
        this.form.get('senderUser_I').setValue(null);
      }
    });
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  buscardictamen() {
    this.filterParamsLocal.getValue().removeAllFilters();
    if (!this.form.get('expedientNumber').invalid) {
      if (!(this.form.get('expedientNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'expedientNumber',
            this.form.get('expedientNumber').value,
            SearchFilter.EQ
          );
      }
    }
    if (!this.form.get('registerNumber').invalid) {
      if (!(this.form.get('registerNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'registerNumber',
            this.form.get('registerNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if (!this.form.get('wheelNumber').invalid) {
      if (!(this.form.get('wheelNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'wheelNumber',
            this.form.get('wheelNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if (!this.form.get('typeDict').invalid) {
      if (!(this.form.get('typeDict').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'typeDict',
            this.form.get('typeDict').value,
            SearchFilter.EQ
          );
      }
    }
    this.onEnterSearch(this.filterParamsLocal);
    this.verBoton = true;
  }

  onEnterSearch(filterParams: BehaviorSubject<FilterParams>) {
    this.dictationService
      .findByIdsOficNum(filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('findByIdsOficNum =>>  ' + JSON.stringify(resp.data[0]));
          this.intIDictation = resp.data[0];
          console.warn(JSON.stringify(this.intIDictation));
          this.form.get('expedientNumber').setValue(this.intIDictation.id);
          this.form
            .get('registerNumber')
            .setValue(this.intIDictation.expedientNumber);
          this.form.get('wheelNumber').setValue(this.intIDictation.wheelNumber);
          this.form.get('typeDict').setValue(this.intIDictation.statusDict);
          this.form.get('key').setValue(this.intIDictation.registerNumber);
          let obj = {
            officialNumber: this.intIDictation.id,
            typeDict: this.intIDictation.typeDict,
          };
          this.complementoFormulario(obj);
        },
        error: err => {
          this.onLoadToast('error', 'error', err.error.message);
        },
      });

    //dictation?filter.id=486064
  }
  /*================================================================================
carga la  información de la parte media de la página
==================================================================================*/
  complementoFormulario(obj: any) {
    console.log(' Obj => ' + JSON.stringify(obj));
    this.oficialDictationService.getById(obj).subscribe({
      next: resp => {
        //console.log(" 2 => " + JSON.stringify(resp));
        console.log('getById =>>  ' + JSON.stringify(resp));
        this.form.get('senderUserRemitente').setValue(resp.sender);
        this.form.get('addressee').setValue(resp.recipient);
        this.getPuestoUser(resp.cveChargeRem);
        this.form.get('addressee_I').setValue(resp.sender);
        this.form.get('numberDictamination').setValue(resp.officialNumber);
        this.form.get('paragraphInitial').setValue(resp.text1);
        this.form.get('paragraphFinish').setValue(resp.text2);
        this.form.get('paragraphOptional').setValue(resp.text3);
        this.form.get('descriptionSender').setValue(resp.desSenderPa);
        this.getPersonaExt_Int();
      },
      error: error => {
        this.onLoadToast('error', 'error', error.error.message);
      },
    });
  }
  /*=========================================================================
         Carga los usuarios para mandar a imprimir el reporte
===========================================================================*/
  loadUSers() {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter(
        'numberOfDicta',
        this.form.value.expedientNumber,
        SearchFilter.EQ
      );
    this.dictationService
      .findUserByOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          let datos: IDictationCopies[] = resp.data;

          this.form.get('senderUser').setValue(datos[0].namePersonExt);
          this.nrSelecttypePerson = datos[0].personExtInt === 'S' ? 'S' : 'I';

          this.form.get('senderUser').setValue(datos[1].namePersonExt);
          this.nrSelecttypePerson_I = datos[1].personExtInt === 'S' ? 'S' : 'I';
        },
        error: error => {
          this.onLoadToast('error', 'error', error.error.message);
        },
      });
  }
  getPersonaExt_Int() {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter(
        'numberOfDicta',
        this.form.value.expedientNumber,
        SearchFilter.EQ
      );
    this.dictationService
      .findUserByOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log(' =>>> ' + JSON.stringify(resp.data));
          console.log(
            '<======[[ _________________________________________ ]]=======>'
          );

          this.nrSelecttypePerson = resp.data[0].personExtInt;
          this.nrSelecttypePerson_I = resp.data[1].personExtInt;
          console.log(
            'this.nrSelecttypePerson = resp.data[0].personExtInt' +
              resp.data[0].personExtInt
          );
          console.log(
            'this.nrSelecttypePerson_I = resp.data[0].personExtInt' +
              resp.data[1].personExtInt
          );
          this.form.get('typePerson').setValue(this.nrSelecttypePerson);
          this.form.get('typePerson_I').setValue(this.nrSelecttypePerson_I);

          this.form.get('personaExt').setValue(resp.data[0].namePersonExt);
          this.form.get('personaExt_I').setValue(resp.data[1].namePersonExt);
        },
        error: errror => {
          this.onLoadToast('error', 'Error', errror.error.message);
        },
      });
  }

  /*===========================================================
          FORMULARIO
==============================================================*/
  private buildForm() {
    //this.form
  }

  /*====================================================================
             método para mandar a llamar el reporte
=======================================================================*/
  public confirm() {
    const params = {
      PNOOFICIO: this.form.value.expedientNumber,
      PTIPODIC: this.form.value.typeDict,
    };
    this.siabServiceReport.fetchReport('RGENABANDEC', params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  validaCampos(event: Event) {}
  loadUserDestinatario() {
    this.usersService.getUsersJob().subscribe({
      next: resp => {
        this.UserDestinatario = [...resp.data];
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  getDescUser(control: string, event: Event) {
    this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    if (control === 'control') {
      this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    } else {
      this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    }
  }

  nuevaBusquedaOficio() {
    this.cleanfields();
  }

  cleanfields() {
    this.form.reset();
    this.verBoton = false;
    this.filterParamsLocal.getValue().removeAllFilters();
  }

  getPuestoUser(idCode: string) {
    this.dynamicCatalogsService.getPuestovalue(idCode).subscribe({
      next: resp => {
        this.form.get('charge').setValue(resp.data.value);
      },
      error: err => {
        this.form.get('charge').setValue('');
        this.onLoadToast('error', 'Error', err.error.message);
      },
    });
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  updateDictamen() {}

  getDatosToUpdateDictamen(f: FormGroup) {
    return {
      id: f.value.expedientNumber,
      expedientNumber: f.value.registerNumber,
      wheelNumber: f.value.wheelNumber,
      typeDict: f.value.typeDict,
      registerNumber: f.value.key,

      /*  statusDict: f.value.,
  userDict: f.value.,
  observations:f.value.,
  registerNumber:f.value.registerNumber,
  keyArmyNumber: f.value.,*/
    };
  }

  /*
          this.form.get('').setValue(this.intIDictation.id);
          this.form.get('').setValue(this.intIDictation.expedientNumber);
          this.form.get('wheelNumber').setValue(this.intIDictation.wheelNumber);
          this.form.get('typeDict').setValue(this.intIDictation.statusDict);
          this.form.get('key').setValue(this.intIDictation.registerNumber);*/

  /* 
 this.dictationService
      .updateByIdDictament({})
      .subscribe({
        next: resp => {
          
          this.form.get('expedientNumber').setValue(this.intIDictation.id);
          this.form.get('registerNumber').setValue(this.intIDictation.expedientNumber);
          this.form.get('wheelNumber').setValue(this.intIDictation.wheelNumber);
          this.form.get('typeDict').setValue(this.intIDictation.statusDict);
          this.form.get('key').setValue(this.intIDictation.registerNumber);
         // let obj = { officialNumber: this.intIDictation.id, typeDict: this.intIDictation.typeDict, };
         // this.complementoFormulario(obj);
        },
        error: err => {
          this.onLoadToast('error', 'error', err.error.message);
        },
      });




  console.log("=====>=====>=====>=====>  "  + JSON.stringify( this.form.value));
}*/
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styles: [],
})
export class OpinionComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  intIDictation: IDictation;
  localInterfazOfficialDictation: IOfficialDictation;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  options: any[];
  nrSelecttypePerson: string;
  nrSelecttypePerson_I: string;

  constructor(
    private fb: FormBuilder,
    private oficialDictationService: OficialDictationService,
    private dictationService: DictationService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabServiceReport: SiabService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'S', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  onEnterSearch() {
    let params = new FilterParams();
    params.addFilter('id', this.form.value.expedientNumber, SearchFilter.EQ);
    this.dictationService.findByIdsOficNum(params.getParams()).subscribe({
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
        console.log(err);
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
        this.form.get('senderUser').setValue(resp.sender);
        this.form.get('addressee').setValue(resp.recipient);
        this.form.get('charge').setValue(resp.cveChargeRem);
        this.form.get('addressee_I').setValue(resp.sender);
        this.form.get('numberDictamination').setValue(resp.officialNumber);
        this.form.get('paragraphInitial').setValue(resp.text1);
        this.form.get('paragraphFinish').setValue(resp.text2);
        this.form.get('paragraphOptional').setValue(resp.text3);
        this.form.get('descriptionSender').setValue(resp.desSenderPa);
        this.loadUSers();
      },
      error: error => {
        console.log(JSON.stringify(error));
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
          console.log('loadUSers()', error);
        },
      });
  }

  /*===========================================================
          FORMULARIO
==============================================================*/
  private buildForm() {
    this.form = this.fb.group({
      expedientNumber: [null, [Validators.required]],
      registerNumber: [null, [Validators.required]],
      wheelNumber: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeDict: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphInitial: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphFinish: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphOptional: [null, [Validators.pattern(STRING_PATTERN)]],
      descriptionSender: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typePerson: [null, [Validators.required]],
      senderUser: [null, [Validators.required]],
      typePerson_I: [null, [Validators.required]],
      senderUser_I: [null, [Validators.required]],
      key: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      numberDictamination: [null, [Validators.required]],
    });
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
}

/*

  confirm() {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    console.log(this.form.value);
    setTimeout((st: any) => {
      this.loading = false;
    }, 5000); }


*/

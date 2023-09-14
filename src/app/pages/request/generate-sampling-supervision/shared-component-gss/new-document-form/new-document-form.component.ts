import {
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';

@Component({
  selector: 'app-new-document-form',
  templateUrl: './new-document-form.component.html',
  styleUrls: ['./new-document-form.component.scss'],
})
export class NewDocumentFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef;
  documentForm: ModelForm<any>;
  fileToUpload: File | null = null;
  sizeMessage: boolean = false;

  typeDocSelected: any = []; //new DefaultSelect();
  stateSelected = new DefaultSelect();
  typeTranferSelected = new DefaultSelect();
  regionalDelegationSelected = new DefaultSelect();

  //datos pasados por el modal
  data: any[] = [];
  typeComponent: string = '';
  isDisable: boolean = false;
  delegationId: number = null;
  stateId: number = null;

  private wcontentService = inject(WContentService);
  private regionalDelegationService = inject(RegionalDelegationService);
  private stateService = inject(DelegationStateService);
  private transferentService = inject(TransferenteService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    /*if (this.typeComponent === 'verify-noncompliance') {
      this.isDisable = false;
    }*/
    this.initForm();
    this.getTypeDocSelect();
    this.getRegionalDelegationSelect(new ListParams());
    this.documentForm.get('xidBien').setValue(this.data[0].goodId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
  }

  initForm(): void {
    this.documentForm = this.fb.group({
      xtipoDocumentov: [null],
      noDoc: [null],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      xidBien: [{ value: null, disabled: true }],
      xresponsable: [null, [Validators.pattern(STRING_PATTERN)]],
      xIdSIAB: [null],
      xcontribuyente: [null, [Validators.pattern(STRING_PATTERN)]],
      xDelegacionRegional: [{ value: '', disabled: this.isDisable }],
      xnoOficio: [null],
      xestado: [null],
      xNoProgramacion: [null],
      xtipoTransferencia: [null],
      xFolioProgramacion: [null],
      xremitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xComments: [null, [Validators.pattern(STRING_PATTERN)]],
      xcargoRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
      //author: [null],
      //version: [null],
    });
  }

  selectFile(event: any): void {
    this.fileToUpload = event.target.files[0];
    let size = this.fileToUpload.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
      return;
    } else {
      console.log(this.fileToUpload);
    }
  }

  getTypeDocSelect(event?: any) {
    const params = new ListParams();
    this.wcontentService.getDocumentTypes(params).subscribe({
      next: resp => {
        this.typeDocSelected = resp.data;
      },
    });
  }

  getStateSelect(event: ListParams) {
    const params = new ListParams();
    params['filter.regionalDelegation'] = this.delegationId;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });
      const states = filterStates.map(items => {
        return items.stateCode;
      });
      this.stateSelected = new DefaultSelect(states, data.count);
    });
  }

  changeState(data: any) {
    if (data != undefined) {
      this.stateId = data.id;
      this.getTypeTranferSelect(new ListParams());
    } else {
      this.stateSelected = new DefaultSelect(null);
      this.documentForm.get('xestado').setValue(null);
      this.typeTranferSelected = new DefaultSelect(null);
      this.documentForm.get('xtipoTransferencia').setValue(null);
    }
  }

  getTypeTranferSelect(event: ListParams) {
    const params = new ListParams();
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    params['filter.typeTransferent'] = `$eq:NO`;
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        this.typeTranferSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getRegionalDelegationSelect(event: ListParams) {
    const params = new ListParams();
    params.text = event.text;
    this.regionalDelegationService.getAll(params).subscribe({
      next: resp => {
        this.regionalDelegationSelected = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
    });
  }

  changeRegionalDele(event: any) {
    if (event != undefined) {
      this.delegationId = event.id;
      this.getStateSelect(new ListParams());
    } else {
      this.stateSelected = new DefaultSelect(null);
      this.documentForm.get('xestado').setValue(null);
    }
  }

  close(): void {
    this.modalRef.hide();
  }

  save() {
    const form = this.documentForm.getRawValue();
    const noDocum = form.dDocTitle;
    form.dSecurityGroup = 'Public';
    (form.dInDate = this.setDate()),
      this.wcontentService
        .addDocumentToContent(
          noDocum,
          '.pdf',
          JSON.stringify(form),
          this.fileToUpload,
          '.pdf'
        )
        .subscribe({
          next: resp => {
            this.messageSuccess();
          },
          error: error => {
            this.onLoadToast('error', 'No se cargo el archivo');
          },
        });
  }

  messageSuccess() {
    const message = 'Documento agregado exitosamente';
    Swal.fire({
      icon: 'success',
      title: 'Información',
      text: message,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Aceptar',
      footer: '',
      allowOutsideClick: false,
    });
  }

  setDate() {
    const date = new Date();
    return moment(date).format('DD-MMM-YYYY');
  }
}

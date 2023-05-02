import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SendingOfEMailsComponent } from '../sending-of-e-mails/sending-of-e-mails.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-jp-d-mc-c-maintenance-of-coverages',
  templateUrl: './jp-d-mc-c-maintenance-of-coverages.component.html',
  styles: [],
})
export class JpDMcCMaintenanceOfCoveragesComponent
  extends BasePage
  implements OnInit
{
  e_mail: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [];
  form: FormGroup;

  get flyerNumber() {
    return this.form.get('flyerNumber');
  }
  get fileNumber() {
    return this.form.get('fileNumber');
  }
  get dateReception() {
    return this.form.get('dateReception');
  }
  get transferorsNumber() {
    return this.form.get('transferorsNumber');
  }
  get cveOficioExt() {
    return this.form.get('cveOficioExt');
  }
  get dateOficioExt() {
    return this.form.get('dateOficioExt');
  }
  get externalSender() {
    return this.form.get('externalSender');
  }
  get cveCoverages() {
    return this.form.get('cveCoverages');
  }
  get cveTouchesPenal() {
    return this.form.get('cveTouchesPenal');
  }
  get detailedReport() {
    return this.form.get('detailedReport');
  }
  get preliminaryInvestigation() {
    return this.form.get('preliminaryInvestigation');
  }
  get criminalCase() {
    return this.form.get('criminalCase');
  }
  get subject() {
    return this.form.get('subject');
  }
  get subjectDescription() {
    return this.form.get('subjectDescription');
  }
  get defendant() {
    return this.form.get('defendant');
  }
  get defendantDescription() {
    return this.form.get('defendantDescription');
  }
  get publicMinistry() {
    return this.form.get('publicMinistry');
  }
  get publicMinistryDescription() {
    return this.form.get('publicMinistryDescription');
  }
  get court() {
    return this.form.get('court');
  }
  get courtDescription() {
    return this.form.get('courtDescription');
  }
  get delegation() {
    return this.form.get('delegation');
  }
  get delegationDescription() {
    return this.form.get('delegationDescription');
  }
  get federativeOrganization() {
    return this.form.get('federativeOrganization');
  }
  get federativeOrganizationDescription() {
    return this.form.get('federativeOrganizationDescription');
  }
  get city() {
    return this.form.get('city');
  }
  get cityDescription() {
    return this.form.get('cityDescription');
  }
  get transferor() {
    return this.form.get('transferor');
  }
  get transferorDescription() {
    return this.form.get('transferorDescription');
  }
  get broadcaster() {
    return this.form.get('broadcaster');
  }
  get broadcasterDescription() {
    return this.form.get('broadcasterDescription');
  }
  get authority() {
    return this.form.get('authority');
  }
  get authorityDescription() {
    return this.form.get('authorityDescription');
  }
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
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
      flyerNumber: [null, [Validators.required]],
      fileNumber: [null, [Validators.required]],
      dateReception: [null, [Validators.required]],
      transferorsNumber: [null, [Validators.required]],
      cveOficioExt: [null, [Validators.required]],
      dateOficioExt: [null, [Validators.required]],
      externalSender: [null, [Validators.required]],
      cveCoverages: [null, [Validators.required]],
      cveTouchesPenal: [null, [Validators.required]],
      detailedReport: [null, [Validators.required]],
      preliminaryInvestigation: [null, [Validators.required]],
      criminalCase: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      subjectDescription: [null, [Validators.required]],
      defendant: [null, [Validators.required]],
      defendantDescription: [null, [Validators.required]],
      publicMinistry: [null, [Validators.required]],
      publicMinistryDescription: [null, [Validators.required]],
      court: [null, [Validators.required]],
      courtDescription: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      delegationDescription: [null, [Validators.required]],
      federativeOrganization: [null, [Validators.required]],
      federativeOrganizationDescription: [null, [Validators.required]],
      city: [null, [Validators.required]],
      cityDescription: [null, [Validators.required]],
      transferor: [null, [Validators.required]],
      transferorDescription: [null, [Validators.required]],
      broadcaster: [null, [Validators.required]],
      broadcasterDescription: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      authorityDescription: [null, [Validators.required]],
    });
  }

  openModal(): void {
    const modal = this.modalService.show(SendingOfEMailsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modal.content.refresh.subscribe(resp => {
      console.log(resp);
    });
  }
}

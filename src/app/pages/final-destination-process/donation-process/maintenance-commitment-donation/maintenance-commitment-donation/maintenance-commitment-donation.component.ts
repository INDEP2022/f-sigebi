import { Component, OnInit } from '@angular/core';
import { COLUMNS_DATA_TABLE } from '../data-in-table/columns-data-table';
import { BasePage } from 'src/app/core/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUnits } from 'src/app/core/models/administrative-processes/siab-sami-interaction/measurement-units';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
import { MeasuremenUnitsModalComponent } from 'src/app/pages/administrative-processes/administration-third/measurement-units/measuremen-units-modal/measuremen-units-modal.component';
import { MaintenanceCommitmentDonationModalComponent } from '../maintenance-commitment-donation-modal/maintenance-commitment-donation-modal.component';

@Component({
  selector: 'app-maintenance-commitment-donation',
  templateUrl: './maintenance-commitment-donation.component.html',
  styles: [],
})
export class MaintenanceCommitmentDonationComponent extends BasePage implements OnInit {

  dataSelect: any;
  form: FormGroup = new FormGroup({});
  newOrEdit: boolean = false;


  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,

  ) {
    super();
  }

  ngOnInit(): void {

  }
  /*update() {
    let bool = false;
    this.loadModal(bool);
  }

  loadModal(bool: boolean) {
    if (bool != false) {
      this.openModal(true, this.dataSelect);
    } else {
      this.openModal(false, this.dataSelect);
    }
  }

  openModal(newOrEdit: boolean, data: any) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      data,
      callback: (next: boolean) => {
        //if (next) this.getAllUnits();
      },
    };
    this.modalService.show(MaintenanceCommitmentDonationModalComponent, modalConfig);
  }

  prepareForm() {
    this.form = this.fb.group({
      labelId: ['', Validators.required],
      status: ['', Validators.required],
      desStatus: ['', Validators.required],
      transfereeId: ['', Validators.required],
      desTrans: ['', Validators.required],
      clasifId: ['', Validators.required],
      desClasif: ['', Validators.required],
      unit: ['', Validators.required],
    });

    if ((this.newOrEdit = true)) {
      //  this.form.controls['unit'].disable();
    }
  }

  onRowSelect(event: any) {
    //console.log(event);
    this.dataSelect = event;
    console.log(this.dataSelect);
    let bool = true;
    this.loadModal(bool);
  }
*/}

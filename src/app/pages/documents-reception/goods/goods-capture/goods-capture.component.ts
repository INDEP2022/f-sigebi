import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { of, switchMap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
import { GoodsCaptureMain } from './goods-capture-main';
import {
  COMPENSATION_GOOD_CLASIF_NUMBER,
  FLYERS_REGISTRATION_CODE,
} from './utils/good-capture-constants';
import {
  EXPEDIENT_IS_SAT,
  TRANSFER_NULL_RECIVED,
} from './utils/goods-capture-messages';

@Component({
  selector: 'app-goods-capture',
  templateUrl: './goods-capture.component.html',
  styles: [],
})
export class GoodsCaptureComponent extends GoodsCaptureMain implements OnInit {
  constructor(
    fb: FormBuilder,
    modalService: BsModalService,
    goodsCaptureService: GoodsCaptureService,
    activatedRoute: ActivatedRoute,
    router: Router
  ) {
    super(fb, modalService, goodsCaptureService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.getInitalParameter().subscribe({
      next: () => this.initialParameterFound(),
    });
  }

  initialParameterFound() {
    if (this.isCalledFrom(FLYERS_REGISTRATION_CODE)) {
      this.whenIsCalledFromFlyers();
      this.fillGoodFromParameters();
    } else {
      this.selectExpedient();
    }
    this.fillSatSubject();
  }

  fillSatSubject() {
    const countBody = {
      officeKey: this.params.pOfficeNumber,
      expedient: this.params.satSubject,
    };
    const lenghtBody = {
      jobNumber: this.params.pOfficeNumber,
      businessSat: this.params.satSubject,
    };
    if (this.global.pIndicadorSat == 0) {
      this.goodsCaptureService
        .getSatInterfaceCountByExpedient(countBody)
        .subscribe({
          next: response => {
            this.vCount = response.count;
          },
          error: () => (this.vCount = 0),
        })
        .add(() => {
          if (this.vCount != 0) {
            this.formControls.satIndicator.setValue(1);
            this.disableFields(['noPartida']);
          }
          this.goodsCaptureService
            .getSatLengthByJobSubject(lenghtBody)
            .subscribe({
              next: response => {
                this.vPartida = response.sat_no_partida;
                console.log(this.vPartida);
                this.fillPgrSubject();
              },
              error: error => {
                if (error.status == 404) {
                  this.vPartida = 0;
                } else {
                  this.showError('No se encontro el dato de la partida');
                  this.focusInput('type');
                }
              },
            });
        });
    } else if (this.global.pIndicadorSat == 1) {
      console.log('indicador sat 1');
      this.formControls.satIndicator.setValue(0);
      const countBody = { officeKey: this.params.pOfficeNumber };
      const lengthBody = { jobNumber: this.params.pOfficeNumber };
      this.goodsCaptureService
        .getCountByOffice(countBody)
        .subscribe({
          next: response => {
            this.vCount = response.asunto;
          },
          error: () => {
            this.vCount = 0;
          },
        })
        .add(
          this.goodsCaptureService.getLengthByJob(lengthBody).subscribe({
            next: response => {
              this.vPartida = response.sat_no_partida;
              console.log(this.vPartida);
              this.fillPgrSubject();
            },
            error: error => {
              this.vPartida = 0;
              this.showError('No se encontro el dato de la partida');
              this.focusInput('type');
            },
          })
        );
    }
  }

  fillPgrSubject() {
    // TODO: implementar el ms
    of(1)
      .subscribe({
        next: type => {
          this.type = type;
        },
        error: error => {
          this.type = 0;
        },
      })
      .add(() => {
        if (this.type != 0) {
          if (this.vPartida >= 7) {
            console.log('Entra a validar sat');
            // PUP_VALIDA_SAT
            this.validateSat();
          } else {
            console.log('entra a llenar datos');
            // PUP_LLENA_DATOS
            this.fillData();
          }
        }
      });
  }

  whenIsCalledFromFlyers() {
    if (this.global.noTransferente == null) {
      this.showError(TRANSFER_NULL_RECIVED);
      this.router.navigate(['/pages/general-processes/work-mailbox']);
      return;
    }

    if (this.global.gNoExpediente != null) {
      // ? No hace nada
      // this.getExpedientById(this.global.gNoExpediente as number).subscribe();
      // .add({
      //  this.validateExpedient()
      // });
    }
  }

  /**
   * validateExpedient() {
    this.goodsCaptureService
      .getGoodsByRecordId(Number(this.global.gNoExpediente))
      .subscribe({
        next: response => {
          console.log(response);
          this.vExp = response.count;
        },
      });
  }
   * 
   */

  // ? ---------- La pantalla es llamanda desde el menú

  selectExpedient() {
    const modalConfig: ModalOptions = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (
          expedient: IRecord,
          isCompany: boolean,
          goodCompany?: number
        ) => {
          this.afterSelectExpedient(expedient, isCompany, goodCompany);
        },
      },
    };
    this.showSelectRecord(modalConfig);
  }

  afterSelectExpedient(
    expedient: IRecord,
    isCompany: boolean,
    companyGood?: number
  ) {
    const companyCtrl = this.assetsForm.controls.esEmpresa;
    const expedientNum = this.assetsForm.controls.noExpediente;
    this.global.gNoExpediente = expedient.idExpedient;
    companyCtrl.setValue(isCompany);
    expedientNum.setValue(Number(expedient.idExpedient));
    this.focusInput('noClasifBien');
    this.getMaxPaperWork(expedient).subscribe({
      next: max => this.validateMaxPaperwork(max),
    });
    if (this.global.gnuActivaGestion == '1') {
      this.getMaxFlyerFromNotifications(expedient);
    }
    this.setIdenParam(expedient.identifies);
  }

  getMaxFlyerFromNotifications(record: IRecord) {
    this.goodsCaptureService
      .getMaxFlyerFromRecord(record.idExpedient)
      .subscribe({
        next: value => {
          this.formControls.flyerNumber.setValue(value.no_volante);
        },
      });
  }

  async validateMaxPaperwork(max: number) {
    if (max == 2) {
      const response = await this.isCompensationGoodDialog();
      if (!response.isConfirmed) {
        this.showError(EXPEDIENT_IS_SAT);
        return;
      }
      this.getCompensationGood();
    }
  }

  areTypesRequired() {
    if (this.assetsForm.controls.esEmpresa.value) {
      this.typesRequired(true);
      this.focusInput('cantidad');
    } else {
      this.global.gNoExpediente = this.assetsForm.controls.noExpediente.value;
      this.typesRequired(false);
      this.focusInput('noClasifBien');
    }
  }

  getCompensationGood() {
    this.getGoodTypesByClasifNum(COMPENSATION_GOOD_CLASIF_NUMBER).subscribe({
      next: () => {
        this.disableElementsWhenGoodCompensation();
        this.focusInput('cantidad');
      },
    });
  }

  goodClasifNumberChange() {
    const clasifNum = this.formControls.noClasifBien.value;
    if (!clasifNum) {
      return;
    }
    if (this.formControls.satIndicator.value == 0) {
    }
    if (this.formControls.satIndicator.value == 1) {
    }
    if (this.formControls.satIndicator.value == null) {
      const clasifNum = this.formControls.noClasifBien.value;
      this.getGoodTypesByClasifNum(clasifNum)
        .pipe(switchMap(() => this.getGoodFeaturesByClasif(clasifNum)))
        .subscribe();
    }
  }

  save() {
    this.assetsForm.markAllAsTouched();
  }

  // PUP_VALIDATE_SAT
  validateSat() {
    let satCveUnique: number = null;
    if (this.global.pIndicadorSat == 0) {
      // TODO: Implementar consultas
      this.validateSatCveUnique(satCveUnique);
    } else if (this.global.pIndicadorSat == 1) {
      // TODO: Implementar consultas
      this.validateSatCveUnique(satCveUnique);
    } else {
      this.validateSatCveUnique(satCveUnique);
    }
  }

  validateSatCveUnique(satCveUnique: number) {
    /** 
     *     IF :BIENES.CVE_UNICA_SAT IS NULL THEN
        :BIENES.CVE_UNICA_SAT := C_SAT_CVE_UNICA;
        :BIENES.INVENTARIO := C_SAT_CVE_UNICA;
    END IF;
    this.global.satCveUnique = satCveUnique
     */
    let long: number;
    if (!satCveUnique) {
      return;
    }
    if (this.global.pIndicadorSat == 0) {
      // TODO: volver a hacer consultas de vPartida
      // long = this.vPartida;
      this.validateLong(long);
    } else if (this.global.pIndicadorSat == 1) {
      // TODO: volver a hacer consultas de vPartida
      // long = this.vPartida
      this.validateLong(long);
    }
  }

  validateLong(long: number) {
    if (long == 8) {
      if (this.global.pIndicadorSat == 0) {
        return;
      }

      if (this.global.pIndicadorSat == 1) {
        return;
      }
      return;
    }

    if (long == 7) {
      if (this.global.pIndicadorSat == 0) {
        return;
      }

      if (this.global.pIndicadorSat == 1) {
        return;
      }
      return;
    }

    if (long == 7 || long == 8) {
      // obtener partidas
      this.setLigieUnit();
      const goodClasifNum = this.formControls.noClasifBien.value;
      if (goodClasifNum != null) {
        if (goodClasifNum == 1427) {
          // marcar error
          return;
        }
        this.formControls.requery.setValue('S');
        // get tipos descripcion etc etc
        // ? Se puede pasar a type change
        const type = this.formControls.type.value;
        if (this.global.noTransferente == 121 && type != 5) {
          this.showError(
            'Para esta transferente solamente se pueden capturar muebles'
          );
          // throw error
        }
        if (this.global.noTransferente == 123 && type != 6) {
          this.showError(
            'Para esta transferente solamente se pueden capturar inmuebles'
          );
          // throw error
        }
        // fill types
        // IF goodclasifnum in 1424, 1426, 1590
        if (goodClasifNum == 1424) {
          this.formControls.cantidad.setValue(1);
        }

        // TODO: Hacer consultas para cada uno
        let nSAtTypeExpedient;
        let vSatRefIncumple;
        if (vSatRefIncumple == 0) {
          this.formControls.destino.setValue(1);
        } else {
          // foreach raro para obtener la etiqueta
          // y obtner la desc etiqueta
        }
        if (this.global.pIndicadorSat) {
          this.disableFields([]);
        } else {
          // this.enableFields([])
        }
      }
    }
  }

  setLigieUnit() {
    // FUP_SSF3_UNID_LIGIE
    // this.formControls.unidadLigie.setValue
  }

  // PUP_LLENA_DATOS
  fillData() {
    // ? LA consulta que se va a implementar ya se ejecuta antes
    // ? se podria declarar un objeto global con la respuesta para no hacerla otra vez
    // of({vSubject, paperWorkType, vOfficeNumber})
    of({}).subscribe({
      next: () => {
        let vSubject;
        let paperWorkType;
        let vOfficeNumber;
        // get from temp exp
        if (paperWorkType == 3) {
          this.fillDataPgr();
          return;
        }

        let partida;
        // select from sat_transferencia
        if (partida && vSubject) {
          if (paperWorkType == 2) {
            // select tipos subtipos etc
            // select descripcion y observaciones
            // select unidad de medida
            this.params.iden = 'TRANS';
            return;
          }
          return;
        }
        if (paperWorkType == 2) {
          if (vSubject) {
            this.formControls.cantidad.setValue(1);
            let lClasif: number;
            let clasif;
            if (lClasif <= 4) {
              this.formControls.noClasifBien.setValue(clasif);
            } else {
              this.formControls.noClasifBien.setValue(null);
            }
            this.formControls.cantidad.setValue(1);
            this.params.iden = 'TRANS';
          } else {
            this.formControls.cantidad.setValue(1);
            let lClasif: number;
            let clasif;
          }
        }
      },
    });
  }

  // PUP_LLENA_DATOS_PGR
  fillDataPgr() {}
}

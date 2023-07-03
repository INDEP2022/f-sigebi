export class pupValidMasivDto {
  available: string;
  diCoinNew: string;
  screenKey: string;
  goodNumber: number;
  convType: string;
  sellPrice: number;
  pTransGood: number;
  availableMasive: string;
}

export class pupChargeCsvDto {
  chain: string;
  screenKey: string;
  masiveNumber: number[];
}

declare const HttpStatus: any;
class Test {
  validNum(screenKey: string, goodNumber: number) {
    return Promise.resolve('S');
  }
  async pupValidaMasiv2(
    goods: pupValidMasivDto[],
    screenKey: string,
    convType: string,
    pTransGood: number,
    diCoinNew?: number
  ) {
    try {
      for (const good of goods) {
        if (good.available == 'S') {
          if (
            !diCoinNew &&
            (await this.validNum(screenKey, good.goodNumber)) == 'S'
          ) {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: ['Debe especificar el tipo de moneda.', 'S'],
            };
          }
          if (
            ((await this.validNum(screenKey, good.goodNumber)) == 'S' &&
              !['CNE', 'BBB'].includes(convType)) ||
            ((await this.validNum(screenKey, good.goodNumber)) == 'N' &&
              convType == 'CNE')
          ) {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: [
                'El tipo de conversión seleccionado no es permitido para este bien: ' +
                  good.goodNumber,
              ],
            };
          }
          if (!good?.sellPrice || good?.sellPrice == 0) {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: [
                'Agregue el precio de venta del bien ' +
                  good.goodNumber +
                  ' o elimine el registro...',
              ],
            };
          }
          this.pupCreaGoodMasive();
        }
      }
      if (pTransGood > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: [
            'Proceso Terminado, no se generaron bienes hijos por ser de tipo Transferente',
          ],
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: [
            'Proceso Terminado, verifique el detalle de los bienes generados',
          ],
        };
      }
    } catch (error: any) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [error.message],
      };
    }
  }

  repository: any;

  getStatusForScreen = (goodId: number, screen: string) =>
    `SELECT  ESTATUS_FINAL, ESTATUS_NUEVO_BIEN, ACCION, EST.PROCESO_EXT_DOM FROM  ESTATUS_X_PANTALLA EST, BIENES B WHERE  EST.CVE_PANTALLA = ${screen} AND  EST.ESTATUS = B.ESTATUS AND  EST.IDENTIFICADOR = B.IDENTIFICADOR AND  EST.PROCESO_EXT_DOM = B.PROCESO_EXT_DOM AND  NO_BIEN = ${goodId}`;

  async pupCreateGoodMasive(
    good: {
      goodId: number;
      identifier: string;
      priceSell?: number;
      import?: number;
      taxSell?: number;
      commission?: number;
      taxCommission: number;
      description: string;
      diStatusGood: string;
    },
    tiNewDate: string, // 'dd-mm-yyyy';
    diCurrencyNew: string,
    typeConversion: string,
    tiNewBank: string,
    screen: string,
    diNewAccount: string,
    reg: { proceso_ext_dom: string }
  ) {
    if (!good?.priceSell || good.priceSell <= 0) {
      good[('priceSell' = 1)];
    }

    if (typeConversion == 'CNE1') [(typeConversion = 'CNE')];

    const statusForScreen = this.repository.query(
      this.getStatusForScreen(good.goodId, screen)
    );
    statusForScreen.forEach((item: any) => {
      const vSumSpent = good?.import || 0;
      const vImport = (good.priceSell || 0) + (good.taxSell || 0);
      const vTotalSpent =
        vSumSpent +
        (good.commission || 0) +
        (good.taxCommission || 0) +
        (good.taxSell || 0);
      const vImpor = good.priceSell;
      const vImporten = vImport - (good.commission || 0) + good.taxCommission;

      let vImportec;
      if (Math.trunc(vImport) !== vImport) {
        vImportec = vImport.toFixed(2).trim();
      } else {
        vImportec = vImport.toFixed(0).trim();
      }

      let vImportenc;
      if (Math.trunc(vImporten) !== vImporten) {
        vImportenc = vImporten.toFixed(2).trim();
      } else {
        vImportenc = vImporten.toFixed(0).trim();
      }

      if (typeConversion == 'BBB') {
        let vComment = (id: number) => {
          if (good.identifier == 'TRANS') {
            return good.description.substring(0, 1249);
          } else {
            return `PAGO PARCIAL POR SINIESTRO GENERANDO EL BIEN HIJO NO. ${id} CON ESTATUS ${good.diStatusGood}, ${good.comment} , ${good.description}`.substring(
              0,
              1199
            );
          }
        };
      }
      this.repository.query(`
      UPDATE BIENES             
                    SET ESTATUS = :BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN,
                        DESCRIPCION = V_COMENTARIO,
                        VAL40 = ${diCurrencyNew},
                        VAL41 = ${vImportec},
                        VAL42 = ${vImportenc},
                        VAL43 = ${tiNewBank},
                        VAL44 = TO_CHAR(${tiNewDate},'dd-mm-yyyy'),
                        VAL45 = ${diNewAccount},
                        VAL46 = ${good.priceSell},
                        VAL47 = ${good.taxSell},
                        VAL48 = ${good.commission},
                        VAL49 = ${good.taxCommission},
                        VAL50 = ${vSumSpent},
                        PROCESO_EXT_DOM = ${reg.proceso_ext_dom} 
                  WHERE NO_BIEN = P_BIEN;`);
    });
  }
}

import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { CopiesOfficialOpinionService } from 'src/app/core/services/ms-dictation/ms-copies-official-opinion.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { Ssf3SignatureElecDocsService } from 'src/app/core/services/ms-electronicfirm/ms-ssf3-signature-elec-docs.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';

@Injectable({
  providedIn: 'root',
})
export class LegalOpinionsOfficeService {
  constructor(
    private msUsersService: UsersService,
    private msCityService: CityService,
    private msMsDepositaryService: MsDepositaryService,
    private msDictationService: DictationService,
    private msExpedientService: ExpedientService,
    private msOficialDictationService: OficialDictationService,
    private msSsf3SignatureElecDocsService: Ssf3SignatureElecDocsService,
    private msCopiesOfficialOpinionService: CopiesOfficialOpinionService,
    private msJobDictumTextsService: JobDictumTextsService
  ) {}

  getIssuingUserByDetail(params: _Params) {
    return this.msUsersService.getAllSegUsers(params);
  }
  getAddresseeByDetail(params: ListParams) {
    return this.msUsersService.getAllSegXAreas(params);
  }
  getCityByDetail(params: string) {
    return this.msCityService.getAllFiltered(params);
  }
  getDictations(params: string) {
    return this.msDictationService.getAllWithFilters(params);
  }
  getExpedient(params: ListParams) {
    return this.msExpedientService.getAll(params);
  }
  getOfficeDictation(params: _Params) {
    return this.msOficialDictationService.getAll(params);
  }
  getElectronicFirmData(params: _Params) {
    return this.msSsf3SignatureElecDocsService.getAllFiltered(params);
  }
  getOfficeCopiesDictation(params: _Params) {
    return this.msCopiesOfficialOpinionService.getAll(params);
  }
  getOfficeTextDictation(params: _Params) {
    return this.msJobDictumTextsService.getAll(params);
  }

  getTexto3FromOfficeDictation(
    officeDictationData: IOfficialDictation,
    type_of: string
  ) {
    if (officeDictationData.text3) {
      if (officeDictationData.text3.length > 0) {
        if (type_of == 'A-O') {
          officeDictationData.text3 = `00/00/2007 Administración Titular Jurídica y de RecepciónInformación Reservada en su totalidad 1/1.
                                    Período de reserva: 12 años.
                                    Artículo 13, fracción V LFTAIPG.
                                    La difusión de la información contenida en este documento puede impedir u obstruir las acciones que realiza el SAE para el adecuado cumplimiento de las obligaciones contenidas en la LFAEBSP en materia de Administración de bienes asegurados.`;
        }
        if (type_of == 'A-OH') {
          officeDictationData.text3 = `Firma el Administrador Titular de Recuperación en suplencia del Administrador Titular Jurídico y de Recepción, con fundamento en lo dispuesto por el artículo 51, último párrafo del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes.`;
        }
        if (type_of == 'A-TT') {
          officeDictationData.text3 = `00/00/2007 Administración Titular Jurídica y de RecepciónInformación Reservada en su totalidad 1/1.
                                    Período de reserva: 12 años.
                                    Artículo 13, fracción V LFTAIPG.
                                    La difusión de la información contenida en este documento puede impedir u obstruir las acciones que realiza el SAE para el adecuado cumplimiento de las obligaciones contenidas en la LFAEBSP en materia de Administración de bienes asegurados.`;
        }
        if (type_of == 'D') {
          officeDictationData.text3 = `00/00/2007 Administración Titular Jurídica y de RecepciónInformación Reservada en su totalidad 1/1.
                                    Período de reserva: 12 años.
                                    Artículo 13, fracción V LFTAIPG.
                                    La difusión de la información contenida en este documento puede impedir u obstruir las acciones que realiza el SAE para el adecuado cumplimiento de las obligaciones contenidas en la LFAEBSP en materia de Administración de bienes asegurados.`;
        }
        if (type_of == 'D-A') {
          officeDictationData.text3 = `00/00/2007 Administración Titular Jurídica y de RecepciónInformación Reservada en su totalidad 1/1.
                                    Período de reserva: 12 años.
                                    Artículo 13, fracción V LFTAIPG.
                                    La difusión de la información contenida en este documento puede impedir u obstruir las acciones que realiza el SAE para el adecuado cumplimiento de las obligaciones contenidas en la LFAEBSP en materia de Administración de bienes asegurados.`;
        }
        if (type_of == 'D-NA') {
          officeDictationData.text3 = `00/00/2007 Administración Titular Jurídica y de RecepciónInformación Reservada en su totalidad 1/1.
                                    Período de reserva: 12 años.
                                    Artículo 13, fracción V LFTAIPG.
                                    La difusión de la información contenida en este documento puede impedir u obstruir las acciones que realiza el SAE para el adecuado cumplimiento de las obligaciones contenidas en la LFAEBSP en materia de Administración de bienes asegurados.`;
        }
        if (type_of == 'N-A') {
          officeDictationData.text3 = `00/00/2007 Administración Titular Jurídica y de RecepciónInformación Reservada en su totalidad 1/1.
                                    Período de reserva: 12 años.
                                    Artículo 13, fracción V LFTAIPG.
                                    La difusión de la información contenida en este documento puede impedir u obstruir las acciones que realiza el SAE para el adecuado cumplimiento de las obligaciones contenidas en la LFAEBSP en materia de Administración de bienes asegurados.`;
        }
      }
    }
    return officeDictationData;
  }

  getTextDefaultDictation(
    dictationData: IDictation,
    expedientData: IExpedient,
    officeDictationData: IOfficialDictation,
    type_of: string
  ) {
    if (dictationData.typeDict == 'PROCEDENCIA') {
      // -- ASEGURADOS ORDINARIOS
      if (type_of == 'A-O' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser un asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracciones I del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le remito el expediente Averiguación Previa __ enviado a esta Área Jurídica a mi cargo, con la finalidad de comprobar si cumple con los requisitos de las disposiciones aplicables, respecto de los bienes que se señalan en el acuerdo de aseguramiento de fecha __, y que se relacionan a continuación:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta Área Jurídica, el expediente referido cumple con los requisitos documentales de las disposiciones aplicables, de conformidad con lo establecido en los artículos 1, fracción I, 3, 6 y 7 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 13 de su Reglamento de la Ley Federal antes mencionada; 182 y 182-A del Código Federal de Procedimientos Penales.\n Por lo anterior, con fundamento en lo dispuesto por el artículo 56, fracción VII, del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, y por el numeral cuarto y demás disposiciones relativas y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la transferencia de bienes asegurados y decomisados en procedimientos penales federales, publicados en el Diario Oficial de la Federación con fecha 13 de enero de 2006, se dictamina la procedencia jurídica de la recepción de los bienes descritos en el presente oficio.\n En el expediente referido no obra constancia con la descripción de la forma en que se hayan sellado, marcado o señalado los bienes asegurados para su identificación, de conformidad con lo establecido en la fracción II del artículo 182 del Código Federal de Procedimientos Penales, situación que deberá asentarse en el acta de entrega-recepción que para tales efectos se realice.`;
        }
      }
      // -- ASEGURADOS ORDINARIOS HMLLO
      if (type_of == 'A-OH' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser un asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracción I del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le remito el expediente Averiguación Previa __ enviado a esta Área Jurídica a mi cargo, con la finalidad de comprobar si cumple con los requisitos de las disposiciones aplicables, respecto de los bienes que se señalan en el acuerdo de aseguramiento de fecha __, y que se relacionan a continuación:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta Área Jurídica, el expediente referido cumple con los requisitos documentales de las disposiciones aplicables, de conformidad con lo establecido en los artículos 1, fracción I, 3, 6 y 7 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 13 de su Reglamento de la Ley Federal antes mencionada; 182 y 182-A del Código Federal de Procedimientos Penales.\n Por lo anterior, con fundamento en lo dispuesto por el artículo 56, fracción VII del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, y por el numeral cuarto y demás disposiciones relativas y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la transferencia de bienes asegurados y decomisados en procedimientos penales federales, publicados en el Diario Oficial de la Federación con fecha 13 de enero de 2006, se dictamina la procedencia jurídica de la recepción de los bienes descritos en el presente oficio.\n En el expediente referido no obra constancia con la descripción de la forma en que se hayan sellado, marcado o señalado los bienes asegurados para su identificación, de conformidad con lo establecido en la fracción II del artículo 182 del Código Federal de Procedimientos Penales, situación que deberá asentarse en el acta de entrega-recepción que para tales efectos se realice.`;
        }
      }
      // -- ASEGURADOS TERCER TRANSITORIO
      if (type_of == 'A-TT' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser un asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracción I y del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le remito el expediente Averiguación Previa __, enviado a esta Área Jurídica a mi cargo, con la finalidad de comprobar si cumple con los requisitos de las disposiciones aplicables, respecto de los bienes que se señalan en el acuerdo de aseguramiento de fecha __, y que se relacionan a continuación:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta área jurídica, el expediente referido cumple con los requisitos documentales de las disposiciones aplicables, en los términos de lo dispuesto por el artículo Tercero Transitorio del Decreto por el que se reforman, adicionan y derogan diversas disposiciones de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, publicado en el Diario Oficial de la Federación con fecha 23 de febrero de 2005; y por el numeral sexto y demás disposiciones relativas y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la transferencia de bienes asegurados que se indican, por parte de la Procuraduría General de la República, publicados en el Diario Oficial de la Federación con fecha 12 de julio de 2005.\n Por lo anterior, con fundamento en lo dispuesto por el artículo 56, fracción VII, del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, se dictamina la procedencia jurídica de la recepción de los bienes descritos en el presente oficio.`;
        }
      }
      // -- COMERCIO EXTERIOR
      if (type_of == 'C-E' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser de un asunto de su competencia, de conformidad con lo dispuesto por el artículo 55 fracción I y XV del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le comunico que el expediente remitido a esta Área Jurídica por la Aduana __, relativo a los bienes y mercancías que a continuación se relacionan, cumple con los requisitos documentales de las disposiciones aplicables, lo anterior con fundamento en los artículos 1 fracción VI, 3, y 6 bis de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, y 13 de su Reglamento:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `Por lo anterior, con fundamento en lo dispuesto por el artículo 56, fracción VII, del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, así como por lo dispuesto en el numeral sexto y demás relativos y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la transferencia de los bienes provenientes de comercio exterior que se indican, por parte del Servicio de Administración Tributaria, publicados con fecha 12 de julio de 2005 en el Diario Oficial de la Federación, se dictamina la procedencia jurídica de la recepción de los bienes descritos en el presente oficio.\n Asimismo le informo que el expediente descrito se integra por los siguientes documentos:\n - Solicitud de transferencia, que incluye la descripción del bien, el objeto de la transferencia, (oficio número_).\n - Resolución del PAMA __.`;
        }
      }
      // -- PROCEDENCIA EXT_DOM
      if (type_of == 'E-D' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Hago referencia a su oficio _____, a través del cual Su Señoría solicitó la transferencia de ________, asegurado dentro del procedimiento de extinción de dominio citado al rubro.\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `Al respecto, le señalo que el artículo 3, fracción I, de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público señala que la Entidad Transferente deberá exhibir el original o copia certificada del documento en el que obre la propiedad o posibilidad de disponer del bien a transferir. \n En lo particular, de la revisión a las constancias exhibidas en el oficio señalado, se desprende que se anexó copia simple del acuerdo de aseguramiento de fecha _____. En razón de ello, con fundamento en la fracción IV del artículo 12 del Reglamento de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, así como el 47 Quintus, fracciones II y VIII, del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le solicito se  sirva remitir al suscrito copia certificada del acuerdo de aseguramiento de fecha  ____, a efecto de estar en posibilidad de dictaminar la recepción del bien de que  se trata por parte de este Organismo Descentralizado. \n Agradeciendo la atención brindada, aprovecho la ocasión para enviarle un cordial saludo.`;
        }
      }
      // -- NUMERARIO ASEGURADO
      if (type_of == 'N-A' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser un asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracción I del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le remito el siguiente numerario para efectos de su administración y registro, relacionado con la Averiguación Previa __, hoy Causa Penal __, radicada en el Juzgado __, y que se relaciona a continuación:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta Área Jurídica, el expediente referido cumple con los requisitos documentales de las disposiciones aplicables, de conformidad con lo establecido en los artículos 1, fracción I, 3, 6 y 7 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 13 de su Reglamento de la Ley Federal antes mencionada; 182 y 182-A del Código Federal de Procedimientos Penales. \n Por lo anterior, con fundamento en lo dispuesto por el artículo 49, fracción XIV del Servicio de Administración y Enajenación de Bienes, y por el numeral cuarto y demás disposiciones relativas y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la transferencia de bienes asegurados y decomisados en procedimientos penales federales, publicados en el Diario Oficial de la Federación con fecha 13 de enero de 2006, se dictamina la procedencia jurídica de la recepción del numerario descrito en el presente oficio. \n Al efecto se anexa la siguiente documentación: \n -	Acuerdo de aseguramiento de fecha __. \n -	Ficha de depósito en copia certificada de la institución de crédito __, la cual ampara la cantidad de __, que de acuerdo a la constancia exhibida fue ingresada a las cuentas de este organismo descentralizado.`;
        }
      }
    }
    if (dictationData.typeDict == 'DECOMISO') {
      // -- DECOMISO
      if (type_of == 'D' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser un asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracción I del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le remito el expediente Causa Penal __, radicada en el Juzgado __, relacionado con el decomiso del siguiente numerario:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta Área Jurídica, con fundamento en los artículos 1, fracción I, 3 y 90 de la Ley  Federal para la Administración y Enajenación de Bienes del Sector Público; 182-Q del Código Federal de Procedimientos Penales; así como el numeral tercero, último párrafo y demás relativos y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la transferencia de bienes asegurados y decomisados en procedimientos penales federales, publicados en el Diario Oficial de la Federación con fecha 13 de enero de 2006, el expediente referido cumple con los requisitos documentales de las disposiciones aplicables, para ejecutar el decomiso referido. \n Adicionalmente, la sentencia de fecha __, en la cual la Autoridad Judicial decreta el decomiso de los bienes respectivos, ha causado estado y procede ejecutar lo ordenado.`;
        }
      }
    }
    if (dictationData.typeDict == 'EXT_DOM') {
      // -- EXT_DOM
      if (type_of == 'E-D' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Vistos para dictaminar la procedencia de la transferencia solicitada por el C. Juez ______, dentro del expediente _____, respecto del bien que se indica a continuación:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `Ahora bien, resultando: \n 1.	Que la Procuraduría General de la República, por conducto del Ministerio Público de la Federación ejercitó la acción de extinción de dominio sobre los derechos de los bienes señalados previamente, ante el Juzgado ____ de Distrito, en el expediente ____. \n 2.	Que en ese expediente, mediante auto de fecha _____, la Autoridad  Judicial ordenó el aseguramiento de los bienes citados. \n 3.	Que mediante oficio _____, de fecha ____, el Juez ______ solicitó al Servicio de Administración y Enajenación de Bienes (SAE) la  transferencia de los bienes asegurados que se indican, exhibiendo para ello copia certificada del acuerdo de aseguramiento señalado, así como inventario con la descripción de los bienes, e indicando que éstos deberán ser conservados para su resguardo.`;
        }
      }
    }
    if (dictationData.typeDict == 'DEVOLUCION') {
      // -- DEVOLUCION ASEGURADOS
      if (type_of == 'D-A' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracciones I del Estatuto Orgánico deL Servicio de Administración y Enajenación de Bienes, le remito el expediente Averiguación Previa __, relacionada con la indagatoria __, misma que dio origen a la Causa Penal __, radicada en el Juzgado __, respecto de la devolución de los siguientes bienes:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta Área Jurídica, es procedente la entrega de los bienes descritos al C. __, de conformidad con lo establecido en los artículos 24 y 25 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 182-N, fracción II y 182-Ñ del Código Federal de Procedimientos Penales; así como por lo dispuesto en los numerales segundo, quinto y demás relativos y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la devolución de bienes, publicados en el Diario Oficial de la Federación con fecha 13 de enero de 2006; y atendiendo a lo dispuesto por la Autoridad Judicial mediante auto de fecha __. \n Por lo anterior, con fundamento en lo dispuesto por el artículo 56, fracción VII, del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, se dictamina la procedencia jurídica de la devolución de los bienes descritos en el presente oficio.`;
        }
      }
      // -- DEVOLUCION NUMERARIO ASEGURADO
      if (type_of == 'D-NA' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser asunto de su competencia, de conformidad con lo establecido en el artículo 55, fracción I del Estatuto Orgánico deL Servicio de Administración y Enajenación de Bienes, le remito el expediente Averiguación Previa __, relacionada con la indagatoria __, misma que dio origen a la Causa Penal __, radicada en el Juzgado __, respecto de la devolución del siguiente numerario:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `En opinión de esta Área Jurídica, es procedente la entrega del numerario descrito al C. __, más los rendimientos generados durante el tiempo de su administración, de conformidad con lo establecido en los artículos 24, 25 y 26 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 182-N, fracción II, 182-Ñ y 182-O del Código Federal de Procedimientos Penales; así como por lo dispuesto en el numeral séptimo y demás relativos y aplicables de los Lineamientos del Servicio de Administración y Enajenación de Bienes para la devolución de bienes, publicados en el Diario Oficial de la Federación con fecha 13 de enero de 2006; y atendiendo a lo dispuesto por la Autoridad Judicial mediante auto de fecha __. \n Por lo anterior, con fundamento en lo dispuesto por el artículo 56, fracción VII, del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, se dictamina la procedencia jurídica de la devolución del numerario descrito en el presente oficio.`;
        }
      }
    }
    if (dictationData.typeDict == 'RECEPCION') {
      // -- TESOFE
      if (type_of == 'T' && expedientData.preliminaryInquiry) {
        if (!officeDictationData.text1) {
          officeDictationData.text1 = `Por ser asunto de su competencia, al tratarse de bienes a que se refiere el artículo 6 bis de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, y de conformidad con lo establecido en el artículo 55, fraccio I del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, le comunico que el expediente remitido a esta Área Jurídica, referente a los bienes muebles que a continuación se describen, cumple con los requisitos documentales establecidos en los artículos 3 de la Ley Federal en comento y 13 de su Reglamento:\n\n`;
        }
        if (!officeDictationData.text2) {
          officeDictationData.text2 = `Los bienes muebles descritos fueron embargados dentro del procedimiento administrativo de ejecución incoado en contra del contribuyente __. Como consecuencia de lo anterior se celebró con fecha __ Acta de Segunda Almoneda y al no existir posturas se declaró desierta manifestándose en el acta que __. \n La Entidad Transferente, en particular la Dirección General Adjunta de Administración de Cartera y Activos no Monetarios, dirigió oficio número __ al Director Corporativo de Operación, mediante el cual indica que "se confirma que los bienes muebles se transfieren al SAE con el objeto de que ese Organismo proceda a realizar en los términos de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, los actos necesarios para administrarlos en tanto los vende, dona y/o destruye, ordenando al SAE si lo considera conveniente, que se practique el correspondiente avalúo". \n Hago de su conocimiento que con fundamento en lo dispuesto por el artículo 49, fracción XIV del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes, se dictamina la procedencia jurídica de la recepción de los bienes muebles motivo de la presente transferencia. \n Cabe mencionar que el detalle de los bienes se validó de acuerdo a lo establecido en el Acta de Segunda Almoneda Desierta.`;
        }
      }
    }
    if (dictationData.typeDict == 'ABANDONO') {
      // -- ABANDONO -- DAN
      if (type_of == 'DAN') {
        officeDictationData.text1 = `Vistos para resolver la declaratoria de abandono de las constancias que integran el expediente administrativo número ${
          dictationData.expedientNumber
        } del Sistema Integral para la Administración de Bienes, que se lleva en este Servicio de Administración y Enajenación de Bienes, relativo a los bienes afectos a la ${
          'causa penal ' + expedientData.criminalCase
        } ${'averiguación previa ' + expedientData.preliminaryInquiry} ${
          'juzgado ' + expedientData.courtName
        }`;
        officeDictationData.text2 = `                                                                                                 R E S U L T A N D O\n
1.- Que el día __________, el C. Juez _________ decretó el aseguramiento de la cantidad de $_______ (_____________) dentro de la Causa Penal ___________.\n

Dicho aseguramiento, se notificó personalmente al C. ________________________ el día __________________, cuya constancia corre agregada en el expediente administrativo en que se actúa.\n\n

2.- Que por auto de fecha _____________________________, el C. Juez ________________________ señaló: 

"procédase a devolver a __________________________________________, el numerario de que se trata" \n\n

Notificación practicada personalmente al C. ___________________________ el día _______________________, cuya constancia corre agregada en el expediente administrativo en que se actúa.\n\n
                                                                                        C O N S I D E R A N D O S.\n\n
PRIMERO. COMPETENCIA.- Que el Servicio de Administración y Enajenación de Bienes, Organismo Descentralizado de la Administración Pública Federal, es la autoridad administrativa competente para realizar la declaratoria de abandono del numerario, de conformidad con los artículos 1, 24 y 76 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 5 y 6 de su Reglamento y 40 fracción X del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes. \n\n

SEGUNDO. PROCEDENCIA DE LA DECLARATORIA DE ABANDONO.- Que de conformidad con lo dispuesto por el artículo 6 del Reglamento de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público y los resultandos de la presente declaración de abandono, el Servicio de Administración y Enajenación de Bienes acredita los extremos del precepto aludido, realizando para tal efecto los razonamientos jurídicos siguientes:\n\n

a) Autoridad que decretó el aseguramiento; El C. Juez _______________________________ decretó el aseguramiento de la cantidad de $________________ (_________________________) dentro de la Causa Penal  _________________\n\n

b) Descripción del bien; numerario consistente en la cantidad de $____________ (________________________)\n\n

c) Nombre del interesado o de su representante legal, fecha en que fue notificado del aseguramiento; notificación  personal practicada al C. __________________ el día ___________________.\n\n

d) La autoridad que ordenó la devolución del bien, así como la fecha y forma en que fue notificado el interesado o su representante legal de la resolución correspondiente; el C. Juez _________________________________ mediante notificación de fecha __________________________,practicada personalmente al C. _________________.\n\n

TERCERO. CÓMPUTO DEL TÉRMINO LEGAL.- Mediante proveído de fecha ______________________, el Juez del proceso penal federal dejó a disposición del C. _____________________ la cantidad de $__________ (___________________), consecuentemente, notificó dicha determinación el día ________________________ en ese sentido el Servicio de Administración y Enajenación de Bienes 
procede a computar el término legal, el cual empezó a correr el día _____________________, y feneció el día __________________, de lo que se desprende que a la fecha de la presente declaración de abandono ha transcurrido en exceso el término otorgado al interesado, establecido en los artículos 182-Ñ del Código Federal de Procedimientos Penales y 24 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, por lo que es procedente la declaración de abandono de $__________ 
(______________________________)`;
        officeDictationData.text3 = `                                                              F U N D A M E N T O  L E G A L \n\n

Por lo expuesto y con apoyo además en el artículo 22 Constitucional antepenúltimo párrafo; 1, 24 y 76 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 5 y 6 de su Reglamento y 40 fracción X del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes; se, \n\n
                                                               R E S U E L V E\n\n

PRIMERO.- Se declara abandonado a favor del Gobierno Federal la cantidad de $___________ (__________________________)\n

SEGUNDO.- Gírese oficio para informar al Juzgado ________________________ lo resuelto por este Organismo Descentralizado de 
la Administración Pública Federal, adjuntando para tal efecto la presente declaratoria de abandono.\n\n

TERCERO.- Así también, remítase la presente a la Coordinación de Destino de Bienes Muebles, a efecto de que proceda dar 
cumplimiento a los artículos 89 y 90 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público.\n\n

CUARTO.- En su oportunidad archívese el presente asunto como totalmente concluido, para los efectos legales a que haya lugar.\n\n

El Director Ejecutivo de Bienes Muebles, en ejercicio de la facultad establecida en la fracción X del artículo 40 del Estatuto 
Orgánico del Servicio de Administración y Enajenación de Bienes. Sufragio Efectivo. No Reelección, en la Ciudad de México, 
Distrito Federal a ________________________.`;
      }
      // -- ABANDONO -- DAB
      if (type_of == 'DAB') {
        officeDictationData.text1 = `Vistos para resolver la declaratoria de abandono de las constancias que integran el expediente administrativo número ${
          dictationData.expedientNumber
        } del Sistema Integral para la Administración de Bienes, que se lleva en este Servicio de Administración y Enajenación de Bienes, relativo a los bienes afectos a la  ${
          'causa penal ' + expedientData.criminalCase
        } ${'averiguación previa ' + expedientData.preliminaryInquiry} ${
          'juzgado ' + expedientData.courtName
        }:`;
        officeDictationData.text2 = `                                                                                                 R E S U L T A N D O \n\n
1.- Que el día _____________________, el C. Juez _______________________________ decretó el aseguramiento de \n
________________________________________, dentro de la Causa Penal _________. \n
 \n

Dicho aseguramiento, se notificó personalmente al C. ___________________________________ el día ______________________, cuya constancia corre agregada en el expediente administrativo en que se actúa. \n\n

2.- En proveído de fecha________________________, el Juez _________________________________, ordenó: 

"se deja a disposición de quien acredite su propiedad" \n

Notificación de fecha _____________________________, practicada personalmente al C. ___________________; cuya constancia corre agregada en el expediente en que se actúa. \n\n
                                                                                        C O N S I D E R A N D O S \n\n
PRIMERO. COMPETENCIA.- Que el Servicio de Administración y Enajenación de Bienes, Organismo Descentralizado de la Administración Pública Federal, es la autoridad administrativa competente para realizar la declaratoria de abandono del bien, de conformidad con los artículos 1, 24 y 76 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 5 y 6 de su  Reglamento y 40 fracción X del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes. \n\n

SEGUNDO. PROCEDENCIA DE LA DECLARATORIA DE ABANDONO.- Que de conformidad con lo dispuesto por el artículo 6 del Reglamento de la 
Ley Federal para la Administración y Enajenación de Bienes del Sector Público y los resultandos de la presente declaración de abandono, 
el Servicio de Administración y Enajenación de Bienes acredita los extremos del precepto aludido, realizando para tal efecto los 
razonamientos jurídicos siguientes: \n

a)	Autoridad que decretó el aseguramiento; el C. Juez ________________________________decretó el aseguramiento de un
______________________________________, dentro de la Causa Penal ________.\n

b)	Descripción del bien; ________________________________ \n

c) Nombre del interesado o de su representante legal, fecha en que fue notificado del aseguramiento; notificación personal practicada 
al C.  ____________________________ el día ___________________________ \n

d) La autoridad que ordenó la devolución del bien, así como la fecha y forma en que fue notificado el interesado o su representante 
legal de la resolución correspondiente; el C. Juez __________________________, con fecha ____________________, mediante notificación 
personal practicada al C._______________________. \n\n

TERCERO. CÓMPUTO DEL TÉRMINO LEGAL.- Mediante proveído de fecha ________________, el Juez del proceso penal federal dejó a disposición  
de quien acredite la propiedad de ____________ objeto de la presente resolución, consecuentemente, notificó dicha determinación
el día _____________________ al C. _______________, en ese sentido el Servicio de Administración y Enajenación de Bienes procede a computar el  
término legal, el cual empezó a correr el día __________________y feneció el día _____________________, de lo que se desprende que a la fecha de 
la presente declaración de abandono ha transcurrido en exceso el término otorgado al interesado, establecido en los artículos 182-Ñ del Código Federal 
de Procedimientos Penales y 24 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, por lo que es 
procedente la declaración de abandono del ___________________________ `;
        officeDictationData.text3 = `                                                              F U N D A M E N T O  L E G A L \n\n

Por lo expuesto y con apoyo además en el artículo 22 Constitucional antepenúltimo párrafo; 1, 24 y 76 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público; 5 y 6 de su Reglamento y 40 fracción X del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes; se, \n
                                                                         R E S U E L V E \n

PRIMERO.- Se declara abandonado a favor del Gobierno Federal el _________________________________ \n

SEGUNDO.- Gírese oficio para informar al Juzgado ______________________________________, lo resuelto por este Organismo Descentralizado 
de la Administración Pública Federal, adjuntando para tal efecto la presente declaratoria de abandono. \n

TERCERO.- Así también, remítase la presente declaración de abandono, a la Coordinación Regional ____________ a efecto de que proceda 
a dar cumplimiento a los artículos 89 y 90 de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público. \n

CUARTO.- En su oportunidad archívese el presente asunto como totalmente concluido, para los efectos legales a que haya lugar. \n

El Director Ejecutivo de Bienes Muebles, en ejercicio de la facultad establecida en la fracción X del artículo 40 del Estatuto 
Orgánico del Servicio de Administración y Enajenación de Bienes. Sufragio Efectivo. No Reelección, en la Ciudad de México, 
Distrito Federal a ____________________________ `;
      }
    }
    return officeDictationData;
  }
}

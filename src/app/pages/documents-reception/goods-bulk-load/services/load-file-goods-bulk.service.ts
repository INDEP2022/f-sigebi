import { Injectable } from '@angular/core';
import { IPgrTransfer } from 'src/app/core/models/ms-interfacefgr/ms-interfacefgr.interface';
// date pipe angular
import { DatePipe } from '@angular/common';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { previewData } from '../interfaces/goods-bulk-load-table';

@Injectable({
  providedIn: 'root',
})
export class LoasFileGoodsBulkService {
  tableSource: previewData[] = [];
  pgrData: IPgrTransfer[] = [];
  constructor(
    private datePipe: DatePipe,
    private interfacefgrService: InterfacefgrService
  ) {}

  initDataPgr(pgrData: IPgrTransfer[]) {
    this.tableSource = [];
    this.pgrData = pgrData;
    this.getFilterDataPgr(this.pgrData[0]); // Inicia proceso de carga y validacion
  }

  getFilterDataPgr(dataPgr: IPgrTransfer, count: number = 0) {
    // areadestino: null;
    // ciudad: null;
    // contribuyente: null;
    // descbien: '';
    // destinatario: '';
    // entfed: null;
    // exptrans: '';
    // fecoficio: null;
    // gestiondestino: '';
    // identificador: '';
    // marca: '';
    // nooficio: '';
    // remitente: '';
    // sat_cve_unica: undefined;
    // serie: '';
    // solicitante: null;
    // status: '';
    // tipovolante: '';
    // transferente: null;
    // viarecepcion: null;
    let data: any = {
      tipovolante: '',
      remitente: '',
      identificador: '',
      asunto: dataPgr.pgrBusinessSae,
      nooficio: dataPgr.pgrOffice,
      fecoficio: null,
      exptrans: '',
      descripcion: '',
      ciudad: null,
      entfed: null,
      solicitante: null,
      contribuyente: null,
      transferente: null,
      viarecepcion: null,
      areadestino: null,
      gestiondestino: '',
      destinatario: '',
      descbien: '',
      cantidad: null,
      unidad: '',
      status: 'ROP',
      clasif: null,
      marca: '',
      serie: '',
    };
    if (dataPgr.pgrTypeGoodVeh) {
      // CONDICION VEH
      data.clasif = dataPgr.pgrTypeGoodVeh;
      data.descripcion = dataPgr.pgrDescrGoodVeh;
      data.cantidad = dataPgr.pgrAmountVeh;
      data.unidad = dataPgr.pgrUnitMeasureVeh;
      data.edofisico = dataPgr.pgrEdoPhysicalVeh;
      // DATA EXTRA
      data['marca'] = dataPgr.pgrVehBrand;
      data['submarca'] = dataPgr.pgrVehsubBrand;
      data['modelo'] = dataPgr.pgrVehModel;
      data['serie'] = dataPgr.pgrVehnoserie;
      data['numero de motor'] = dataPgr.pgrVehnoEngine;
      data['procedencia'] = dataPgr.pgrVehOrigin;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalVeh;
    } else if (dataPgr.pgrTypeGoodAer) {
      // CONDICION AER
      data.clasif = dataPgr.pgrTypeGoodAer;
      data.descripcion = dataPgr.pgrDescrGoodAer;
      data.cantidad = dataPgr.pgrAmountAer;
      data.unidad = dataPgr.pgrUniMeasureAer;
      data.edofisico = dataPgr.pgrEdoPhysicalAer;
      // DATA EXTRA
      data['marca'] = dataPgr.pgrAerBrand;
      data['modelo'] = dataPgr.pgrAerModel;
      data['numero de motor'] = dataPgr.pgrAernoEngine;
      data['numero de motor'] = dataPgr.pgrAernoEngine2;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalAer;
      data['matricula'] = dataPgr.pgrAermatriactu;
    } else if (dataPgr.pgrTypeGoodEmb) {
      // CONDICION EMB
      data.clasif = dataPgr.pgrTypeGoodEmb;
      data.descripcion = dataPgr.pgrDescrGoodEmb;
      data.cantidad = dataPgr.pgrAmountEmb;
      data.unidad = dataPgr.pgrUniMeasureEmb;
      data.edofisico = dataPgr.pgrEdoPhysicalEmb;
      // DATA EXTRA
      data['modelo'] = dataPgr.pgrEmbModel;
      data['procedencia'] = dataPgr.pgrEmbOrigin;
      data['matricula'] = dataPgr.pgrEmbnoTuition;
      data['motor'] = dataPgr.pgrEmbnoEngine;
      data['estado operativo'] = dataPgr.pgrEdoPhysicalEmb;
      data['nombre de la embarcacion'] = dataPgr.pgrEmbName;
    } else if (dataPgr.pgrTypeGoodInm) {
      // CONDICION INM
      data.clasif = dataPgr.pgrTypeGoodInm;
      data.descripcion = dataPgr.pgrDescrGoodInm;
      data.cantidad = dataPgr.pgrAmountInm;
      data.unidad = dataPgr.pgrUniMeasureInm;
      data.edofisico = dataPgr.pgrEdoPhysicalInm;
      // DATA EXTRA
      data['calle'] = dataPgr.pgrInmcalle;
      data['colonia'] = dataPgr.pgrInmSuburb;
      data['delegacion o municipio'] = dataPgr.pgrInmdelegmuni;
      data['estado'] = dataPgr.pgrInmentfed;
      data['numero exterior'] = dataPgr.pgrEdoPhysicalInm;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalInm;
    } else if (dataPgr.pgrTypeGoodNum) {
      // CONDICION NUM
      data.clasif = dataPgr.pgrTypeGoodNum;
      data.descripcion = dataPgr.pgrDescrGoodNum;
      data.cantidad = dataPgr.pgrAmountNum;
      data.unidad = dataPgr.pgrUniMeasureNum;
      data.edofisico = dataPgr.pgrEdoPhysicalNum;
      // DATA EXTRA
      data['importe'] = dataPgr.pgrNueimport;
      data['cuenta'] = dataPgr.pgrNuenoBill;
      data['moneda'] = dataPgr.pgrNueTypemon;
      data['ficha'] = dataPgr.pgrNuefolficdep;
      data['banco'] = dataPgr.pgrNumofictransf;
      let fechaParse = this.datePipe.transform(
        dataPgr.pgrNuefedepos,
        'dd/MM/yyyy'
      );
      data['fecha'] = fechaParse;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalNum;
    } else if (dataPgr.pgrTypeGoodJoy) {
      // CONDICION JOY
      data.clasif = dataPgr.pgrTypeGoodJoy;
      data.descripcion = dataPgr.pgrDescrGoodJoy;
      data.cantidad = dataPgr.pgrAmountJoy;
      data.unidad = dataPgr.pgrUniMeasureJoy;
      data.edofisico = dataPgr.pgrEdoPhysicalJoy;
      // DATA EXTRA
      data['marca'] = dataPgr.pgrAerBrand;
      data['modelo'] = dataPgr.pgrJoyModel;
      data['marca_joy'] = dataPgr.pgrJoyBrand;
      data['material'] = dataPgr.pgrJoyMaterial;
      data['kilataje'] = dataPgr.pgrJoykilataje;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalJoy;
    } else if (dataPgr.pgrTypeGoodDiv) {
      // CONDICION DIV
      data.clasif = dataPgr.pgrTypeGoodDiv;
      data.descripcion = dataPgr.pgrDescrGoodDiv;
      data.cantidad = dataPgr.pgrAmountDiv;
      data.unidad = dataPgr.pgrUniMeasureDiv;
      data.edofisico = dataPgr.pgrEdoPhysicalDiv;
      // DATA EXTRA
      data['edofisico1'] = dataPgr.pgrEdoPhysicalDiv;
    } else if (dataPgr.pgrTypeGoodMen) {
      // CONDICION MEN
      data.clasif = dataPgr.pgrTypeGoodMen;
      data.descripcion = dataPgr.pgrDescrGoodMen;
      data.cantidad = dataPgr.pgrAmountMen;
      data.unidad = dataPgr.pgrUniMeasureMen;
      data.edofisico = dataPgr.pgrEdoPhysicalMen;
      // DATA EXTRA
      data['edofisico1'] = dataPgr.pgrEdoPhysicalMen;
    }
    data['SAT_CVE_UNICA'] = dataPgr.pgrGoodNumber; // SET CLAVE UNICA
    // return data;
    this.loadDataPgr(this.pgrData[count++], count++, data); // Siguiente registro
  }

  loadDataPgr(pgrData: IPgrTransfer, count: number = 0, response: any) {
    let objReplace: any = {};
    for (const key in response) {
      if (Object.prototype.hasOwnProperty.call(response, key)) {
        if (key) {
          objReplace[key.toLowerCase()] = response[key];
        }
      }
    }
    if (objReplace) {
      this.tableSource.push(objReplace);
    }
    let obj: any = {};
    let object: any = this.tableSource[0];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (key) {
          obj[key] = {
            title: key.toLocaleUpperCase(),
            type: 'string',
            sort: false,
          };
        }
      }
    }
    if (this.pgrData.length >= count++) {
      console.log(this.tableSource);
    } else {
      this.getFilterDataPgr(pgrData, count); // Inicia proceso de carga y validacion
    }
  }
}

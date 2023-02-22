import { IDocCompensationSatXml } from 'src/app/core/models/catalogs/doc-compensation-sat-xml.model';
import { IDocCompesationSat } from 'src/app/core/models/catalogs/doc-compesation-sat.model';

export const DOC_COMPENSATION_COLUMNNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  satTypeJob: {
    title: 'Tipo oficio',
    type: 'string',
    sort: false,
  },
  idTypeDocSat: {
    title: 'Tipo doc SAT',
    type: 'string',
    valuePrepareFunction: (value: IDocCompesationSat) => value?.typeDocSat,
    sort: false,
  },
  idTypeDocSatXml: {
    title: 'Tipo doc SAT XML',
    type: 'string',
    valuePrepareFunction: (value: IDocCompensationSatXml) =>
      value?.typeDocSatXml,
    sort: false,
  },
  typeDocSae: {
    title: 'Tipo doc SAE',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
};

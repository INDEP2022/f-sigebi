export const AFFAIR_COLUMNS = {
  id: {
    title: 'Código',
    sort: false,
    width: '35px',
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  processDetonate: {
    title: 'Proceso detona',
    sort: false,
  },
};

export const AFFAIR_TYPE_COLUMNS = {
  code: {
    title: 'Código',
    sort: false,
    filter: false,
  },
  referralNoteType: {
    title: 'Tipo de volante',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'P') return 'Procesal';
      if (value == 'T') return 'Transferente';
      if (value == 'AT') return 'AdminTransferente';

      return value;
    },
  },
  relationPropertyKey: {
    title: 'Relación con bien',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
  versionUser: {
    title: 'Permiso Usuario',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
};

export const DICTA_COLUMNS = {
  code: {
    title: 'Código',
    sort: false,
  },
  dictumData: {
    title: 'Dictámen',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  flyerType: {
    title: 'Tipo volante',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'P') return 'Procesal';
      if (value == 'T') return 'Transferente';
      if (value == 'AT') return 'AdminTransferente';

      return value;
    },
  },
  doc: {
    title: 'Doc',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
  property: {
    title: 'Bien',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
  g_of: {
    title: 'g_of',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
  i: {
    title: 'i',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
  e: {
    title: 'e',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO';
      if (value == 'S') return 'SI';
      return value;
    },
  },
};

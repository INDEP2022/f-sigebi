export function getMimeTypeFromBase64(
  base64String: string = '',
  fileName = 'unamedfile'
) {
  let ext = fileName.substring(fileName.lastIndexOf('.') + 1);
  if (ext === undefined || ext === null || ext === '') ext = 'bin';
  ext = ext.toLowerCase();
  const signatures: any = {
    JVBERi0: 'application/pdf',
    R0lGODdh: 'image/gif',
    R0lGODlh: 'image/gif',
    iVBORw0KGgo: 'image/png',
    TU0AK: 'image/tiff',
    '/9j/': 'image/jpg',
    UEs: 'application/vnd.openxmlformats-officedocument.',
    PK: 'application/zip',
  };
  if (base64String.length > 0) {
    for (const s in signatures) {
      if (base64String?.includes(s)) {
        let x = signatures[s];
        if (ext.length > 3 && ext.substring(0, 3) === 'ppt') {
          x += 'presentationml.presentation';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'xls') {
          x += 'spreadsheetml.sheet';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'doc') {
          x += 'wordprocessingml.document';
        }
        return x;
      }
    }
  }

  const extensions: any = {
    xls: 'application/vnd.ms-excel',
    ppt: 'application/vnd.ms-powerpoint',
    doc: 'application/msword',
    xml: 'text/xml',
    mpeg: 'audio/mpeg',
    mpg: 'audio/mpeg',
    txt: 'text/plain',
  };
  for (const e in extensions) {
    if (ext.indexOf(e) === 0) {
      const xx = extensions[e];
      return xx;
    }
  }
  return 'unknown';
}

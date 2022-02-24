const dataFields = ['mime', 'fileName', 'base64'];

const parseKeyData = (dataURI) => {
  if (dataURI === undefined) {
    throw new Error('key not found!');
  }

  if (typeof dataURI !== 'string') {
    throw new Error('Invalid data type');
  }

  let fileData = dataURI.split(';');

  if (fileData.length !== 3) {
    throw new Error('Invalid data format');
  }

  fileData = fileData.reduce((prev, curr) => {
    const dat = curr.split(':');
    return { ...prev, [dat[0]]: dat[1] };
  }, {});

  // TODO check fields

  return fileData;
};

module.exports = {
  parseKeyData,
};

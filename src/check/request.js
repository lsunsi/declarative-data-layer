import _ from 'lodash';

const error = new Error('invalid-request');

function checkReq(fields, data) {
  _.forEach(fields, (field, key) => {
    const _data = data[key];
    if (key === 'params') return;
    else if (field === true && _.isFunction(_data)) return;
    else if (_.isPlainObject(field) && _.isPlainObject(_data)) {
      checkReq(field, _data);
    } else throw error;
  });
}

export default function (query, datas) {
  _.forEach(query, (fields, name) => {
    const data = datas[name];

    if (data === undefined) {
      throw error;
    } checkReq(fields, data);
  });
}

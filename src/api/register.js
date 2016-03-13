import checkData from '../check/data.js';

const error = new Error('invalid-schema-registered');

export default function (name, obj) {
  checkData(obj);

  if (this.schemas[name]) {
    throw error;
  }

  this.schemas[name] = obj;
}

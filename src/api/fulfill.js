import _ from 'lodash';
import checkQuery from '../check/query.js';
import checkRequest from '../check/request.js';

const error = new Error('fulfilling-failed');

async function fulfillRoot(value, schema, context = []) {
  const { params = {} } = value;
  const fields = _.omit(value, 'params');

  let result = schema.resolve(...context, params);
  if (result instanceof Promise) result = await result;

  const res = {};

  if (_.isPlainObject(result)) {
    const ctx = [result, ...context];
    for (const name in fields) {
      if (fields.hasOwnProperty(name)) {
        const field = fields[name];
        res[name] = (
          field === true
          ? schema[name](...ctx)
          : await fulfillRoot(field, schema[name], ctx)
        );
      }
    } return res;
  }

  if (_.isArray(result)) {
    for (const name in fields) {
      if (fields.hasOwnProperty(name)) {
        const field = fields[name];
        res[name] = [];
        for (const t of result) {
          res[name].push(
            field === true
            ? schema[name](t, ...context)
            : await fulfillRoot(field, schema[name], [t, ...context])
          );
        }
      }
    } return res;
  }

  throw error;
}

export default async function (query) {
  const { schemas } = this;
  checkQuery(query);
  checkRequest(
    query,
    schemas,
  );

  const result = {};

  const promises = _.map(query, (value, name) =>
    fulfillRoot(
      value,
      schemas[name],
    ).then(res => {
      result[name] = res;
    })
  );

  await Promise.all(promises);
  return result;
}

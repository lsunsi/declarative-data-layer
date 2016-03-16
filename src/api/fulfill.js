import _ from 'lodash';
import checkQuery from '../check/query.js';
import checkRequest from '../check/request.js';

const error = new Error('fulfilling-failed');

async function fulfillRoot(value, schema, context = []) {
  const { params = {} } = value;
  const fields = _.omit(value, 'params');

  let data = schema.resolve(...context, params);
  if (data instanceof Promise) data = await data;

  let flag = false;
  if (_.isPlainObject(data)) {
    flag = true;
    data = [data];
  } else if (!_.isArray(data)) {
    throw error;
  }

  const results = [];
  for (const d of data) {
    const res = {};
    const ctx = [d, ...context];
    for (const name in fields) {
      if (fields.hasOwnProperty(name)) {
        const field = fields[name];
        res[name] = (
          field === true
          ? schema[name](...ctx)
          : await fulfillRoot(field, schema[name], ctx)
        );
      }
    } results.push(res);
  }

  return (
    flag
    ? results[0]
    : results
  );
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

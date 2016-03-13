import _ from 'lodash';

const error = new Error('invalid-query-schema');

function checkLeaf(value) {
  if (value !== true) {
    throw error;
  }
}

function checkRoot(value) {
  const { params } = value;
  const fields = _.omit(value, 'params');

  if (params && !_.isPlainObject(params)) {
    throw error;
  }

  if (!_.isPlainObject(fields) || _.isEmpty(fields)) {
    throw error;
  }

  _.forEach(fields, field =>
    _.isPlainObject(field)
    ? checkRoot(field)
    : checkLeaf(field)
  );
}

export default function (query) {
  if (!_.isPlainObject(query)) {
    throw error;
  }

  _.forEach(query, q =>
    checkRoot(q)
  );
}

/*
{
  latest_posts: {
    // parameters
    params: {
      count: 5,
    },

    // fields
    id: true,
    author: {
      name: true,
    },
  },
}
*/

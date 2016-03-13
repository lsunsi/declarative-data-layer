import _ from 'lodash';

const error = new Error('invalid-data-schema');

function checkLeaf(value) {
  if (!_.isFunction(value)) {
    throw error;
  }
}

function checkRoot(value) {
  const { resolve } = value;
  const fields = _.omit(value, 'resolve');

  if (!_.isFunction(resolve)) {
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

export default function (data) {
  if (!_.isPlainObject(data)) {
    throw error;
  } checkRoot(data);
}

/*
{
  // node
  resolve({ count }) {
    return posts.limit(count).fetch();
  },

  // fields
  id(post) {
    return post.id;
  },

  author: {
    resolve(post) {
      return users.get(post.author).fetch();
    },

    name(user) {
      return user.name;
    },
  },
}
*/

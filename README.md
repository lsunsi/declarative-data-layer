Graph Data Layer
===

Description
---
This is an experimental package inspired by facebook's GraphQL.

It provides a practical way of declaring **data schemas** on the server so that data can be queried in a way that's easy to reason about.

Installation
---
```
npm install graph-data-layer
```

Usage
---

This package has two concerns only:
* Data schemas, providing all info a query can ask for.
* Data queries, providing all info needed to fulfill it.

Both schemas and queries are just JavaScript objects following an specific structure.
We target **convention over configuration** so we can achieve a simpler syntax for both schemas and queries that are as similar as possible.

#### Setup

```javascript
import initLayer from 'graph-data-layer';

const layer = initLayer();
```

#### Schema

```javascript
const schema = {
  resolve() {
    return {
      names: {
        first: 'Lucas',
        last: 'Sunsi',
      },
      occupation: 'Magician',
    };
  },

  firstName(u) {
    return user.names.first;
  },
  hasAwesomeOccupation(u) {
    return u.occupation === 'Magician';
  },
};

layer.register('ownerUser', schema);
```

### Query
```javascript
const query = {
  ownerUser: {
    firstName: true,
  },
};

layer.fulfill(query).then(console.log);
// { firstName: 'Lucas' }
```

License
---
MIT

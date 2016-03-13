import register from './api/register.js';
import fulfill from './api/fulfill.js';

export default function () {
  return {
    schemas: {},
    register,
    fulfill,
  };
}

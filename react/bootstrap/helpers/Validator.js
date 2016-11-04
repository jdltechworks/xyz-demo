import _ from 'lodash';

const validate = (fields) => {
  const errors = {};
  console.log(fields);
  _.each(fields, (type, field) => {
    if(_.eq(type, '')) {
      errors[field] = `${field} is blank`;
    }
  });

  return errors;
}

export default validate;
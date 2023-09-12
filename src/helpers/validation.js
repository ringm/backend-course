export const areValuesValid = (data, schema) => {
  const keys = Object.keys(schema.describe().keys);
  const errors = Object.keys(data).reduce((acc, key) => {
    if (keys.includes(key)) {
      const { error } = schema.extract(key).validate(data[key]);
      if (error) {
        return [...acc, error.details.map((e) => `${key} ${e.message}.`)];
      }
      return acc;
    }
    return [...acc, `${key} is not a valid property.`];
  }, []);
  return errors;
};

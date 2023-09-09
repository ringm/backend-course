export const hastValidProperty = (data, schema) => {
  // Iterate through the properties in your schema
  for (const key of Object.keys(schema.describe().keys)) {
    // Validate each property against the data
    const { error } = schema.extract(key).validate(data[key]);
    // If there's no error for a property, return true
    if (!error) {
      return true;
    }
  }
  // If no properties are valid, return false
  return false;
};

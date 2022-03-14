// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (entries: Array<any>): object => {
  const obj = {};

  entries.forEach((key_value) => {
    const [key, value] = key_value;

    obj[`${key}`] = value;
  });

  return obj;
};

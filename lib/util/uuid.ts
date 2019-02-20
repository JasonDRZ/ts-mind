export const uuid = {
  newid() {
    return (
      new Date().getTime().toString(16) +
      Math.random()
        .toString(16)
        .substr(2)
    ).substr(2, 16);
  }
};

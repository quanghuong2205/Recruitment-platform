export const select = (selectedProps: string[], unSelectedProps: string[]) => {
  return {
    ...selectedProps.reduce((prev, cur) => {
      return { ...prev, [cur]: 1 };
    }, {}),

    ...unSelectedProps.reduce((prev, cur) => {
      return { ...prev, [cur]: -1 };
    }, {}),
  };
};

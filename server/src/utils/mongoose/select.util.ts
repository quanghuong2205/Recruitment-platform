export const select = (
  selectedProps: string[] = [],
  unSelectedProps: string[] = [],
) => {
  if (selectedProps.length) {
    return selectedProps.join(' ');
  }

  if (unSelectedProps.length) {
    return unSelectedProps
      .reduce((prev, cur) => {
        return [...prev, `-${cur}`];
      }, [])
      .join(' ');
  }
};

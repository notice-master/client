export const useTemplateFields = (content: string | undefined) => {
  const regExp = /(\w+)(?=\.DATA)/gi;
  if (!content) return [];
  const fields = content.match(regExp);
  if (fields?.length) {
    return fields.map((field) => {
      return {
        name: field,
        // ref: useRef<TemplateFieldHandles | undefined>(),
      };
    });
  } else {
    return [];
  }
};

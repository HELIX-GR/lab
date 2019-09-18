const charWithAccent = ['ά', 'έ', 'ή', 'ί', 'ϊ', 'ΐ', 'ό', 'ύ', 'ΰ', 'ώ', 'Ά', 'Έ', 'Ή', 'Ί', 'Ύ', 'Ό', 'Ώ',];
const charWithoutAccent = ['α', 'ε', 'η', 'ι', 'ι', 'ι', 'ο', 'υ', 'υ', 'ω', 'Α', 'Ε', 'Η', 'Ι', 'Υ', 'Ο', 'Ω',];

const stringWithAccent = charWithAccent.join('');

export const removeAccent = (text) => {
  return text.replace(/./g, function (l) {
    const index = stringWithAccent.indexOf(l);
    return index >= 0 ? charWithoutAccent[index] : l;
  });
};

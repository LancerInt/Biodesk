import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TM_BRANDS = ['Ecoza', 'Admira', 'Spindura'];

const splitBrand = (name) => {
  if (!name) return { head: '', tail: '' };
  for (const brand of TM_BRANDS) {
    if (name.startsWith(brand + ' ')) {
      return { head: brand, tail: name.slice(brand.length) };
    }
  }
  return { head: name, tail: '' };
};

const ProductName = ({ name, style, numberOfLines, tmStyle, suffix = '', tmAfter }) => {
  const flat = StyleSheet.flatten(style) || {};
  const baseSize = flat.fontSize || 14;
  const tmFontSize = Math.max(8, Math.round(baseSize * 0.5));
  // tmAfter lets a caller place the mark explicitly (Neutabs uses a
  // different lockup for some products, e.g. IGreen™ NPK vs IGreen NPK™).
  const { head, tail } = tmAfter && name.startsWith(tmAfter)
    ? { head: tmAfter, tail: name.slice(tmAfter.length) }
    : splitBrand(name);

  const tmInherent = {
    fontSize: tmFontSize,
    lineHeight: tmFontSize + 1,
    color: flat.color,
    fontWeight: '400',
  };

  return (
    <View style={styles.row}>
      <Text style={style} numberOfLines={numberOfLines}>{head}</Text>
      <Text style={[tmInherent, tmStyle]}>{'™'}</Text>
      {(tail || suffix) ? (
        <Text style={style} numberOfLines={numberOfLines}>{tail}{suffix}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
});

export default ProductName;

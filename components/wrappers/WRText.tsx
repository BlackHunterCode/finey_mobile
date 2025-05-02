import { useAppTheme } from '@/context/theme-context';
import React, { forwardRef } from 'react';
import { Text as RNText, TextProps } from 'react-native';

const WRText = forwardRef<React.ComponentRef<typeof RNText>, TextProps>((props, ref) => {
  const { theme } = useAppTheme();
  return (
    <RNText
      ref={ref}
      {...props}
      style={[
        { 
          fontFamily: theme.fonts.regular.fontFamily, 
          fontWeight: theme.fonts.regular.fontWeight,
          includeFontPadding: false,
          textAlignVertical: 'center',
          color: theme.colors.text,
        }, 
        props.style
      ]}
    />
  );
});

export default WRText;
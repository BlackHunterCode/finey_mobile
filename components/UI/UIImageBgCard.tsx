import { useAppTheme } from '@/context/theme-context';
import { Props } from '@/types/JSXTypes';
import React from 'react';
import { Dimensions, ImageBackground, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface ImageBgCardProps extends Props {
  /**
   * Image source to be used as background
   */
  imageSource: ImageSourcePropType;
  
  /**
   * Optional styles for the image background
   */
  imageStyle?: StyleProp<ViewStyle>;
  
  /**
   * Optional border radius for the card and image
   * @default 8
   */
  borderRadius?: number;
  
  /**
   * Optional overlay opacity to darken or lighten the image
   * @default 0.3
   */
  overlayOpacity?: number;
  
  /**
   * Optional overlay color
   * @default 'black'
   */
  overlayColor?: string;
  
  /**
   * Whether the card should take full width
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * A card component with an image background
 * @param props Component properties
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function ImageBgCard({ 
  children, 
  style, 
  imageSource, 
  imageStyle,
  borderRadius = 8,
  overlayOpacity = 0.3,
  overlayColor = 'black',
  fullWidth = false
}: ImageBgCardProps) {
  const { theme } = useAppTheme();
  const windowWidth = Dimensions.get('window').width;
  
  // Base style for the card container - following UICard pattern
  const baseStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 3,
    width: fullWidth ? '100%' : 'auto',
  };
  
  const componentStyle = StyleSheet.create({
    cardContainer: {
      ...baseStyle,
      ...(style as ViewStyle)
    },
    imageBackground: {
      width: '100%',
      justifyContent: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: overlayColor,
      opacity: overlayOpacity,
      borderRadius,
    },
    contentContainer: {
      padding: 16,
      position: 'relative',
      zIndex: 1,
    }
  });

  return (
    <View style={componentStyle.cardContainer}>
      <ImageBackground 
        source={imageSource}
        style={[componentStyle.imageBackground, imageStyle]}
        imageStyle={{ borderRadius }}
        resizeMode="cover"
      >
        <View style={componentStyle.overlay} />
        <View style={componentStyle.contentContainer}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
}
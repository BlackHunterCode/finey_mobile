import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import WRText from '../wrappers/WRText';

interface ReviewItem {
  author: string;
  text: string;
  rating: number; // 1..5
}

interface UIReviewsCarouselProps {
  reviews: ReviewItem[];
  style?: StyleProp<ViewStyle>;
}

export default function UIReviewsCarousel({ reviews, style }: UIReviewsCarouselProps) {
  const { theme } = useAppTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
      ...(style as ViewStyle),
    },
    scroll: {
      paddingHorizontal: 10,
    },
    card: {
      width: 240,
      marginRight: 12,
      borderRadius: 14,
      padding: 12,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    starsRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    authorRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
  }), [style, theme]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {reviews.map((r, idx) => (
          <View key={`${r.author}-${idx}`} style={styles.card}>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < r.rating ? 'star' : 'star-outline'}
                  size={16}
                  color={theme.colors.primary}
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <WRText style={{ fontSize: 13, opacity: 0.9 }}>{r.text}</WRText>
            <View style={styles.authorRow}>
              <WRText style={{ fontSize: 12, opacity: 0.7 }}>— {r.author}</WRText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


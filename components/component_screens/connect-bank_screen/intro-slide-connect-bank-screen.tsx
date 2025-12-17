import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";

export default function IntroSlideConnectBankScreen() {

  const e1x = useSharedValue(0);
  const e1y = useSharedValue(0);
  const e2x = useSharedValue(0);
  const e2y = useSharedValue(0);
  const e3x = useSharedValue(0);
  const e3y = useSharedValue(0);
  const e4x = useSharedValue(0);
  const e4y = useSharedValue(0);
  const e5x = useSharedValue(0);
  const e5y = useSharedValue(0);
  const e6x = useSharedValue(0);
  const e6y = useSharedValue(0);
  const e7x = useSharedValue(0);
  const e7y = useSharedValue(0);
  const e8x = useSharedValue(0);
  const e8y = useSharedValue(0);
  const e9x = useSharedValue(0);
  const e9y = useSharedValue(0);
  const e10x = useSharedValue(0);
  const e10y = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const MAX = 20;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [bases, setBases] = useState<Array<{ startX: number; startY: number; minX: number; maxX: number; minY: number; maxY: number }>>([]);

  useEffect(() => {
    if (width <= 0 || height <= 0) return;
    const size = 36;
    const makeBase = () => {
      const minX = 0;
      const maxX = Math.max(width - size, 0);
      const minY = 0;
      const maxY = Math.max(height - size, 0);
      const startX = minX + Math.random() * (maxX - minX);
      const startY = minY + Math.random() * (maxY - minY);
      return { startX, startY, minX, maxX, minY, maxY };
    };
    const newBases = [makeBase(), makeBase(), makeBase(), makeBase(), makeBase(), makeBase(), makeBase(), makeBase(), makeBase(), makeBase()];
    setBases(newBases);

    const speed = (baseRange: number, jitter: number = 0.05) => 32 * (1 - jitter + Math.random() * (2 * jitter));

    const r1x = newBases[0].maxX - newBases[0].minX;
    const r1y = newBases[0].maxY - newBases[0].minY;
    const r2x = newBases[1].maxX - newBases[1].minX;
    const r2y = newBases[1].maxY - newBases[1].minY;
    const r3x = newBases[2].maxX - newBases[2].minX;
    const r3y = newBases[2].maxY - newBases[2].minY;
    const r4x = newBases[3].maxX - newBases[3].minX;
    const r4y = newBases[3].maxY - newBases[3].minY;
    const r5x = newBases[4].maxX - newBases[4].minX;
    const r5y = newBases[4].maxY - newBases[4].minY;
    const r6x = newBases[5].maxX - newBases[5].minX;
    const r6y = newBases[5].maxY - newBases[5].minY;
    const r7x = newBases[6].maxX - newBases[6].minX;
    const r7y = newBases[6].maxY - newBases[6].minY;
    const r8x = newBases[7].maxX - newBases[7].minX;
    const r8y = newBases[7].maxY - newBases[7].minY;
    const r9x = newBases[8].maxX - newBases[8].minX;
    const r9y = newBases[8].maxY - newBases[8].minY;
    const r10x = newBases[9].maxX - newBases[9].minX;
    const r10y = newBases[9].maxY - newBases[9].minY;

    const s1x = speed(r1x), s1y = speed(r1y);
    const s2x = speed(r2x), s2y = speed(r2y);
    const s3x = speed(r3x), s3y = speed(r3y);
    const s4x = speed(r4x), s4y = speed(r4y);
    const s5x = speed(r5x), s5y = speed(r5y);
    const s6x = speed(r6x), s6y = speed(r6y);
    const s7x = speed(r7x), s7y = speed(r7y);
    const s8x = speed(r8x), s8y = speed(r8y);
    const s9x = speed(r9x), s9y = speed(r9y);
    const s10x = speed(r10x), s10y = speed(r10y);

    const d1x = Math.max(300, Math.round((r1x / s1x) * 1000));
    const d1y = Math.max(300, Math.round((r1y / s1y) * 1000));
    const d2x = Math.max(300, Math.round((r2x / s2x) * 1000));
    const d2y = Math.max(300, Math.round((r2y / s2y) * 1000));
    const d3x = Math.max(300, Math.round((r3x / s3x) * 1000));
    const d3y = Math.max(300, Math.round((r3y / s3y) * 1000));
    const d4x = Math.max(300, Math.round((r4x / s4x) * 1000));
    const d4y = Math.max(300, Math.round((r4y / s4y) * 1000));
    const d5x = Math.max(300, Math.round((r5x / s5x) * 1000));
    const d5y = Math.max(300, Math.round((r5y / s5y) * 1000));
    const d6x = Math.max(300, Math.round((r6x / s6x) * 1000));
    const d6y = Math.max(300, Math.round((r6y / s6y) * 1000));
    const d7x = Math.max(300, Math.round((r7x / s7x) * 1000));
    const d7y = Math.max(300, Math.round((r7y / s7y) * 1000));
    const d8x = Math.max(300, Math.round((r8x / s8x) * 1000));
    const d8y = Math.max(300, Math.round((r8y / s8y) * 1000));
    const d9x = Math.max(300, Math.round((r9x / s9x) * 1000));
    const d9y = Math.max(300, Math.round((r9y / s9y) * 1000));
    const d10x = Math.max(300, Math.round((r10x / s10x) * 1000));
    const d10y = Math.max(300, Math.round((r10y / s10y) * 1000));

    const i1x = newBases[0].startX, i1y = newBases[0].startY;
    const i2x = newBases[1].startX, i2y = newBases[1].startY;
    const i3x = newBases[2].startX, i3y = newBases[2].startY;
    const i4x = newBases[3].startX, i4y = newBases[3].startY;
    const i5x = newBases[4].startX, i5y = newBases[4].startY;
    const i6x = newBases[5].startX, i6y = newBases[5].startY;
    const i7x = newBases[6].startX, i7y = newBases[6].startY;
    const i8x = newBases[7].startX, i8y = newBases[7].startY;
    const i9x = newBases[8].startX, i9y = newBases[8].startY;
    const i10x = newBases[9].startX, i10y = newBases[9].startY;

    const pick = (a: number, b: number) => (Math.random() < 0.5 ? a : b);
    const first1x = pick(newBases[0].minX, newBases[0].maxX);
    const first1y = pick(newBases[0].minY, newBases[0].maxY);
    const first2x = pick(newBases[1].minX, newBases[1].maxX);
    const first2y = pick(newBases[1].minY, newBases[1].maxY);
    const first3x = pick(newBases[2].minX, newBases[2].maxX);
    const first3y = pick(newBases[2].minY, newBases[2].maxY);
    const first4x = pick(newBases[3].minX, newBases[3].maxX);
    const first4y = pick(newBases[3].minY, newBases[3].maxY);
    const first5x = pick(newBases[4].minX, newBases[4].maxX);
    const first5y = pick(newBases[4].minY, newBases[4].maxY);
    const first6x = pick(newBases[5].minX, newBases[5].maxX);
    const first6y = pick(newBases[5].minY, newBases[5].maxY);
    const first7x = pick(newBases[6].minX, newBases[6].maxX);
    const first7y = pick(newBases[6].minY, newBases[6].maxY);
    const first8x = pick(newBases[7].minX, newBases[7].maxX);
    const first8y = pick(newBases[7].minY, newBases[7].maxY);
    const first9x = pick(newBases[8].minX, newBases[8].maxX);
    const first9y = pick(newBases[8].minY, newBases[8].maxY);
    const first10x = pick(newBases[9].minX, newBases[9].maxX);
    const first10y = pick(newBases[9].minY, newBases[9].maxY);

    const d1xInit = Math.max(100, Math.round((Math.abs(first1x - i1x) / s1x) * 1000));
    const d1yInit = Math.max(100, Math.round((Math.abs(first1y - i1y) / s1y) * 1000));
    const d2xInit = Math.max(100, Math.round((Math.abs(first2x - i2x) / s2x) * 1000));
    const d2yInit = Math.max(100, Math.round((Math.abs(first2y - i2y) / s2y) * 1000));
    const d3xInit = Math.max(100, Math.round((Math.abs(first3x - i3x) / s3x) * 1000));
    const d3yInit = Math.max(100, Math.round((Math.abs(first3y - i3y) / s3y) * 1000));
    const d4xInit = Math.max(100, Math.round((Math.abs(first4x - i4x) / s4x) * 1000));
    const d4yInit = Math.max(100, Math.round((Math.abs(first4y - i4y) / s4y) * 1000));
    const d5xInit = Math.max(100, Math.round((Math.abs(first5x - i5x) / s5x) * 1000));
    const d5yInit = Math.max(100, Math.round((Math.abs(first5y - i5y) / s5y) * 1000));
    const d6xInit = Math.max(100, Math.round((Math.abs(first6x - i6x) / s6x) * 1000));
    const d6yInit = Math.max(100, Math.round((Math.abs(first6y - i6y) / s6y) * 1000));
    const d7xInit = Math.max(100, Math.round((Math.abs(first7x - i7x) / s7x) * 1000));
    const d7yInit = Math.max(100, Math.round((Math.abs(first7y - i7y) / s7y) * 1000));
    const d8xInit = Math.max(100, Math.round((Math.abs(first8x - i8x) / s8x) * 1000));
    const d8yInit = Math.max(100, Math.round((Math.abs(first8y - i8y) / s8y) * 1000));
    const d9xInit = Math.max(100, Math.round((Math.abs(first9x - i9x) / s9x) * 1000));
    const d9yInit = Math.max(100, Math.round((Math.abs(first9y - i9y) / s9y) * 1000));
    const d10xInit = Math.max(100, Math.round((Math.abs(first10x - i10x) / s10x) * 1000));
    const d10yInit = Math.max(100, Math.round((Math.abs(first10y - i10y) / s10y) * 1000));

    const other1x = first1x === newBases[0].minX ? newBases[0].maxX : newBases[0].minX;
    const other1y = first1y === newBases[0].minY ? newBases[0].maxY : newBases[0].minY;
    const other2x = first2x === newBases[1].minX ? newBases[1].maxX : newBases[1].minX;
    const other2y = first2y === newBases[1].minY ? newBases[1].maxY : newBases[1].minY;
    const other3x = first3x === newBases[2].minX ? newBases[2].maxX : newBases[2].minX;
    const other3y = first3y === newBases[2].minY ? newBases[2].maxY : newBases[2].minY;
    const other4x = first4x === newBases[3].minX ? newBases[3].maxX : newBases[3].minX;
    const other4y = first4y === newBases[3].minY ? newBases[3].maxY : newBases[3].minY;
    const other5x = first5x === newBases[4].minX ? newBases[4].maxX : newBases[4].minX;
    const other5y = first5y === newBases[4].minY ? newBases[4].maxY : newBases[4].minY;
    const other6x = first6x === newBases[5].minX ? newBases[5].maxX : newBases[5].minX;
    const other6y = first6y === newBases[5].minY ? newBases[5].maxY : newBases[5].minY;
    const other7x = first7x === newBases[6].minX ? newBases[6].maxX : newBases[6].minX;
    const other7y = first7y === newBases[6].minY ? newBases[6].maxY : newBases[6].minY;
    const other8x = first8x === newBases[7].minX ? newBases[7].maxX : newBases[7].minX;
    const other8y = first8y === newBases[7].minY ? newBases[7].maxY : newBases[7].minY;
    const other9x = first9x === newBases[8].minX ? newBases[8].maxX : newBases[8].minX;
    const other9y = first9y === newBases[8].minY ? newBases[8].maxY : newBases[8].minY;
    const other10x = first10x === newBases[9].minX ? newBases[9].maxX : newBases[9].minX;
    const other10y = first10y === newBases[9].minY ? newBases[9].maxY : newBases[9].minY;

    const delay = () => Math.floor(Math.random() * 900);

    e1x.value = i1x;
    e1x.value = withSequence(
      withDelay(delay(), withTiming(first1x, { duration: d1xInit, easing: Easing.linear })),
      withRepeat(withTiming(other1x, { duration: d1x, easing: Easing.linear }), -1, true)
    );
    e1y.value = i1y;
    e1y.value = withSequence(
      withDelay(delay(), withTiming(first1y, { duration: d1yInit, easing: Easing.linear })),
      withRepeat(withTiming(other1y, { duration: d1y, easing: Easing.linear }), -1, true)
    );

    e2x.value = i2x;
    e2x.value = withSequence(
      withDelay(delay(), withTiming(first2x, { duration: d2xInit, easing: Easing.linear })),
      withRepeat(withTiming(other2x, { duration: d2x, easing: Easing.linear }), -1, true)
    );
    e2y.value = i2y;
    e2y.value = withSequence(
      withDelay(delay(), withTiming(first2y, { duration: d2yInit, easing: Easing.linear })),
      withRepeat(withTiming(other2y, { duration: d2y, easing: Easing.linear }), -1, true)
    );

    e3x.value = i3x;
    e3x.value = withSequence(
      withDelay(delay(), withTiming(first3x, { duration: d3xInit, easing: Easing.linear })),
      withRepeat(withTiming(other3x, { duration: d3x, easing: Easing.linear }), -1, true)
    );
    e3y.value = i3y;
    e3y.value = withSequence(
      withDelay(delay(), withTiming(first3y, { duration: d3yInit, easing: Easing.linear })),
      withRepeat(withTiming(other3y, { duration: d3y, easing: Easing.linear }), -1, true)
    );

    e4x.value = i4x;
    e4x.value = withSequence(
      withDelay(delay(), withTiming(first4x, { duration: d4xInit, easing: Easing.linear })),
      withRepeat(withTiming(other4x, { duration: d4x, easing: Easing.linear }), -1, true)
    );
    e4y.value = i4y;
    e4y.value = withSequence(
      withDelay(delay(), withTiming(first4y, { duration: d4yInit, easing: Easing.linear })),
      withRepeat(withTiming(other4y, { duration: d4y, easing: Easing.linear }), -1, true)
    );

    e5x.value = i5x;
    e5x.value = withSequence(
      withDelay(delay(), withTiming(first5x, { duration: d5xInit, easing: Easing.linear })),
      withRepeat(withTiming(other5x, { duration: d5x, easing: Easing.linear }), -1, true)
    );
    e5y.value = i5y;
    e5y.value = withSequence(
      withDelay(delay(), withTiming(first5y, { duration: d5yInit, easing: Easing.linear })),
      withRepeat(withTiming(other5y, { duration: d5y, easing: Easing.linear }), -1, true)
    );

    e6x.value = i6x;
    e6x.value = withSequence(
      withDelay(delay(), withTiming(first6x, { duration: d6xInit, easing: Easing.linear })),
      withRepeat(withTiming(other6x, { duration: d6x, easing: Easing.linear }), -1, true)
    );
    e6y.value = i6y;
    e6y.value = withSequence(
      withDelay(delay(), withTiming(first6y, { duration: d6yInit, easing: Easing.linear })),
      withRepeat(withTiming(other6y, { duration: d6y, easing: Easing.linear }), -1, true)
    );

    e7x.value = i7x;
    e7x.value = withSequence(
      withDelay(delay(), withTiming(first7x, { duration: d7xInit, easing: Easing.linear })),
      withRepeat(withTiming(other7x, { duration: d7x, easing: Easing.linear }), -1, true)
    );
    e7y.value = i7y;
    e7y.value = withSequence(
      withDelay(delay(), withTiming(first7y, { duration: d7yInit, easing: Easing.linear })),
      withRepeat(withTiming(other7y, { duration: d7y, easing: Easing.linear }), -1, true)
    );

    e8x.value = i8x;
    e8x.value = withSequence(
      withDelay(delay(), withTiming(first8x, { duration: d8xInit, easing: Easing.linear })),
      withRepeat(withTiming(other8x, { duration: d8x, easing: Easing.linear }), -1, true)
    );
    e8y.value = i8y;
    e8y.value = withSequence(
      withDelay(delay(), withTiming(first8y, { duration: d8yInit, easing: Easing.linear })),
      withRepeat(withTiming(other8y, { duration: d8y, easing: Easing.linear }), -1, true)
    );

    e9x.value = i9x;
    e9x.value = withSequence(
      withDelay(delay(), withTiming(first9x, { duration: d9xInit, easing: Easing.linear })),
      withRepeat(withTiming(other9x, { duration: d9x, easing: Easing.linear }), -1, true)
    );
    e9y.value = i9y;
    e9y.value = withSequence(
      withDelay(delay(), withTiming(first9y, { duration: d9yInit, easing: Easing.linear })),
      withRepeat(withTiming(other9y, { duration: d9y, easing: Easing.linear }), -1, true)
    );

    e10x.value = i10x;
    e10x.value = withSequence(
      withDelay(delay(), withTiming(first10x, { duration: d10xInit, easing: Easing.linear })),
      withRepeat(withTiming(other10x, { duration: d10x, easing: Easing.linear }), -1, true)
    );
    e10y.value = i10y;
    e10y.value = withSequence(
      withDelay(delay(), withTiming(first10y, { duration: d10yInit, easing: Easing.linear })),
      withRepeat(withTiming(other10y, { duration: d10y, easing: Easing.linear }), -1, true)
    );
  }, [width, height, e1x, e1y, e2x, e2y, e3x, e3y, e4x, e4y, e5x, e5y, e6x, e6y, e7x, e7y, e8x, e8y, e9x, e9y, e10x, e10y]);

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateX: e1x.value + tiltX.value }, { translateY: e1y.value + tiltY.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateX: e2x.value + tiltX.value }, { translateY: e2y.value + tiltY.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateX: e3x.value + tiltX.value }, { translateY: e3y.value + tiltY.value }] }));
  const s4 = useAnimatedStyle(() => ({ transform: [{ translateX: e4x.value + tiltX.value }, { translateY: e4y.value + tiltY.value }] }));
  const s5 = useAnimatedStyle(() => ({ transform: [{ translateX: e5x.value + tiltX.value }, { translateY: e5y.value + tiltY.value }] }));
  const s6 = useAnimatedStyle(() => ({ transform: [{ translateX: e6x.value + tiltX.value }, { translateY: e6y.value + tiltY.value }] }));
  const s7 = useAnimatedStyle(() => ({ transform: [{ translateX: e7x.value + tiltX.value }, { translateY: e7y.value + tiltY.value }] }));
  const s8 = useAnimatedStyle(() => ({ transform: [{ translateX: e8x.value + tiltX.value }, { translateY: e8y.value + tiltY.value }] }));
  const s9 = useAnimatedStyle(() => ({ transform: [{ translateX: e9x.value + tiltX.value }, { translateY: e9y.value + tiltY.value }] }));
  const s10 = useAnimatedStyle(() => ({ transform: [{ translateX: e10x.value + tiltX.value }, { translateY: e10y.value + tiltY.value }] }));

  return (
    <View
      style={styles.slide}
      onLayout={(e) => {
        const { width: w, height: h } = e.nativeEvent.layout;
        setWidth(w);
        setHeight(h);
      }}
      onTouchMove={(e) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        const tx = Math.max(Math.min((x % (MAX * 2)) - MAX, MAX), -MAX);
        const ty = Math.max(Math.min((y % (MAX * 2)) - MAX, MAX), -MAX);
        tiltX.value = withTiming(tx, { duration: 180, easing: Easing.linear });
        tiltY.value = withTiming(ty, { duration: 180, easing: Easing.linear });
      }}
      onTouchEnd={() => {
        tiltX.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) });
        tiltY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) });
      }}
    >
      <View style={styles.emojiLayer} pointerEvents="none">
        {bases.length === 10 && (
          <>
            <Animated.Text style={[styles.emoji, styles.emojiLg, { top: 0, left: 0 }, s1]}>✨</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiSm, { top: 0, left: 0 }, s2]}>💚</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiLg, { top: 0, left: 0 }, s3]}>📈</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiSm, { top: 0, left: 0 }, s4]}>🔒</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiSm, { top: 0, left: 0 }, s5]}>💸</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiXLg, { top: 0, left: 0 }, s6]}>💰</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiLg, { top: 0, left: 0 }, s7]}>⚡</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiXLg, { top: 0, left: 0 }, s8]}>🏆</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiLg, { top: 0, left: 0 }, s9]}>🎯</Animated.Text>
            <Animated.Text style={[styles.emoji, styles.emojiSm, { top: 0, left: 0 }, s10]}>📊</Animated.Text>
          </>
        )}
      </View>
      <BlurView intensity={20} tint="default" style={styles.glass}>
        <AnimatedTitle>{"Parabéns pela sua atitude 🎉"}</AnimatedTitle>
        <WRText style={styles.subtitle}>Obrigado por confiar no Finey. Você deu um passo importante rumo a uma vida financeira melhor 💚</WRText>
      </BlurView>
    </View>
  );
}

function AnimatedTitle({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, [opacity, translateY]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  return <Animated.Text style={[styles.title, style, { color: theme.colors.text }]}>{children as any}</Animated.Text>;
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    position: "relative",
  },
  emojiLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  emoji: {
    position: "absolute",
    fontSize: 36,
    opacity: 0.25,
  },
  emojiSm: {
    fontSize: 28,
  },
  emojiLg: {
    fontSize: 56,
  },
  emojiXLg: {
    fontSize: 86,
  },
  glass: {
    width: "92%",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF10",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
  },
});

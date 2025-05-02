import { ReactNode } from "react"
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native"

export type Props = {
    children: ReactNode,
    style?: ViewStyle | TextStyle | ImageStyle | Array<ViewStyle | TextStyle | ImageStyle>
}
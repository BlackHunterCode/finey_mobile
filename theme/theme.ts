interface FontStyle { 
    fontFamily: string;
    fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}

interface FontStyle {
    fontFamily: string;
    fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}
interface TimeColor {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}
interface TextTimeColor {
  light: TimeColor,
  regular: TimeColor,
  semiBold: TimeColor,
  bold: TimeColor,
}
export interface AppTheme {
  colors: {
    primary: string;
    primaryGradient: string[];
    background: string;
    card: string;
    text: string;
    muted: string;
    border: string;
    notification: string;
    dividerColor: string;
  },
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    semiBold: FontStyle;
    bold: FontStyle;
  },
  timeColors: {
    text: TextTimeColor;
  },
  icons: {
    backgroundColor: string;
  }
}

export const lightTheme: AppTheme = {
    colors: {
        primary: '#6823D1',
        primaryGradient: ['#6823D1', '#46198B'],
        background: '#F1F0F5',
        card: '#ffffff',
        text: '#000000',
        muted: "#868686",
        border: '#c7c7c7',
        notification: '#ff80ab',
        dividerColor: "#BFBFBF"
      },
    fonts: {
        regular: { fontFamily: 'SF-PRO-DISPLAY-REGULAR', fontWeight: '400' },
        medium: { fontFamily: 'SF-PRO-DISPLAY-MEDIUM', fontWeight: '500' },
        semiBold: { fontFamily: 'SF-PRO-DISPLAY-MEDIUM', fontWeight: '600' },
        bold: { fontFamily: 'SF-PRO-DISPLAY-BOLD', fontWeight: '700' },
    },
    timeColors: {
        text: {
            light: {
                morning: '#E5B2F8',
                afternoon: '#FFE6CB',
                evening: '#95BAFF',
                night: '#FFFFFF',
            },
            regular: {
                morning: '#E5B2F8',
                afternoon: '#FFE6CB',
                evening: '#95BAFF',
                night: '#FFFFFF',
            },
            semiBold: {
                morning: '#8143BF',
                afternoon: '#FB8915',
                evening: '#3E77E3',
                night: '#FFFFFF',
            },
            bold: {
                morning: '#8143BF',
                afternoon: '#FB8915',
                evening: '#3E77E3',
                night: '#FFFFFF',
            },
        }
    },
  icons: {
    backgroundColor: "#ECECEC"
  } 
}

export const darkTheme: AppTheme = {
    colors: {
        primary: '#6823D1',
        primaryGradient: ['#6823D1', '#46198B'],
        background: '#F1F0F5',
        card: '#ffffff',
        text: '#000000',
        muted: "#868686",
        border: '#c7c7c7',
        notification: '#ff80ab',
        dividerColor: "#BFBFBF"
      },
    fonts: {
        regular: { fontFamily: 'SF-PRO-DISPLAY-REGULAR', fontWeight: '400' },
        medium: { fontFamily: 'SF-PRO-DISPLAY-MEDIUM', fontWeight: '500' },
        semiBold: { fontFamily: 'SF-PRO-DISPLAY-MEDIUM', fontWeight: '600' },
        bold: { fontFamily: 'SF-PRO-DISPLAY-BOLD', fontWeight: '700' },
    },

    timeColors: {
        text: {
            light: {
                morning: '#E5B2F8',
                afternoon: '#FFE6CB',
                evening: '#95BAFF',
                night: '#FFFFFF',
            },
            regular: {
                morning: '#E5B2F8',
                afternoon: '#FFE6CB',
                evening: '#95BAFF',
                night: '#FFFFFF',
            },
            semiBold: {
                morning: '#8143BF',
                afternoon: '#FB8915',
                evening: '#3E77E3',
                night: '#FFFFFF',
            },
            bold: {
                morning: '#8143BF',
                afternoon: '#FB8915',
                evening: '#3E77E3',
                night: '#FFFFFF',
            },
        }
    },
    icons: {
        backgroundColor: "#ECECEC"
    } 
}
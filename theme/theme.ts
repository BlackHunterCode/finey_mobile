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
    error: string;
    success: string;
    warning: string;
    info: string;
    danger: string;
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
        dividerColor: "#BFBFBF",
        error: '#FF0000',
        success: '#00FF00',
        warning: '#FFFF00',
        info: '#0000FF',
        danger: '#FF0000',
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
    primary: '#A58BFF', // tom mais claro para melhor visibilidade no escuro
    primaryGradient: ['#A58BFF', '#6A4ACF'],
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    muted: "#B0B0B0",
    border: '#3A3A3A',
    notification: '#FF80AB',
    dividerColor: "#3D3D3D",
    error: '#FF6B6B',
    success: '#00FF00',
    warning: '#FFFF00',
    info: '#0000FF',
    danger: '#FF0000',
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
        morning: '#D9B4F7',
        afternoon: '#FFD8A3',
        evening: '#8CB4FF',
        night: '#FFFFFF',
      },
      regular: {
        morning: '#D9B4F7',
        afternoon: '#FFD8A3',
        evening: '#8CB4FF',
        night: '#FFFFFF',
      },
      semiBold: {
        morning: '#C792EA',
        afternoon: '#FFAA4D',
        evening: '#5A9BFF',
        night: '#FFFFFF',
      },
      bold: {
        morning: '#C792EA',
        afternoon: '#FFAA4D',
        evening: '#5A9BFF',
        night: '#FFFFFF',
      },
    }
  },
  icons: {
    backgroundColor: "#2A2A2A"
  }
}

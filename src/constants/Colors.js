/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  appContainer: {
    bg: '#0F172A',
  },
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  submitButton: {
    background: '#000',
    text: '#fff',
  },
  textview: {
    background: '#fff',
  },
  textcard: {
    text: '#fff',
    postInfo: 'rgba(255,255,255,0.8)',
    iconContainer: '#000',
    vote: '#FFD700',
    content: '#fff',
    background: '#000',
    iconVote: '#FFD700',
  },
  imagecard: {
    text: '#000',
    postInfo: 'rgba(0,0,0,0.6)',
    iconContainer: '#fff',
    vote: '#FFD700',
    background: '#fff',
    iconVote: '#FFD700',
  },
};

export const DARK_COLORS = {
  background: Colors.appContainer.bg,
  cardBackground: Colors.appContainer.bg,
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  iconDefault: '#fff',
  heartActive: '#FF3040',
};

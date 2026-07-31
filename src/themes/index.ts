import { barbieDarkTheme, barbieLightTheme } from './barbie';
import { defaultDarkTheme, defaultLightTheme } from './default';
import { monokaiDarkTheme, monokaiLightTheme } from './monokai';
import { solarizedDarkTheme, solarizedLightTheme } from './solarized';

export type ThemeName = 'default' | 'barbie' | 'solarized' | 'monokai'
export type ThemeMode = 'light' | 'dark'

export function getTheme(name: ThemeName, mode: ThemeMode) {
  if (name === 'barbie') return mode === 'light' ? barbieLightTheme : barbieDarkTheme
  if (name === 'solarized') return mode === 'light' ? solarizedLightTheme : solarizedDarkTheme
  if (name === 'monokai') return mode === 'light' ? monokaiLightTheme : monokaiDarkTheme
  return mode === 'light' ? defaultLightTheme : defaultDarkTheme
}

export default {
  defaultLightTheme,
  defaultDarkTheme,
  barbieLightTheme,
  barbieDarkTheme,
  solarizedLightTheme,
  solarizedDarkTheme,
  monokaiLightTheme,
  monokaiDarkTheme,
  getTheme,
}

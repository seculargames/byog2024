import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss';
import tailwindtypoplugin from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
        tailwindtypoplugin,
        plugin(function ({ matchUtilities, theme }) {
      const flattenedColors = Object.entries(theme('colors')).reduce((acc, [key, value]) => {
        if (typeof value === 'string') acc[key] = value;
        else {
          Object.entries(value).forEach(([number, color]) => {
            acc[`${key}-${number}`] = color;
          });
        }
        return acc;
      }, {});
      matchUtilities(
        {
          'meter-bar': (value) => ({
            backgroundColor: value,
            '&::-webkit-meter-bar': {
              backgroundColor: value,
            },
          }),
          'meter-value': (value) => ({
            color: value,
            '&::-webkit-meter-value': {
              backgroundColor: value,
            },
            '&::-moz-meter-bar': {
              backgroundColor: value,
            },
          }),
        },
        {
          values: flattenedColors,
          variants: ['responsive'],
        },
      );
    }),
    ]
} as Config;

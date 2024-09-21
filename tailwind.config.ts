import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss';
import tailwindtypoplugin from '@tailwindcss/typography';
import flowbite from 'flowbite/plugin';

export default {
	content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite/**/*.{js,html,svelte,ts}'    
    ],
    darkMode: 'class',
	theme: {
		extend: {
            colors: {
                // flowbite-svelte
                primary: { 50: '#FFF5F2', 100: '#FFF1EE', 200: '#FFE4DE', 300: '#FFD5CC', 400: '#FFBCAD', 500: '#FE795D', 600: '#EF562F', 700: '#EB4F27', 800: '#CC4522', 900: '#A5371B'},
      }
        }
	},
	plugins: [
        flowbite,
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

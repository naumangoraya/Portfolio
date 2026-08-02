import js from '@eslint/js';
import globals from 'globals';
import next from 'eslint-config-next/core-web-vitals';

// Flat config: `next lint` was removed in Next 16, and ESLint 10 drops legacy
// .eslintrc support entirely.
//
// eslint-config-next 16 ships a native flat-config array (and already bundles
// the react, react-hooks and jsx-a11y plugins), so no FlatCompat bridge and no
// separate `plugin:react/recommended` extends are needed.
export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'public/**'],
  },

  js.configs.recommended,

  ...next,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': 'warn',

      // react-hooks v6 (shipped with eslint-config-next 16) turns on the React
      // Compiler rule set as errors. They flag several patterns here that are
      // deliberate and correct:
      //   - the "latest ref" assignment during render in FadeIn.js and
      //     useAdminResource.js, which must happen before ref callbacks fire
      //     in the commit phase, i.e. earlier than any effect can run;
      //   - the SSR-safe `setMounted(true)` mount effect in AdminModal.
      // The remaining hits are pre-existing effect patterns in the section
      // components. Kept visible as warnings rather than silenced, but not
      // failing the build — cleaning them up is its own piece of work.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',

      // Guard rail so the nine duplicated admin modals that were just removed
      // cannot grow back.
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "VariableDeclarator[id.name=/Modal$/] > CallExpression[callee.object.name='styled']",
          message:
            'Use src/components/admin/AdminModal.js instead of declaring another styled modal.',
        },
      ],
    },
  },

  {
    // Node scripts, not bundled.
    files: ['scripts/**/*.mjs', '*.config.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
];

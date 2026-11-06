import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', '.wrangler/', 'node_modules/'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  {
    rules: {
      // Safari/VoiceOver drops list semantics when list-style is removed;
      // role="list" on unstyled lists restores them.
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
    },
  },
];

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'prettier/react',
    ],
    rules: {
        'no-void': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
        'prefer-destructuring': 'warn',
        'import/no-named-as-default': 'off',
        'no-await-in-loop': 'off',
        'no-prototype-builtins': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
        // https://github.com/benmosher/eslint-plugin-import/issues/1453
        'import/no-cycle': 'off',
        'import/prefer-default-export': 'warn',
        // https://stackoverflow.com/q/42226436/2172566
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        // We should remove these when we're ready to worry about a11y
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/alt-text': 'off',
    },
    env: {
        browser: true,
    },
};

# Linting in FCA

### Introduction
This project uses both `eslint` and `prettier` for linting and formatting the code. This document provides a summary of the linting setup and the rules that are enforced.

### Formatting with Prettier
Prettier is used to enforce consistent formatting of the code. It is configured to throw warnings, not errors.

It's recommended to configure your code editor, such as VSCode, to format on save. This way, you'll always have a consistently formatted codebase.

To manually format your code, run the command:

```
npm run format
```

Current prettier config:
```
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "auto",
  "printWidth": 100,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```
### ESLint

#### Environment and Parser Options
The environment includes browser, node, and ES6.

The code is parsed as ES modules, and the ECMAScript version used is ES11.

#### ESLint Rules Explained
For detailed explanations of each ESLint rule, visit the [official ESLint rules documentation](https://eslint.org/docs/latest/rules).

### Customizing Rules
You have the flexibility to modify the rules' severity:

Turn off a rule completely
Set it as an error (breaks the linting)
Only display a warning (does not break linting)
You can adjust these in the rules section of the ESLint configuration.

### Conclusion
For maintainable and consistent code, always make sure to lint your code before committing.
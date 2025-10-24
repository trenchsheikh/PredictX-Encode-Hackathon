# 🎨 Prettier Setup for DarkBet

This document describes the Prettier configuration and setup for the DarkBet project.

## 📋 Overview

Prettier has been configured across all three main directories of the DarkBet project:

- **Root directory** - Frontend (Next.js, TypeScript, React)
- **Backend directory** - Node.js API (TypeScript, Express)
- **Contracts directory** - Smart contracts (Solidity)

## 🔧 Configuration Files

### Root Directory (Frontend)

- **`.prettierrc`** - Main Prettier configuration
- **`.prettierignore`** - Files and directories to ignore
- **`.vscode/settings.json`** - VS Code auto-formatting settings
- **`.vscode/extensions.json`** - Recommended VS Code extensions

### Backend Directory

- Uses the root `.prettierrc` configuration
- Has its own `format` and `format:check` scripts

### Contracts Directory

- **`.prettierrc`** - Solidity-specific configuration with `prettier-plugin-solidity`
- **`.prettierignore`** - Contract-specific ignore patterns

## 📦 Installed Packages

### Root Package.json

```json
{
  "devDependencies": {
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

### Backend Package.json

```json
{
  "devDependencies": {
    "prettier": "^3.0.0"
  }
}
```

### Contracts Package.json

```json
{
  "devDependencies": {
    "prettier": "^3.0.0",
    "prettier-plugin-solidity": "^1.3.0"
  }
}
```

## ⚙️ Configuration Details

### Frontend Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Solidity Configuration (contracts/.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 4,
  "useTabs": false,
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "plugins": ["prettier-plugin-solidity"]
}
```

## 🚀 Available Scripts

### Root Directory

```bash
npm run format          # Format all files
npm run format:check    # Check formatting without making changes
```

### Backend Directory

```bash
npm run format          # Format all backend files
npm run format:check    # Check backend formatting
```

### Contracts Directory

```bash
npm run format          # Format all contract files (including Solidity)
npm run format:check    # Check contract formatting
```

## 🔌 VS Code Integration

### Auto-formatting

- **Format on save** is enabled
- **Prettier** is set as the default formatter for all supported file types
- **ESLint** integration for code actions on save

### Supported File Types

- JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- JSON (`.json`)
- CSS (`.css`)
- HTML (`.html`)
- Markdown (`.md`)
- Solidity (`.sol`)

### Recommended Extensions

- `esbenp.prettier-vscode` - Prettier support
- `ms-vscode.vscode-typescript-next` - TypeScript support
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
- `JuanBlanco.solidity` - Solidity support
- `ms-vscode.vscode-json` - JSON support

## 📁 Ignored Files and Directories

### Root .prettierignore

- `node_modules/`
- Build outputs (`.next/`, `out/`, `dist/`, `build/`)
- Environment files (`.env*`)
- Logs and cache files
- Hardhat artifacts (`artifacts/`, `cache/`, `typechain-types/`)
- Package lock files
- OS and IDE files

### Contracts .prettierignore

- Hardhat-specific directories
- Node modules
- Generated files
- Environment files

## 🎯 Key Features

### Tailwind CSS Integration

- **Automatic class sorting** via `prettier-plugin-tailwindcss`
- Classes are sorted according to Tailwind's recommended order
- Works with both standard `className` and custom attributes

### Solidity Support

- **Automatic formatting** for `.sol` files
- Consistent indentation and spacing
- Proper function and struct formatting

### TypeScript/React Support

- **Full TypeScript support** with proper type formatting
- **JSX formatting** with appropriate line breaks
- **Import sorting** and organization

## 🔍 Usage Examples

### Format a single file

```bash
npx prettier --write path/to/file.ts
```

### Check formatting without changes

```bash
npx prettier --check path/to/file.ts
```

### Format specific directories

```bash
npx prettier --write app/ components/ lib/
```

### Format only changed files

```bash
npx prettier --write $(git diff --name-only --diff-filter=ACMR)
```

## 🛠️ Customization

### Adding new file types

Edit the appropriate `.prettierrc` file and add the file extension to the `overrides` section:

```json
{
  "overrides": [
    {
      "files": "*.custom",
      "options": {
        "parser": "custom-parser"
      }
    }
  ]
}
```

### Modifying formatting rules

Update the configuration in `.prettierrc` files:

```json
{
  "printWidth": 100, // Increase line length
  "tabWidth": 4, // Use 4 spaces instead of 2
  "singleQuote": false // Use double quotes
}
```

## 🚨 Troubleshooting

### Plugin not found errors

Ensure all required plugins are installed:

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss prettier-plugin-solidity
```

### VS Code not formatting

1. Install the Prettier VS Code extension
2. Set Prettier as the default formatter
3. Enable format on save in settings

### Conflicting with ESLint

Prettier and ESLint work together. ESLint handles code quality while Prettier handles formatting. Use `eslint-config-prettier` to avoid conflicts.

## 📚 Additional Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Prettier Plugin Tailwind CSS](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity)
- [VS Code Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## ✅ Status

All Prettier configurations have been successfully set up and tested:

- ✅ Frontend formatting configured
- ✅ Backend formatting configured
- ✅ Solidity formatting configured
- ✅ VS Code integration set up
- ✅ Initial formatting applied to all files
- ✅ Scripts added to package.json files

The project is now ready for consistent code formatting across all components!

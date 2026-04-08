const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.js')) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const processFile = (filePath) => {
  if (filePath.includes('theme.js') || filePath.includes('calculations.js') || filePath.includes('api.js') || filePath.includes('storage.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('colors')) return; // No colors used

  let isModified = false;

  // 1. Remove 'colors' from theme imports
  const themeImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"](.*?[/\\]styles[/\\]theme)['"]/g;
  content = content.replace(themeImportRegex, (match, imports, importPath) => {
    if (imports.includes('colors')) {
      isModified = true;
      let newImports = imports.replace(/colors\s*,?/, '').replace(/,\s*$/, '').trim();
      if (newImports.startsWith(',')) newImports = newImports.substring(1).trim();
      if (!newImports) return `// import removed`;
      return `import { ${newImports} } from '${importPath}'`;
    }
    return match;
  });

  if (!isModified && !content.includes('colors.')) return;

  // 2. Add useTheme import
  const relativeDepth = filePath.split(path.sep).length - path.resolve('./src').split(path.sep).length;
  const themeProviderPath = filePath.includes('App.js') ? './src/styles/ThemeProvider' : (relativeDepth > 1 ? '../../styles/ThemeProvider' : '../styles/ThemeProvider');
  
  if (!content.includes('useTheme')) {
     const lastImportIndex = content.lastIndexOf('import ');
     const endOfLastImport = content.indexOf('\n', lastImportIndex);
     content = content.slice(0, endOfLastImport + 1) + `import { useTheme } from '${themeProviderPath.replace(/\\/g, '/')}';\n` + content.slice(endOfLastImport + 1);
  }

  // 3. Transform StyleSheet.create
  if (content.includes('StyleSheet.create')) {
    content = content.replace(/const\s+styles\s*=\s*StyleSheet\.create\({/g, 'const getStyles = (colors) => StyleSheet.create({');
  }

  // 4. Inject useTheme into functional components
  // We look for standard component definitions: const Name = (...) => {
  const componentRegex = /const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*\{/g;
  content = content.replace(componentRegex, (match, compName) => {
    return `${match}\n  const { colors, isDark } = useTheme();\n  const styles = React.useMemo(() => getStyles(colors), [colors]);`;
  });

  // Handle AppNavigator (which is also a component)
  // Handle MainTabs inside AppNavigator
  if (filePath.includes('AppNavigator.js')) {
     content = content.replace(/const\s+MainTabs\s*=\s*\([^)]*\)\s*=>\s*\{/g, `const MainTabs = ({ onLogout }) => {\n  const { colors } = useTheme();`);
     // For AppNavigator, it doesn't have a StyleSheet, but uses colors inline
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
};

walk('src', (err, results) => {
  if (err) throw err;
  results.push(path.resolve('./App.js'));
  results.forEach(processFile);
  console.log('Done!');
});

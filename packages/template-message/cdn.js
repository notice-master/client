const envLib = {
  development: {
    react:
      'React@https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js',
    'react-dom':
      'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js',
    // 'react-router-dom':
    //   'https://cdn.jsdelivr.net/npm/react-router-dom@6.9.0/dist/react-router-dom.development.js',
  },
  production: {
    react:
      'React@https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
    'react-dom':
      'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
    // 'react-router-dom':
    //   'https://cdn.jsdelivr.net/npm/react-router-dom@6.9.0/dist/react-router-dom.production.min.js',
  },
};
module.exports = {
  cdn: (mode) => {
    return {
      ...envLib[mode],
      // ...lib,
    };
  },
  esm: (name, mode, version) =>
    `https://esm.sh/${name}${version ? '@' + version : ''}${
      mode === 'development' ? '?dev' : ''
    }`,
};

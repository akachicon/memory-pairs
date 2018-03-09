let allTestFiles = [];
let TEST_REGEXP = /spec\.js$/i;

Object.keys(window.__karma__.files).forEach(function (file) {
  if (TEST_REGEXP.test(file)) {
    let normalizedTestModule = file.replace(/^\/base\/js\/|\.js$/g, '');

    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  baseUrl: '/base/js',

  paths: {
    jquery: 'lib/jquery.min',
    howler: 'lib/howler.min',
  },

  deps: allTestFiles,

  callback: window.__karma__.start
});

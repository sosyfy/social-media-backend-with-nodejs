
const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const auth = require('./auth');

module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...auth
}
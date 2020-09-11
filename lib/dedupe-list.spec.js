const dedupeList = require('./dedupe-list');

describe('dedupeList', () => {
  it('should sort and dedupe paths (and subpaths)', () => {
    expect(dedupeList([
      '../../node_modules/aws-serverless-express',
      '../../node_modules/send/node_modules/ms',
      '../../node_modules/express',
      '../../node_modules/send/node_modules/http-errors',
      '../../node_modules/morgan',
      '../../node_modules/cookie-signature',
      '../../node_modules/send',
      '../../node_modules/morgan',
      '../../node_modules/cookie/node_modules/something',
      '../../node_modules/cors',
      '../../node_modules/morgan',
      '../../node_modules/send/node_modules/ms',
      '../../node_modules/morgan',
      '../../node_modules/cookie'
    ])).toEqual([
      '../../node_modules/aws-serverless-express',
      '../../node_modules/cookie',
      '../../node_modules/cookie-signature',
      '../../node_modules/cors',
      '../../node_modules/express',
      '../../node_modules/morgan',
      '../../node_modules/send'
    ]);
  });
});

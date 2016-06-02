## 0.2.0 (2016-06-02)
- IMPORTANT (deprecation): The `codecov.io` NPM module has been deprecated and will be removed in a future update in favor of the official `codecov` NPM module. You will need to modify `.npmscriptrc` and replace `"travis": { "report": "cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js" },` with `"travis": { "report": "./node_modules/.bin/codecov" },`
- [snyk](https://www.npmjs.com/package/snyk) has been added which provides monitoring of known vulnerabilities in Node.js npm packages. One can add it to an NPM script on in Travis CI add the following: `- snyk test --dev`. 

## 0.1.0 (2016-03-13)
- Initial stable release.

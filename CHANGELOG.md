## 0.2.0 (2016-06-02)
- IMPORTANT (breaking change): The `codecov.io` NPM module has been deprecated and also contains potential vulnerabilities and has been removed in favor of the official `codecov` NPM module. You will need to modify `.npmscriptrc` and replace `"travis": { "report": "cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js" },` with `"travis": { "report": "./node_modules/.bin/codecov" },`. Apologies for the inconvencience. 
- Information on the `codecov.io` potential vulnerabilities in dependent modules: [hawk](https://snyk.io/vuln/npm:hawk:20160119) & [request](https://snyk.io/vuln/npm:request:20160119)

- [snyk](https://www.npmjs.com/package/snyk) has been added which provides monitoring of known vulnerabilities in Node.js npm packages. One can add it to an NPM script on in Travis CI add the following: `- snyk test --dev`. 

## 0.1.0 (2016-03-13)
- Initial stable release.

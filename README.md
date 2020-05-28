### Steps to test

1. `yarn build`
1. Enable dev mode in Chrome
1. Chrome > Extensions > Load unpacked > `build/` directory
1. Re-run `yarn build` and reload the extension to see changes

### Todo

- Hot reload server
- Cut away more CRA cruft
- Establish a messaging channel between the UI script and the "background" script

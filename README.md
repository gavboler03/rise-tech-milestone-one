### Installing dependencies

1. cd into project directory
2. npm i

### Configuring credentials

1. Create a local admin Ortu3 user, and save the username and password
2. Create a state admin Ortu3 user, and save the username and password
3. Create a national admin Ortu3 user, and save the username and password
4. Paste the username and passwords for the respective local, state, and national admins into their respective environment variables
5. Fetch these environment variables and pass them into a const to use in the tests

### Running tests

1. npx playwright test {file name}
   - If you want to run all tests in your directory, omit the file name

### Showing test results report

1. npx playwright show-report

### Running and viewing tests in UI mode

1. npx playwright test --ui

### Expected behavior

- Local, state, and national admins should be able to successfully log in with the username and password environment variables.
- Local admins should not have access to the Reports tab and should be able to click the Officers button.
- State admins should have access to the Reports tab and should be able to click the Officers button.

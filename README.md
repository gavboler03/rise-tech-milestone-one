### Installing dependencies

1. cd {project directory}
2. npm i

### User roles being tested

- Local Admin
- State Admin
- National Admin

### Pages being tested

- Sign in
- Dashboard

## Buttons being tested

- Sign in
- Reports (RESTRICTED)
- Officers (RESTRICTED)
- Profile
- Sign Out

### Expected behavior

- Local, state, and national admins should be able to successfully log in with the username and password environment variables.
- Local admins should not have access to the Reports tab and should be able to click the Officers button.
- State and National admins should have access to the Reports tab and should be able to click the Officers button.
- Local, state, and national admins should be able to successfully log out.
- BONUS: National View-Only User cannot access the Approval Queue page

### Configuring credentials

1. Create a local admin Ortu3 user, and save the username and password
2. Create a state admin Ortu3 user, and save the username and password
3. Create a national admin Ortu3 user, and save the username and password
4. Paste the username and passwords for the respective local, state, and national admins into their respective environment variables
5. Fetch these environment variables and pass them into a constant to use in the tests

### Running tests manually

1. `npx playwright test {file name}`

- If you want to run all tests in your directory, omit the file name

### Showing test results report

1. `npx playwright show-report`

### Running and viewing tests in UI mode

1. `npx playwright test --ui`

### Running tests on regular cadence (Mac)

1. Open Terminal

2. Create scripts folder

- `mkdir -p ~/scripts`
- `ls ~/scripts`

3. Create shell script

- `nano ~/scripts/run-playwright.sh`
- Paste the below script:

  ```
  #!/bin/bash

  export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

  cd /Users/{user}/{path-to-project}/rise-tech-milestone-one

  npx playwright test


  ```

- Click Control + 0 to save and Control + X to exit

4. Make the script executable

- `chmod +x ~/scripts/run-playwright.sh`
- Verify: `ls -l ~/scripts`
- You should see something like: -rwxr-xr-x run-playwright.sh

5. Test the script manually

- `~/scripts/run-playwright.sh`
- The output will be the Playwright tests running

6. Create the LaunchAgents folder

- `mkdir -p ~/Library/LauchAgents`

7. Create the launchd configuration

- `nano ~/Library/LaunchAgents/com.{username}.playwright.plist`
- Paste the below script. Note that the Hour key is in miliary time:

  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">

  <plist version="1.0">
  <dict>

     <key>Label</key>
     <string>com.{username}.playwright</string>

     <key>ProgramArguments</key>
     <array>
        <string>/Users/{username}/scripts/run-playwright.sh</string>
     </array>

     <key>StartCalendarInterval</key>
     <dict>
        <key>Hour</key>
        <integer>9</integer>

        <key>Minute</key>
        <integer>0</integer>
     </dict>

     <key>RunAtLoad</key>
     <true/>

     <key>StandardOutPath</key>
     <string>/tmp/playwright.log</string>

     <key>StandardErrorPath</key>
     <string>/tmp/playwright-error.log</string>

  </dict>
  </plist>

  ```

8. Validate the plist

- `plutil ~/Library/LaunchAgents/com.{username}.playwright.plist`
- You should see: OK

9. Load it into launchd

- `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.{username}.playwright.plist`
- Verify it's loaded: `launchctl print gui/$(id -u)/com.gavinboler.playwright`
- You should see information about the job

10. Run the job immediately

- `launchctl kickstart gui/$(id -u)/com.{username}.playwright`

11. Check the logs

- `cat /tmp/playwright.log`
- `cat /tmp/playwright-error.log`

### Known limitations

- The regular cron job will run only when machine is online
- This test does not account for if the Reports tab is closed based off user preferences

### Recommended next steps

- Test button visibility in the sidebar based off the user's preferences
- Deploy tests to AWS environment and create a schedule for the tests to run

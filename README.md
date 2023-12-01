# Drupal + Storybook Test

This repo is my proof-of-concept at getting Storybook working within Drupal, using the addon from lullabot.  And this readme is just my collection of notes when I was setting it up.  (It's also the start of my learning of Storybook and Drupal, so if you see something strange going on, it's because I don't know what's going on.)

## References and Notes

- Storybook.js + Drupal

  - https://www.drupal.org/project/cl_server  <-- has videos
  - https://www.lullabot.com/articles/component-libraries-drupal
  - https://www.youtube.com/watch?v=u7jKkkp84B8
  - https://medium.com/@askibinski/integrating-storybook-with-drupal-ddabfc6c2f9d
  - https://storybook.js.org/addons/@lullabot/storybook-drupal-addon
  - another storybook server, I think similar to cl_server, but not as many users or activity:

    - https://www.drupal.org/project/storybook_server
    another way:
    - https://github.com/mel-miller/sb-drupal -- except this one uses twig.js

- Getting started
  - https://www.drupal.org/docs/getting-started/installing-drupal/drupal-quick-start-command
  - https://www.drupal.org/node/263
  - https://www.drupal.org/docs/develop/local-server-setup/docker-based-development-environments/docker-based-solutions-overview
  - https://ddev.com/get-started/
  - https://ddev.readthedocs.io/en/latest/users/install/ddev-installation/#windows

## Setup Log

Note that this is on a Windows 10 machine.

### Install WSL2 with Ubuntu (needed for DDEV)

```powershell
wsl --install
```

  - Visit the Microsoft Store and install the updated “Windows Subsystem for Linux” and click “Open”.
    https://apps.microsoft.com/store/detail/windows-subsystem-for-linux/9P9TQF7MRM4R
    It will likely prompt you for a username and password for the Ubuntu WSL2 instance it creates.
    --> that errored out

  - set default version to WWSL 2
    (see https://learn.microsoft.com/en-us/windows/wsl/install)
    ```powershell
    wsl --set-default-version 2
    ```

  - check Internet Connection Service (ICS)
    (see https://learn.microsoft.com/en-us/windows/wsl/troubleshooting#wsl-2-errors-when-ics-is-disabled)
    - went to Services
    - saw that ICS was disabled
    - changed it to Manual so that:
      Systems that require WSL 2 should leave the ICS service (SharedAccess) in it's default start state,
      Manual (Trigger Start), and any policy that disables ICS should be overwritten or removed.

  - uninstalled ubuntu (right-click on Start Menu and click Uninstall)
  - re-tried `wsl --install`:
    still failed with:
    > WslRegisterDistribution failed with error: 0x800706d9
      Error: 0x800706d9 There are no more endpoints available from the endpoint mapper.

  - uninstalled Ubuntu, uninstalled WSL
    (https://askubuntu.com/questions/1261664/how-to-uninstall-the-wsl-installation-of-ubuntu-20-04-from-windows-10)
    - Open the Control Panel and go to Programs -> Turn Windows Features On or Off. Uncheck the Windows Subsystem for Linux option there and click OK. Windows will uninstall Windows Subsystem for Linux, bash.exe, and lxrun.exe commands.

  - tried `wsl --install` again, but this time in a powershell that's in administrator mode (didn't do adminstrator mode earlier)

  - see https://github.com/microsoft/WSL/issues/6646:
    it looks like WSL needs both ICS and HNS (Host Network Service) not disabled
    - set HNS to Manual

  - Clicked on Start->Ubuntu
    - NOW it prompts for username and password. Yay!
    Installation Successful!

### Install Docker

- Installed Docker Desktop (download from docker.com).
- Changed folder location to:
  - D:\containers\docker

### Install ddev

- see https://ddev.com/get-started/
  - --> this also has instructions for removing

- also see https://ddev.readthedocs.io/en/latest/users/install/ddev-installation/#windows

(After wsl install completes successfully...)

- In an administrative PowerShell run this PowerShell script by executing (this installs DDEV)
  ```
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
  iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/ddev/ddev/master/scripts/install_ddev_wsl2_docker_inside.ps1'))
  ```

  - note warning when installing local cert
- ran:
  ```
  Import-Module $env:ChocolateyInstall\helpers\chocolateyProfile.psm1
  ```

[Whoops should have installed Docker first, duh...  At this point I went back and installed Docker.]

- Changed ports:
  - see https://ddev.readthedocs.io/en/stable/users/usage/troubleshooting/#web-server-ports-already-occupied
  - router_http_port: 8080
  - router_https_port: 8443

### Install CMS (Drupal)

- see https://ddev.readthedocs.io/en/latest/users/quickstart/#drupal
- On powershell:
  ```powershell
  cd D:\notes-programming\CMS\Drupal\drupal-test

  ddev config --project-type=drupal10 --docroot=web --create-docroot

  ddev start

  ddev composer create drupal/recommended-project

  ddev composer require drush/drush

  ddev drush site:install --account-name=admin --account-pass=admin -y

  ddev drush uli

  ddev launch
  ```

### Install Drupal Storybook Addon

- needed to edit composer.json to set:
  ```json
   "minimum-stability": "dev"
  ```
  (originally set to `"stable"`)

- https://storybook.js.org/addons/@lullabot/storybook-drupal-addon
- https://github.com/Lullabot/storybook-drupal-addon

- Install the Drupal module
  ```powershell
  ddev composer require drupal/cl_server

  ddev drush pm:enable --yes cl_server
  ```

- Add Storybook to your Drupal repo
  ```powershell
  cd web

  ddev yarn global add sb@latest

  ddev ssh
    > npm init
      ##==> setup the package.json file
    > sb init --builder webpack5 --type server
      ##==> installs storybook
    > yarn add -D @lullabot/storybook-drupal-addon
  ```
  - I realized afterwards that I shouldn't have used `npm init`.  Should do `yarn init`.  (I'm more familiar with `npm`.)

### Configure Storybook

- First enable the addon. Add it to the addons in the .storybook/main.js.
- Then, configure the supportedDrupalThemes and drupalTheme parameters in .storybook/preview.js.

- Restarted configuration for Storybook.
  - see https://git.drupalcode.org/project/cl_server/-/blob/2.x/docs/storybook.md
    ```powershell
    yarn init
    yarn set version berry
    echo 'nodeLinker: node-modules' >> .yarnrc.yml

    yarn dlx sb@latest init --builder webpack5 --type server
    yarn add -D @lullabot/storybook-drupal-addon
    ```

- Modify package.json to put in workaround from
  https://github.com/storybookjs/storybook/issues/24591

  - and then deleted any yarn.lock file and ran this a couple times:
    ```
    yarn install
    ```

And then Storybook ran.

### Testing Storybook and Drupal Together

- When adding components to themes, they need to be under the theme's `/components` subfolder, not in `/templates`.
  Otherwise, the `cl_server` won't be able to find them.

- Created starter theme
  (see https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme)
  ```
  php core/scripts/drupal generate-theme mytheme --path themes/custom
  ```

- Using SDC examples (https://git.drupalcode.org/project/sdc_examples)
  - originally grabbed all of them and placed under web/modules/sdc_examples, but cl_server couldn't find them
    - ==> oooh it's because the MODULE needed to be installed on the Drupal side.

  - Get my-button and my-card subfolders from https://git.drupalcode.org/project/sdc_examples.

  - Removed the .json files (duplicates of the .yml).
  - The .storybook/main.js has been modified to look for .yml (instead of either .json or .yml).

  - Modified my-card to refer to "my_stories:my-button" to pick up the correct my-button story (originally referred to the one in sdc_examples).

  Note:  When adding components to themes, they need to be under the theme's /components subfolder, not in /templates.  Otherwise, the cl_server won't be able to find them.


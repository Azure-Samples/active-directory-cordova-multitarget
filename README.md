# NativeClient-MultiTarget-Cordova

This sample demonstrates the usage of the ADAL plugin for [Apache Cordova](https://cordova.apache.org/) to build an Apache Cordova app that calls a web API that requires Authentication based on Azure AD. 

This sample solution demonstrates the usage of the ADAL plugin for [Apache Cordova](https://cordova.apache.org/) to build an Apache Cordova app, targeting several different platforms with a single code base. The application signs users in with Azure Active Directory (AAD), using the Active Directory Authentication Library (ADAL) plugin for Cordova to obtain a JWT access token through the OAuth 2.0 protocol. The access token is sent to AAD's Graph API to authenticate the user and obtain information about other users in their organization.
For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](http://go.microsoft.com/fwlink/?LinkId=394414).

ADAL plugin for Apache Cordova is an open source library.  For distribution options, source code, and contributions, check out the ADAL Cordova repo at https://github.com/AzureAD/azure-activedirectory-library-for-cordova.

## About The Sample
If you would like to get started immediately, skip this section and jump to How To Run The Sample.
This sample demonstrates a simple application, which allows a user to search directory users by alias and display simple user attributes in the results.
The application's UX is a simple page, implemented by DirSearchClient/index.html. The logic in DirSearchClient/js/index.js. Both files are extremely simple and their code should be largely self-explanatory.
Following the instructions in the sections below, you'll see that those same two files will be used for driving the behavior of the application on all of the supported platforms: iOS, Android, Windows Store and Windows Phone.  

## How To Run This Sample

### Prerequisites

To run this sample you will need:

- An Internet connection
- A Windows 8.1 64-bit machine with minimum 4 GB of RAM if you want to run Windows Table/PC apps. Processor that supports [ Client Hyper-V and Second Level Address Translation (SLAT)] (https://msdn.microsoft.com/en-us/library/windows/apps/ff626524(v=vs.105).aspx#hyperv) is also required if you want to run Windows Phone 8.1 app on emulator.
- A Mac OSX 10.8.5/Mountain Lion or higher machine with 4 GB of RAM if you want to run iOS app.
- To run Android app you can choose among
  - Mac OSX 10.8.5/Mountain Lion or higher machine with 4 GB of RAM 
  - Linux machine (GNOME or KDE desktop) with 4 GB of RAM (tested on Ubuntu® 14.04)
  - Windows 8 or higher machine with 4 GB of RAM
- [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS](https://nodejs.org/download/)
- [Cordova CLI](https://cordova.apache.org/)
  (can be easily installed via NPM package manager: `npm install -g cordova`)

Platform specific development tools depending on platform(s) you want to run sample application on:

- To build and run Windows Tablet/PC or Phone app version

  [Visual Studio 2013 for Windows with Update 2 or later](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-8) (Express or another version).

- To build and run for iOS

  Xcode 5.x or greater. Download it at http://developer.apple.com/downloads or the [Mac App Store](http://itunes.apple.com/us/app/xcode/id497799835?mt=12)
  
  [ios-sim](https://www.npmjs.org/package/ios-sim) – allows you to launch iOS apps into the iOS Simulator from the command line (can be easily installed via the terminal: `npm install -g ios-sim`)

- To build and run application for Android

  Install [Java Development Kit (JDK) 7](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) or later. Make sure `JAVA_HOME` (Environment Variable) is correctly set according to JDK installation path (for example C:\Program Files\Java\jdk1.7.0_75).
  
  Install [Android SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools) and add `<android-sdk-location>\tools` location (for example, C:\tools\Android\android-sdk\tools) to your `PATH` Environment Variable.

  Open Android SDK Manager (for example, via terminal: `android`) and install 
    - *Android 5.1.1 (API 22)* platform SDK
    - *Android SDK Build-tools* version 19.1.0 or higher
    - *Android Support Repository* (Extras)
    
  Android sdk doesn't provide any default emulator instance. Create a new one by running `android avd` from terminal and then selecting *Create...* if you want to run Android app on emulator. Recommended *Api Level* is 19 or higher, see [AVD Manager] (http://developer.android.com/tools/help/avd-manager.html) for more information about Android emulator and creation options.

### Step 1: [Optional] Register the sample with your Azure Active Directory tenant

To use this sample you will need a Microsoft Azure Active Directory Tenant. If you're not sure what a tenant is or how you would get one, read [What is a Windows Azure AD tenant](http://technet.microsoft.com/library/jj573650.aspx)? or [Sign up for Windows Azure as an organization](http://www.windowsazure.com/en-us/manage/services/identity/organizational-account/). These docs should get you started on your way to using Windows Azure AD.

This step is optional - the sample is configured to run with any tenant out of the box. But for best understanding, we recommend completing these two steps and registering the application in your own tenant.

1. Sign in to the Azure management portal.
2. Click on Active Directory in the left hand nav.
3. Click the directory tenant where you wish to register the sample application.
4. Click the Applications tab.
5. In the drawer, click Add.
6. Click "Add an application my organization is developing".
7. Enter a friendly name for the application, for example "DirectorySearcherClient", select "Native Client Application", and click next.
8. Enter a Redirect Uri value of your choosing and of form http://MyDirectorySearcherApp. NOTE: there are certain platform specific features that can only be leveraged by using Redirect Uri values in specific formats. We will add guidance about this soon. 
9. While still in the Azure portal, click the Configure tab of your application.
10. Find the Client ID value and copy it aside, you will need this later when configuring your application.
11. In the Permissions to Other Applications configuration section, ensure that "Access your organization's directory" and "Enable sign-on and read user's profiles" are selected under "Delegated permissions" for Windows Azure Active Directory. Save the configuration.

### Step 2:  Clone or download this repository

From your shell or command line:
`git clone https://github.com/AzureADSamples/NativeClient-MultiTarget-Cordova.git`

### Step 3:  Clone or download ADAL for Apache Cordova plugin

`git clone https://github.com/AzureAD/azure-activedirectory-library-for-cordova.git`

### Step 4: Create new Apache Cordova application

`cordova create ADALSample --copy-from="NativeClient-MultiTarget-Cordova/DirSearchClient"`

`cd ADALSample`

`cordova plugin add https://github.com/apache/cordova-plugin-whitelist.git`

__Note__: Whitelist plugin is required to access Graph API via XMLHttpRequests (part of sample application logic).

### Step 5: Add the platforms you want to support

`cordova platform add android@4.0.0`

__Note__: We use specific Android platform version here since we require some functionality which is not released yet. This will be updated soon after Cordova Tools release.

`cordova platform add ios`

`cordova platform add windows`

__Note__: In case if you have a Visual Studio 2015 Preview installed you may have issues with project packaging for Windows related to MSBuild v.14 issue.
You can workaround this issue by using patched cordova-windows with MSBuild reverted to v.12:

* Instead of `cordova platform add windows` use
* `cd ..`
* `git clone -b msbuild14-issue https://github.com/MSOpenTech/cordova-windows`
* `cd ADALSample`
* `cordova platform add ..\cordova-windows`

### Step 6:  Add plugin to your cordova app
  `cordova plugin add ../azure-activedirectory-library-for-cordova`

### Step 7:  [Optional] Configure the sample to use your Azure Active Directory tenant
This step is not strictly required. It shows you how to reflect the registration settings you obtained in step 1, if you decided that you want to use your own application entry in your directory tenant.
  
 1. Open the `index.js` file inside created `ADALSample/www/js/` folder.
 2. Find the clientId variable and replace its value with the Client Id assigned to your app from the Azure portal.
 3. Find the redirectUri variable and replace the value with the redirect Uri you registerd in the Azure portal.

```javascript
  var authority = "https://login.windows.net/common",
    redirectUri = "http://MyDirectorySearcherApp",
    resourceUri = "https://graph.windows.net",
    clientId = "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3",
    graphApiVersion = "2013-11-08";
```

### Step 8:  Build and run the sample
 1. To build and run Windows Tablet/PC application version

   `cordova run windows`
   
   __Note__: During first run you may be asked to sign in for a developer license. See [Developer license]( https://msdn.microsoft.com/en-us/library/windows/apps/hh974578.aspx) for more details.

   #### Using ADFS/SSO
   To use ADFS/SSO on Windows Tablet/PC add the following preference into `config.xml`:

   `<preference name="adal-use-corporate-network" value="true" />`

   `adal-use-corporate-network` is `false` by default.

   It will add all needed application capabilities and toggle authContext to support ADFS/SSO. You can change its value to `false` and back later, or remove it from `config.xml` - call `cordova prepare` after it to apply the changes.

   __Note__: You should not normally use `adal-use-corporate-network` as it adds capabilities, which prevents an app from being published in the Windows Store.

 2. To build and run application on Windows Phone 8.1

   To run on connected device: `cordova run windows --device -- --phone`

   To run on default emulator: `cordova emulate windows -- --phone`

   Use `cordova run windows --list -- --phone` to see all available targets and `cordova run windows --target=<target_name> -- --phone` to run application on specific device or emulator (for example,  `cordova run windows --target="Emulator 8.1 720P 4.7 inch" -- --phone`).

 3. To build and run on Android device
 
   To run on connected device: `cordova run android --device`
  
   To run on default emulator: `cordova emulate android`

   __Note__: Make sure you've created emulator instance using *AVD Manager* as it is showed in *Prerequisites* section.

   Use `cordova run android --list` to see all available targets and `cordova run android --target=<target_name>` to run application on specific device or emulator (for example,  `cordova run android --target="Nexus4_emulator"`).
 
 4. To build and run on iOS device
 
   To run on connected device: `cordova run ios --device`

   To run on default emulator: `cordova emulate ios`

   __Note__: Make sure you have `ios-sim` package installed to run on emulator. See *Prerequisites* section for more details.
   
    Use `cordova run ios --list` to see all available targets and `cordova run ios --target=<target_name>` to run application on specific device or emulator (for example,  `cordova run android --target="iPhone-6"`).

Use `cordova run --help` to see additional build and run options.

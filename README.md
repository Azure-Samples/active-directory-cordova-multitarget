# NativeClient-MultiTarget-Cordova

This sample demonstrates the usage of the ADAL plugin for [Apache Cordova](https://cordova.apache.org/) to build an Apache Cordova app that calls a web API that requires Authentication based on Azure AD. For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](http://go.microsoft.com/fwlink/?LinkId=394414).

ADAL plugin for Apache Cordova is an open source library.  For distribution options, source code, and contributions, check out the ADAL Cordova repo at https://github.com/AzureAD/azure-activedirectory-library-for-cordova.

## How To Run This Sample

### Prerequisites

To run this sample you will need:
- [NodeJS and NPM](https://nodejs.org/)
- [Cordova CLI](https://cordova.apache.org/)
  (can be easily installed via NPM package manager: `npm install -g cordova`)
- Additional prerequisites for each supported platform can be found at [Cordova platforms documentation](http://cordova.apache.org/docs/en/edge/guide_platforms_index.md.html#Platform%20Guides) page.

Every Azure subscription has an associated Azure Active Directory tenant.  If you don't already have an Azure subscription, you can get a free subscription by signing up at [http://www.windowsazure.com](http://www.windowsazure.com).  All of the Azure AD features used by this sample are available free of charge.

### TODO: steps to register Azure AD Tenant and set up local test server
https://github.com/AzureADSamples/NativeClient-iOS#step-2-download-and-run-either-the-net-or-nodejs-rest-api-todo-sample-server

### Step 1:  Clone or download this repository

From your shell or command line:
`git clone https://github.com/AzureADSamples/NativeClient-MultiTarget-Cordova.git`

### Step 2:  Clone or download ADAL for Apache Cordova plugin

`git clone https://github.com/AzureAD/azure-activedirectory-library-for-cordova.git`

### Step 3: Create new Apache Cordova application and add the platforms you want to support

`cordova create ADALSample --copy-from="NativeClient-MultiTarget-Cordova/TodoList"`

`cd ADALSample`

`cordova platform add https://github.com/apache/cordova-android.git`

`cordova platform add ios`

`cordova platform add windows`

### Step 3:  Add plugin to your cordova app
  `cordova plugin add ../azure-activedirectory-library-for-cordova`

### Step 4:  Configure the sample to use your Azure Active Directory tenant
 1. Open the `www/js/app.js` file inside created `ADALSample` folder.
 2. Replace `config` information with your Web API settings.
```javascript
window.config = {
    // TODO: for each field: detailed description what does it mean and where to find a replacement
    tenant: 'cordovaadalsample.onmicrosoft.com',
    clientId: '4fa5ca88-f92e-456f-af10-12ee535c42d6',
    postLogoutRedirectUri: 'http://TodoListClient',
    endpoint = 'http://localhost:9184'
};  
```

### Step 5:  Run the sample
  `cordova run`

## About the Code

TODO

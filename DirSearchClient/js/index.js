/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var authority = "https://login.windows.net/common",
    redirectUri = "http://MyDirectorySearcherApp",
    resourceUri = "https://graph.windows.net",
    clientId = "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3",
    graphApiVersion = "2013-11-08";

var app = {
    // Invoked when Cordova is fully loaded.
    onDeviceReady: function() {
        document.getElementById('search').addEventListener('click', app.search);
    },
    // Implements search operations.
    search: function () {
        document.getElementById('userlist').innerHTML = "";

        app.authenticate(function (authresult) {
            var searchText = document.getElementById('searchfield').value;
            app.requestData(authresult, searchText);
        });
    },
    // Shows user authentication dialog if required.
    authenticate: function (authCompletedCallback) {

        app.context = new Microsoft.ADAL.AuthenticationContext(authority);
        app.context.tokenCache.readItems().then(function (items) {
            if (items.length > 0) {
                authority = items[0].authority;
                app.context = new Microsoft.ADAL.AuthenticationContext(authority);
            }
            // Attempt to authorize user silently
            app.context.acquireTokenSilentAsync(resourceUri, clientId)
            .then(authCompletedCallback, function () {
                // We require user cridentials so triggers authentication dialog
                app.context.acquireTokenAsync(resourceUri, clientId, redirectUri)
                .then(authCompletedCallback, function (err) {
                    app.error("Failed to authenticate: " + err);
                });
            });
        });

    },
    // Makes Api call to receive user list.
    requestData: function (authResult, searchText) {
        var req = new XMLHttpRequest();
        var url = resourceUri + "/" + authResult.tenantId + "/users?api-version=" + graphApiVersion;
        url = searchText ? url + "&$filter=mailNickname eq '" + searchText + "'" : url + "&$top=10";

        req.open("GET", url, true);
        req.setRequestHeader('Authorization', 'Bearer ' + authResult.accessToken);

        req.onload = function(e) {
            if (e.target.status >= 200 && e.target.status < 300) {
                app.renderData(JSON.parse(e.target.response));
                return;
            }
            app.error('Data request failed: ' + e.target.response);
        };
        req.onerror = function(e) {
            app.error('Data request failed: ' + e.error);
        }

        req.send();
    },
    // Renders user list.
    renderData: function(data) {
        var users = data && data.value;
        if (users.length === 0) {
            app.error("No users found");
            return;
        }

        var userlist = document.getElementById('userlist');
        userlist.innerHTML = "";

        // Helper function for generating HTML
        function $new(eltName, classlist, innerText, children, attributes) {
            var elt = document.createElement(eltName);
            classlist.forEach(function (className) {
                elt.classList.add(className);
            });

            if (innerText) {
                elt.innerText = innerText;
            }

            if (children && children.constructor === Array) {
                children.forEach(function (child) {
                    elt.appendChild(child);
                });
            } else if (children instanceof HTMLElement) {
                elt.appendChild(children);
            }

            if(attributes && attributes.constructor === Object) {
                for(var attrName in attributes) {
                    elt.setAttribute(attrName, attributes[attrName]);
                }
            }

            return elt;
        }

        users.map(function(userInfo) {
            return $new('li', ['topcoat-list__item'], null, [
                $new('div', [], null, [
                    $new('p', ['userinfo-label'], 'First name: '),
                    $new('input', ['topcoat-text-input', 'userinfo-data-field'], null, null, {
                        type: 'text',
                        readonly: '',
                        placeholder: '',
                        value: userInfo.givenName || ''
                    })
                ]),
                $new('div', [], null, [
                    $new('p', ['userinfo-label'], 'Last name: '),
                    $new('input', ['topcoat-text-input', 'userinfo-data-field'], null, null, {
                        type: 'text',
                        readonly: '',
                        placeholder: '',
                        value: userInfo.surname || ''
                    })
                ]),
                $new('div', [], null, [
                    $new('p', ['userinfo-label'], 'UPN: '),
                    $new('input', ['topcoat-text-input', 'userinfo-data-field'], null, null, {
                        type: 'text',
                        readonly: '',
                        placeholder: '',
                        value: userInfo.userPrincipalName || ''
                    })
                ]),
                $new('div', [], null, [
                    $new('p', ['userinfo-label'], 'Phone: '),
                    $new('input', ['topcoat-text-input', 'userinfo-data-field'], null, null, {
                        type: 'text',
                        readonly: '',
                        placeholder: '',
                        value: userInfo.telephoneNumber || ''
                    })
                ])
            ]);
        }).forEach(function(userListItem) {
            userlist.appendChild(userListItem);
        });
    },
    // Renders application error.
    error: function(err) {
        var userlist = document.getElementById('userlist');
        userlist.innerHTML = "";

        var errorItem = document.createElement('li');
        errorItem.classList.add('topcoat-list__item');
        errorItem.classList.add('error-item');
        errorItem.innerText = err;

        userlist.appendChild(errorItem);
    }
};

document.addEventListener('deviceready', app.onDeviceReady, false);

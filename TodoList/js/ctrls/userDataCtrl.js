(function () {

    // The HTML for this View
    var viewHTML;
    // Instantiate the ADAL AuthenticationContext

    function acquireToken(successCB, errorCB) {
        window.authContext.acquireTokenSilentAsync(window.config.resource, window.config.clientId).then(function (authResult) {
            authResult && authResult.status === 0 && successCB(authResult);
        }, function () {
            window.authContext.acquireTokenAsync(window.config.resource, window.config.clientId, window.config.postLogoutRedirectUri).then(function (authResult) {
                authResult && authResult.status === 0 && successCB(authResult);
            }, errorCB);
        });
    }

    function refreshViewData() {

        // Empty Old View Contents
        var $dataContainer = $(".data-container");
        $dataContainer.empty();
        var $loading = $(".view-loading");

        acquireToken(function(accessToken) {
                var userInfo = accessToken.userInfo;

                var $html = $(viewHTML);
                var $template = $html.find(".data-container");
                var output = '';

                for (var property in userInfo) {
                    if (userInfo.hasOwnProperty(property)) {
                        var $entry = $template;
                        $entry.find(".view-data-claim").html(property);
                        $entry.find(".view-data-value").html(userInfo[property]);
                        output += $entry.html();
                    }
                }

                // Update the UI
                $loading.hide();
                $dataContainer.html(output);
        }, function(err) {
            $errorMessage.html('Failed to fetch user info');
        });
    };

    // Module
    window.userDataCtrl = {
        requireADLogin: true,
        preProcess: function (html) {

        },
        postProcess: function (html) {
            viewHTML = html;
            refreshViewData();
        },
    };
}());


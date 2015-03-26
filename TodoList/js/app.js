
function start () {

    // Enter Global Config Values & Instantiate ADAL AuthenticationContext
    window.config = {
        tenant: 'cordovaadalsample.onmicrosoft.com',
        clientId: '4fa5ca88-f92e-456f-af10-12ee535c42d6',
        postLogoutRedirectUri: 'http://TodoListClient'
    };
    window.config.authority = 'https://login.windows.net/' + window.config.tenant;
    window.config.resource = 'https://' + window.config.tenant + '/TodoListService';
    window.config.endpoint = 'http://localhost:9184';

    window.authContext = new window.Microsoft.ADAL.AuthenticationContext(window.config.authority);

    // Get UI jQuery Objects
    var $panel = $(".panel-body");
    var $userDisplay = $(".app-user");
    var $signInButton = $(".app-login");
    var $signOutButton = $(".app-logout");
    var $errorMessage = $(".app-error");

    window.authContext.tokenCache.readItems().then(function (items) {
        if (items.length > 0) {
            var user = items[0].userInfo;
            $userDisplay.html(user.displayableId);
            $userDisplay.show();
            $signInButton.hide();
            $signOutButton.show();
        } else {
            $userDisplay.empty();
            $userDisplay.hide();
            $signInButton.show();
            $signOutButton.hide();
        }
    });

    window.goto = function (ctrl) {
        loadView(ctrl);
    };

    // Register NavBar Click Handlers
    $signOutButton.click(function () {
        window.authContext.tokenCache.clear();
        window.location.reload();
    });

    $signInButton.click(function () {
        window.authContext.acquireTokenSilentAsync(window.config.resource, window.config.clientId).then(function () {
            window.location.reload();
        }, function() {
            window.authContext.acquireTokenAsync(window.config.resource, window.config.clientId, window.config.postLogoutRedirectUri).then(function() {
                window.location.reload();
            }, function (err) {
                $errorMessage.html('Authentication failed.');
            });
        });
    });

    // Route View Requests To Appropriate Controller
    function loadCtrl(view) {
        switch (view.toLowerCase()) {
            case 'home':
                return homeCtrl;
            case 'todolist':
                return todoListCtrl;
            case 'userdata':
                return userDataCtrl;
        }
    }

    // Show a View
    function loadView(view) {

        view = view || "Home";

        $errorMessage.empty();
        var ctrl = loadCtrl(view);

        if (!ctrl)
            return;

        // Check if View Requires Authentication
        // TODO - for discussion
        //if (ctrl.requireADLogin && !authContext.getCachedUser()) {
        //    authContext.config.redirectUri = window.location.href;
        //    authContext.login();
        //    return;
        //}

        // Load View HTML
        $.ajax({
            type: "GET",
            url: "views/" + view + '.html',
            dataType: "html",
        }).done(function (html) {

            // Show HTML Skeleton (Without Data)
            var $html = $(html);
            $html.find(".data-container").empty();
            $panel.html($html.html());
            ctrl.postProcess(html);

        }).fail(function () {
            $errorMessage.html('Error loading page.');
        }).always(function () {

        });
    };

    window.goto();
};

document.addEventListener('deviceready', start);

        



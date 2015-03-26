(function () {

    // The HTML for this View
    var viewHTML;

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

        // Acquire Token for Backend
        acquireToken(function(result) {
            // Get TodoList Data
            $.ajax({
                type: "GET",
                url: window.config.endpoint + "/api/TodoList",
                headers: {
                    'Authorization': 'Bearer ' + result.accessToken,
                },
            }).done(function(data) {

                var $html = $(viewHTML);
                var $template = $html.find(".data-container");

                // For Each Todo Item Returned, Append a Table Row
                var output = data.reduce(function(rows, todoItem, index, todos) {
                    var $entry = $template;
                    var $description = $entry.find(".view-data-description").html(todoItem.Title);
                    $entry.find(".data-template").attr('data-todo-id', todoItem.Owner);
                    return rows + $entry.html();
                }, '');

                // Update the UI
                $loading.hide();
                $dataContainer.html(output);

            }).fail(function() {
                printErrorMessage('Error getting todo list data')
            }).always(function() {

                // Register Handlers for Buttons in Data Table
                registerDataClickHandlers();
            });
        }, function(err) {
            printErrorMessage('ADAL Error Occurred: ' + err);
        });
    };

    function registerDataClickHandlers() {

        // Delete Button(s)
        $(".view-data-delete").click(function (event) {
            clearErrorMessage();

            var todoId = $(event.target).parents(".data-template").attr("data-todo-id");

            // Acquire Token for Backend
            acquireToken(function (authResult) {

                // Delete the Todo
                $.ajax({
                    type: "DELETE",
                    url: window.config.endpoint + "/api/TodoList/" + todoId,
                    headers: {
                        'Authorization': 'Bearer ' + authResult.accessToken,
                    },
                }).done(function () {
                    console.log('DELETE success.');
                }).fail(function () {
                    console.log('Fail on new Todo DELETE');
                    printErrorMessage('Error deleting todo item.')
                }).always(function () {
                    refreshViewData();
                });
            }, function(err) {
                printErrorMessage('ADAL Error Occurred: ' + err);
            });
        });

        // Edit Button(s)
        $(".view-data-edit").click(function (event) {
            clearErrorMessage();
            var $entry = $(event.target).parents(".data-template");
            var $entryDescription = $entry.find(".view-data-description").hide();
            var $editInput = $entry.find(".view-data-edit-input");
            $editInput.val($entryDescription.text());
            $editInput.show();
            $entry.find(".view-data-mode-delete").hide();
            $entry.find(".view-data-mode-edit").show();
        });

        // Cancel Button(s)
        $(".view-data-cancel-edit").click(function (event) {
            clearErrorMessage();
            $entry = $(event.target).parents(".data-template");
            $entry.find(".view-data-description").show();
            $editInput = $entry.find(".view-data-edit-input").hide();
            $editInput.val('');
            $entry.find(".view-data-mode-delete").show();
            $entry.find(".view-data-mode-edit").hide();
        });

        // Save Button(s)
        $(".view-data-save").click(function (event) {
            clearErrorMessage();
            var $entry = $(event.target).parents(".data-template");
            var todoId = $entry.attr("data-todo-id");

            // Validate Todo Description
            var $description = $entry.find(".view-data-edit-input");
            if ($description.val().length <= 0) {
                printErrorMessage('Please enter a valid Todo description');
                return;
            }

            // Acquire Token for Backend
            acquireToken(function (authResult) {
                // Update Todo Item
                $.ajax({
                    type: "PUT",
                    url: window.config.endpoint + "/api/TodoList",
                    headers: {
                        'Authorization': 'Bearer ' + authResult.accessToken,
                    },
                    data: {
                        Description: $description.val(),
                        ID: todoId,
                    },
                }).done(function () {
                    console.log('PUT success.');
                }).fail(function () {
                    console.log('Fail on todo PUT');
                    printErrorMessage('Error saving todo item.')
                }).always(function () {
                    refreshViewData();
                    $description.val('');
                });
            }, function(err) {
                printErrorMessage('ADAL Error Occurred: ' + err);
            });
        });
    };

    function registerViewClickHandlers() {

        // Add Button
        $(".view-addTodo").click(function () {
            clearErrorMessage();

            // Validate Todo Description
            var $description = $("#view-todoDescription");
            if ($description.val().length <= 0) {
                printErrorMessage('Please enter a valid Todo description');
                return;
            }

            // Acquire Token for Backend
            acquireToken(function (authResult) {
                // POST a New Todo
                $.ajax({
                    type: "POST",
                    url: window.config.endpoint + "/api/TodoList",
                    headers: {
                        'Authorization': 'Bearer ' + authResult.accessToken,
                    },
                    data: {
                        Title: $description.val(),
                    },
                }).done(function () {
                    console.log('POST success.');
                }).fail(function () {
                    console.log('Fail on new Todo POST');
                    printErrorMessage('Error adding new todo item.');
                }).always(function () {

                    // Refresh TodoList
                    $description.val('');
                    refreshViewData();
                });
            }, function(err) {
                printErrorMessage('ADAL Error Occurred: ' + err);
            });
        });
    };

    function clearErrorMessage() {
        var $errorMessage = $(".app-error");
        $errorMessage.empty();
    };

    function printErrorMessage(mes) {
        var $errorMessage = $(".app-error");
        $errorMessage.html(mes);
    }

    // Module
    window.todoListCtrl = {
        requireADLogin: true,
        preProcess: function (html) {

        },
        postProcess: function (html) {
            viewHTML = html;
            registerViewClickHandlers();
            refreshViewData();
        },
    };
}());

    
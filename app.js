$(document).ready(function () {
    $('.unanswered-getter').submit(function (event) {
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tags the user submitted
        var tags = $(this).find("input[name='tags']").val();
        getUnanswered(tags);
    });


    $('.inspiration-getter').submit(function (event) {
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tag the user submitted
        var answerers = $(this).find("input[name='answerers']").val();
        getBestAnswerer(answerers);
        //alert(answerers);

    });

});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function (question) {

    // clone our result template code
    var result = $('.templates .question').clone();

    // Set the question properties in result
    var questionElem = result.find('.question-text a');
    questionElem.attr('href', question.link);
    questionElem.text(question.title);

    // set the date asked property in result
    var asked = result.find('.asked-date');
    var date = new Date(1000 * question.creation_date);
    asked.text(date.toString());

    // set the #views for question property in result
    var viewed = result.find('.viewed');
    viewed.text(question.view_count);

    // set some properties related to asker
    var asker = result.find('.asker');
    asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' + question.owner.display_name +
        '</a>' +
        '</p>' +
        '<p>Reputation: ' + question.owner.reputation + '</p>');

    return result;
};





// this function takes the answerer object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestionTwo = function (tag_score) {

    // clone our result template code
    var resultTwo = $('.templates .best-user').clone();

    // Set the link to best answerer properties in result
    var questionTwoElem = result.find('.topic-text a');
    questionTwoElem.attr('href', tag_score.link);
    questionTwoElem.text(tag_score.link);

    // set the name of best answerer property in result
    var nameAns = result.find('.name-answerer');
    nameAns.text(tag_score.display_name);


    // set the reputation for question property in result
    var repAns = result.find('.viewed');
    repAns.text(tag_score.reputation);


    return result;
};




// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function (query, resultNum) {
    var results = resultNum + ' results for <strong>' + query;
    return results;
};

// takes error string and turns it into displayable DOM element
var showError = function (error) {
    var errorElem = $('.templates .error').clone();
    var errorText = '<p>' + error + '</p>';
    errorElem.append(errorText);
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResultsTwo = function (query, resultNumTwo) {
    var resultsTwo = resultNumTwo + ' results for <strong>' + query;
    return resultsTwo;
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow from first question box
var getUnanswered = function (tags) {

    // the parameters we need to pass in our request to StackOverflow's API
    var request = {
        tagged: tags,
        site: 'stackoverflow',
        order: 'desc',
        sort: 'creation'
    };

    var result = $.ajax({
        url: "http://api.stackexchange.com/2.2/questions/unanswered",
        data: request,
        dataType: "jsonp",
        type: "GET",
    })



        .done(function (result) {
        var searchResults = showSearchResults(request.tagged, result.items.length);

        $('.search-results').html(searchResults);

        $.each(result.items, function (i, item) {
            var question = showQuestion(item);
            $('.results').append(question);
        });
    })
        .fail(function (jqXHR, error, errorThrown) {
        var errorElem = showError(error);
        $('.search-results').append(errorElem);
    });
};


// takes a tag string to be searched for for best answerer field
var getBestAnswerer = function (answerers) {

    // the parameters to pass in our request to StackOverflow's API
    var requestTwo = {
        tag: answerers,
        site: 'stackoverflow',
        period: 'all_time',

    };

    var resultTwo = $.ajax({
        url: "http://api.stackexchange.com/2.2/tags/{tag}/top-answerers/{period}",
        data: request,
        dataType: "jsonp",
        type: "GET",
    })

        .done(function (resultTwo) {
        var searchResultsTwo = showSearchResultsTwo(requestTwo.tag, resultTwo.items.length);

        $('.search-results').html(searchResultsTwo);

        $.each(resultTwo.items, function (i, item) {
            var questionTwo = showQuestionTwo(item);
            $('.results').append(question);
        });
    })


        .fail(function (jqXHR, error, errorThrown) {
        var errorElem = showError(error);
        $('.search-results').append(errorElem);
    });
};
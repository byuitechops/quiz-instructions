/*eslint-env node, es6*/
/*eslint no-unused-vars:1*/
/*eslint no-console:0, semi: 2*/

/* The module checks 4 xml tags of each quiz file
   and consoles log the report of the check. 
   For this module cheerio object is already loaded into dom,
   so all the cheerio calls are done with file.dom() */

var he = require('he');

/* View available course object functions */
// https://github.com/byuitechops/d2l-to-canvas-conversion-tool/blob/master/documentation/classFunctions.md

module.exports = (course, stepCallback) => {
    /* Create the module report so that we can access it later as needed.
    This MUST be done at the beginning of each child module. */
    course.addModuleReport('quiz-instructions');

    // this axillary function will clear the passed string and return only the text
    // it is done in 3 steps
    function clearString(raw_string) {
        // step 1 
        // just a raw cleaning using he lirary
        var cleared_string1 = he.decode(raw_string);

        // step 2
        // clear everything like <...> (including the angular brackets)
        var cleared_string2 = '';
        var add = true;
        for (var i = 0; i < cleared_string1.length; i++) {
            if (cleared_string1.charAt(i) === '<' && add === true) {
                add = false;
            }
            if (cleared_string1.charAt(i) === '>' && add === false) {
                add = true;
            }
            if (add === true && cleared_string1.charAt(i) !== '>') {
                cleared_string2 += cleared_string1.charAt(i);
            }
        }

        // step 3
        // the final refinement
        var words_to_remove = ['&nbsp;', '&ldquo;', '&rdquo;'];
        for (var k = 0; k < words_to_remove.length; k++) {
            var remove = cleared_string2.includes(words_to_remove[k]);
            while (remove) {
                cleared_string2 = cleared_string2.replace(words_to_remove[k], '');
                remove = cleared_string2.includes(words_to_remove[k]);
            }
        }
        return cleared_string2;
    }

    // all the jobe is done in this forEach()
    // this object will be filled with data for the log report
    var json_report = {};
    // get all files with quizzes
    course.content.forEach(function (file) {
        var regexp = /quiz[\s\S]*\.xml$/;
        if (regexp.test(file.name)) {
            var to_check_raw = '';
            var to_check_cleared = '';

            // fill up the quiz names for the module report
            var quiz_name = file.dom('assessment[d2l_2p0\\:id]').attr('title');
            json_report['Quiz name: '] = quiz_name;


            // We check 4 xml elements of each quiz file:
            var name = ['Description:', 'Introduction:', 'Page Header:', 'Page Footer:'];
            var xml_tag = ['mattext[d2l_2p0\\:isdisplayed="yes"]',
                          'd2l_2p0\\:intro_message',
                          'material[label="page header"]>mattext',
                          'material[label="page footer"]>mattext'];

            for (var i = 0; i < name.length; i++) {
                var new_information = name[i];
                // this line fishes out the needed tag and gets the text of it
                to_check_raw = file.dom(xml_tag[i]).text();
                if (to_check_raw !== '') {
                    to_check_cleared = clearString(to_check_raw);
                    // fill up the Descriptions
                    json_report[new_information] = to_check_cleared;
                }

                to_check_raw = '';
                to_check_cleared = '';
            }
            /* Used to log successful actions */
            course.log('Descriptions for the quizz', json_report);
        }
        json_report = {};
    });

    /* You should never call the stepCallback with an error. We want the
    whole program to run when testing so we can catch all existing errors */
    stepCallback(null, course);
};

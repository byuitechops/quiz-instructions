/* All is done in the pre-import (synchronously).
   In d2l there are 4 tags containing quiz information, but only the 1st one (Description) is sent to canvas
   when the course is imported.  I am collecting the info from all 4 tags in d2l, 
   add "Old ..." to explain where each one comes from, and put it all into the Description.
   For this module cheerio object is already loaded into dom,
   so all the cheerio calls are done with file.dom() */

const he = require('he');

/* View available course object functions */
// https://github.com/byuitechops/d2l-to-canvas-conversion-tool/blob/master/documentation/classFunctions.md

module.exports = (course, stepCallback) => {
    // this axillary function will clear the passed string and return only the text
    // it is done in 3 steps
    function clearString(raw_string) {
        // step 1 
        // get it back to html format
        var clearedString1 = he.decode(raw_string);

        // step 2
        // clear everything like <...> (including the angular brackets)
        var clearedString2 = '';
        var add = true;
        for (var i = 0; i < clearedString1.length; i++) {
            if (clearedString1.charAt(i) === '<' && add === true) {
                add = false;
            }
            if (clearedString1.charAt(i) === '>' && add === false) {
                add = true;
            }
            if (add === true && clearedString1.charAt(i) !== '>') {
                clearedString2 += clearedString1.charAt(i);
            }
        }

        // step 3
        // the final refinement
        var wordsToRemove = ['&nbsp;', '&ldquo;', '&rdquo;'];
        for (var k = 0; k < wordsToRemove.length; k++) {
            var remove = clearedString2.includes(wordsToRemove[k]);
            while (remove) {
                clearedString2 = clearedString2.replace(wordsToRemove[k], '');
                remove = clearedString2.includes(wordsToRemove[k]);
            }
        }
        return clearedString2;
    }

    // this object will be filled with data for the log report
    var jsonReport = {};
    // We check 4 xml elements of each quiz file:
    var name = ['Description:', 'Introduction:', 'Page Header:', 'Page Footer:'];
    var xml_tags = ['questestinterop>assessment>rubric>flow_mat>material>mattext',
        'd2l_2p0\\:intro_message',
        'material[label="page header"]>mattext',
        'material[label="page footer"]>mattext'];

    // all the job is done in this forEach()
    course.content.forEach(function (file) {
        // get all files with quizzes
        var regexp = /quiz[\s\S]*\.xml$/;
        if (regexp.test(file.name)) {
            // the content collector for remaking the discription tag
            var contentCollector = '';
            // will be used for checking and clearing the tag's content
            var toCheckRaw = '';
            var toCheckCleared = '';

            // fill up the quiz names for the module report
            var quizName = file.dom('assessment[d2l_2p0\\:id]').attr('title');
            jsonReport['Quiz name: '] = quizName;

            for (var i = 0; i < name.length; i++) {
                var temp = he.encode('<h2 style="color:red;font-size: 24px;"><strong>Old ' +
                    name[i] + '</strong></h2>');
                contentCollector += temp;
                var new_information = name[i];
                // this line fishes out the needed tag and gets the text out of it
                toCheckRaw = file.dom(xml_tags[i]).text();
                if (toCheckRaw !== '') {
                    contentCollector += toCheckRaw;
                    toCheckCleared = clearString(toCheckRaw);
                    // fill up the Descriptions
                    jsonReport[new_information] = toCheckCleared;
                }
                toCheckRaw = '';
                toCheckCleared = '';
            }

            // finally, replace the old description with the information collected from 4 tags
            // the description is sent automatically from d2l to canvas
            file.dom(xml_tags[0]).text(contentCollector, {
                'useNamedReferences': true
            });

            /* Used to log successful actions */
            course.log('Descriptions for the quiz', jsonReport);
        }
        jsonReport = {};
    });

    stepCallback(null, course);
};

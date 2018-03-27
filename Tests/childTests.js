// /*eslint-env node, es6*/
// /*eslint no-unused-vars:1*/
// /*eslint no-console:0, semi: 2*/

// /* This file still needs some work to do.
//    The logic for testing works, but the tap is not configured right at the higher level yet. 
//    I am testing each quiz for passing over to canvas some information in the description in the d2l.
//    The information has been collected from all 4 places (description, introduction, header, and footer), 
//    and the description specifies which one came from where.
//    Also, all descriptions for all quizzes are saved in the checkFiles folder in the html format.
//    I can open them in browser and check. */

// /* Dependencies */
// const tap = require('tap');
// const fs = require('fs');
// const path = require('path');
// const he = require('he');
// const cheerio = require('cheerio');

// function g1Tests(course, callback) {
//     var files = course.content.filter(function (file) {
//         return file.name.includes('quiz');
//     });

//     files.forEach(function (file) {
//         // getting the html content of the discription tag (the one that is sent to canvas) 
//         // and writing it into an html file
//         var tag = 'questestinterop>assessment>rubric>flow_mat>material>mattext';
//         var html_content = he.decode(file.dom(tag).text());
//         var new_file_name = file.name.replace('.xml', '.html');
//         fs.writeFileSync(path.join('.', 'checkFiles', new_file_name), html_content, 'utf8');

//         // make an array of elements to test against
//         var $ = cheerio.load(html_content);
//         var all_elements = [4];
//         $('h2').each(function (i, element) {
//             all_elements[i] = $(element).next('p').html();
//         });

//         // testing
//         console.log('\n--------------\nTesting ' + file.name + '\n-----------------');
//         var all_empty = 0,
//             all_filled = 4;
//         for (var i = 0; i < 4; i++) {
//             if (all_elements[i] === null) {
//                 all_empty++;
//                 all_filled--;
//             }
//         }
//         // #1 all empty
//         if (all_empty === 4) {
//             tap.pass();
//             console.log('test #1 -- all empty passed');
//         }
//         // #2 description
//         if (all_elements[0] !== null) {
//             tap.pass();
//             console.log('test #2 -- description passed');
//         }
//         // #3 introduction
//         if (all_elements[1] !== null) {
//             tap.pass();
//             console.log('test #3 -- introduction passed');
//         }
//         // #4 footer
//         if (all_elements[2] !== null) {
//             tap.pass();
//             console.log('test #4 -- footer passed');
//         }
//         // #5 header
//         if (all_elements[3] !== null) {
//             tap.pass();
//             console.log('test #5 -- header passed');
//         }
//         // #6 all filled
//         if (all_filled === 4) {
//             tap.pass();
//             console.log('test #6 -- all filled passed');
//         }
//         console.log('\n------------------------------');
//     });
//     callback(null, course);
// }

// function g2Tests(course, callback) {
//     // Tap tests for Gauntlet 2 go here
//     tap.pass('Success! Wheee! 2');
//     callback(null, course);
// }

// function g3Tests(course, callback) {
//     // Tap tests for Gauntlet 3 go here
//     tap.pass('Success! Wheee! 3');
//     callback(null, course);
// }

// function g4Tests(course, callback) {
//     // Tap tests for Gauntlet 4 go here
//     tap.pass('Success! Wheee! 4');
//     callback(null, course);
// }

// module.exports = [
//     {
//         gauntlet: 1,
//         tests: g1Tests
//         },
//     {
//         gauntlet: 2,
//         tests: g2Tests
//         },
//     {
//         gauntlet: 3,
//         tests: g3Tests
//         },
//     {
//         gauntlet: 4,
//         tests: g4Tests
//         },
// ];

/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');

module.exports = (course, callback) => {
    tap.test('child-template', (test) => {

        test.pass('potato');
        test.pass('tomato');
        test.fail('avacado');

        test.end();
    });

    callback(null, course);
};

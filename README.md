# Quiz Instructions
### *Package Name*: quiz-instructions
### *Child Type*: preimport
### *Platform*: all
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

Canvas has only Description, but d2l has quiz info in 4 places. The module locates all the different places the quiz instructions and descriptions are and put them all into the Description.  In the process of course import the Description will be ransfered from d2l to Canvas. 

## How to Install

npm install quiz-instructions

## Run Requirements

N/A

## Options

N/A

## Outputs

N/A

## Process

1. Check 4 xml elements of each quiz file for any content 
2. If there is, put the content into the content collector
3. Replace the content in the Description with the content from the content collector

## Log Categories

/* Used to log successful actions */

course.log('Descriptions for the quiz', jsonReport);

## Requirements

The module returns the course with the updated Description for each quiz

# Qualtrics Studies for Matthew K. Johnson

## How to Copy into Qualtrics

First, you will have to create a new survey or open an existing one.

There are three files for each question:

1. `html`  This is the document for the question itself.  To put this into Qualtrics, click the question you want, switch to the "HTML View" tab and copy/paste the contents of the file into the box.  Save your changes.
2. `js`  This contains the scripts to run for the question.  To put this into Qualtrics, you will have to add JavaScript to your question (I actually don't know how to do this, so I always just copy an existing question that has JavaScript).  Then, click "JS" button to the left of the question and copy/paste the contents of the file into the popup box.  Save your changes.
3. `css`  This is the stylesheet for your survey.  This is used per-survey, as opposed to per-question, like the other two files above.  This means that if the questions in your survey require multiple stylesheets, you need to merge them into a single stylesheet.  To put this into Qualtrics, click the "Look & Feel" button in the survey toolbar.  Then, in the popup that opens, select the "Advanced" tab and click the "Add Custom CSS" button.  Finally, copy/paste the contents of the file into the popup box.  Save your changes.

## How to Combine into One Survey

The steps are very similar to the above.

First, you will have to create a new survey or open an existing one.

For each question, you can create a block or a question.

1. `html`  This is the code for displaying the question.   To put this into Qualtrics, click the question you want, switch to the "HTML View" tab and copy/paste the contents of the file into the box.  Save your changes.
2. `js`  This contains the scripts to run the dynamic content for the question and respond to user input.  To put this into Qualtrics, you will have to add JavaScript to the question (I'm not sure how to actually do this, so I just copy an existing question that has JavaScript).  Then, click the "JS" button to the left of the question and copy/paste the contents of the file into the popup box.  Save your changes.

For the `css` files, since the styles are per-survey instead of per-question like the HTML and JS, you will have to combine them all.  To edit the CSS for your survey, click the "Look & Feel" button in the survey toolbar.  Then, in the popup that opens, select the "Advanced" tab and click the "Add Custom CSS" button.  Copy/paste each the contents of the CSS files into the popup box, one after the other.  All of the naming conflicts should have been resolved, and the class names in common should not have style conflicts.

Finally, in the "Advanced" tab, you can also select a theme.  Some themes might not look good for the survey, since the questions all assume some fixed width container.  Most of the themes should be fine, but just preview the survey after selecting a new theme just to make sure.

# Qualtrics Studies for Matthew K. Johnson

## How to Copy into Qualtrics

First, you will have to create a new survey or open an existing one.

There are three files for each question:

1. `html`:  This is the document for the question itself.  To put this into Qualtrics, click the question you want, switch to the "HTML View" tab and copy/paste the contents of the file into the box.
2. `js`:  This contains the scripts to run for the question.  To put this into Qualtrics, you will have to add JavaScript to your question (I actually don't know how to do this, so I always just copy an existing question that has JavaScript).  Then, click "JS" button to the left of the question and copy/paste the contents of the file into the popup box.
3. `css`:  This is the stylesheet for your survey.  This is used per-survey, as opposed to per-question, like the other two files above.  This means that if your questions require multiple stylesheets, you need to merge them into a single one.  To put this into Qualtrics, click the "Look & Feel" button in the survey toolbar.  Then, in the popup that opens, select the "Advanced" tab and click the "Add Custom CSS" button.  Finally, copy/paste the contents of the file into the popup box.

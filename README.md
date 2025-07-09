# ScriptEnglish

ScriptEnglish is a lightweight, zero-dependency JavaScript library that allows you to manipulate the DOM and build interactive web applications using intuitive, English-like commands. It acts as an abstraction layer over standard JavaScript, making web development faster, more readable, and more fun.

This library is a modernized and secure evolution of the original Jenglish concept.

Features
Natural Language Syntax: Write commands that are easy to read and understand.

Zero Dependencies: A single, lightweight JS file is all you need.

Asynchronous Core: Commands can be chained together and will execute in sequence, even if they involve delays or network requests.

Secure by Default: Avoids dangerous functions like eval() and defaults to safe text insertion.

Dynamic & Interactive: Built-in support for event handling, animations, and fetching data from APIs.

Extensible: Easily register your own custom commands.

Getting Started
Save the Library: Save the ScriptEnglish code into a file named scriptenglish.js.

Include in HTML: Add the script to your HTML file, preferably at the end of the <body> tag.

<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Your content will be created here -->

    <script src="scriptenglish.js"></script>
    <script>
        // Wait for the document to be ready
        document.addEventListener('DOMContentLoaded', () => {
            // Run your ScriptEnglish commands!
            ScriptEnglish.cmd(`
                create div named welcomeBox in body
                .. addClass container to welcomeBox
                .. insert text "Hello, World!" into welcomeBox
            `);
        });
    </script>
</body>
</html>

Core Concepts
Command Structure
Commands are simple, readable strings passed to the ScriptEnglish.cmd() function.

Chaining Commands
You can chain multiple commands together using the .. operator. The next command in the chain will wait for the previous one to complete before executing.

// This creates a div, then adds a class to it, then inserts text.
ScriptEnglish.cmd(`
    create div named myBox in body
    .. addClass card to myBox
    .. insert text "This is a card." into myBox
`);

Event Handling Blocks
To handle user interactions, use the when...do...end block structure. This allows you to define a sequence of commands that will run in response to a DOM event.

ScriptEnglish.cmd(`
    when myButton is click do
        animate myButton with fade-in-anim
        .. insert text "Button Clicked!" into someOtherBox
    end
`);

Placeholders
Inside a when block, you can use special placeholders that get replaced with dynamic values when the event occurs:

INPUT_VALUE: Replaced by the current value of the <input> element within the element that triggered the event (e.g., inside a form).

UNIQUE_ID: Replaced by a timestamp, perfect for creating elements with unique IDs.

Command Reference
Creation & Deletion
create
Creates a new HTML element.

Syntax: create <tag> named <id> [in <containerId>] [with text "initial text"]

Example: create h1 named mainTitle in appHeader with text "Welcome"

remove
Removes an element from the page.

Syntax: remove element <id>

Example: remove element task-item-123

Styling & Classes
style
Applies one or more inline CSS styles to an element.

Syntax: style <id> with <property>:<value> [and <property>:<value>...]

Example: style mainTitle with color:blue and font-size:24px

addClass
Adds a CSS class to an element.

Syntax: addClass <className> to <id>

Example: addClass card to myBox

removeClass
Removes a CSS class from an element.

Syntax: removeClass <className> from <id>

Example: removeClass hidden from myBox

toggleClass
Toggles a CSS class on an element.

Syntax: toggleClass <className> on <id>

Example: toggleClass active on myButton

Content & Attributes
insert
Inserts content into an element.

Syntax: insert <text|html|value> "content" <into|on> <id>

Example (safe text): insert text "Hello World" into myBox

Example (input value): insert value "Default text" on myInput

Example (unsafe HTML): insert html "<b>Bold</b>" into myBox

setAttr
Sets an HTML attribute on an element.

Syntax: setAttr <attribute> to "value" on <id>

Example: setAttr placeholder to "Enter your name..." on nameInput

Events & Asynchronous Operations
when
Executes a block of commands when a DOM event occurs.

Syntax: when <id> is <event> do ... end

Example:

ScriptEnglish.cmd(`
  when myForm is submit do
      create p named successMsg in myForm
      .. insert text INPUT_VALUE into successMsg
  end
`);

animate
Applies a CSS class for a set duration to trigger an animation.

Syntax: animate <id> with <className> [for <duration>s] [and keep]

Example: animate myBox with fade-out-anim for 0.5s

wait
Pauses the command chain for a specified duration.

Syntax: wait <duration>s

Example: wait 1.5s

fetch
Fetches JSON data from a URL.

Syntax: fetch json from <url> [and store as <stateKey>]

Example: fetch json from https://api.example.com/data

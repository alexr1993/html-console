var desktop = document.querySelector('#desktop'),
    menubar = document.querySelector('#menubar'),
    input = document.querySelector('#input'),
    content = document.querySelector('#content'),
    prompt = document.querySelector('#prompt'),
    command = document.querySelector('#command'),
    terminal = document.querySelector('#terminal'),
    endofcommand = document.querySelector('#endofcommand'),
    cursor_position = 0,
    CURSOR_HTML = '<b class="unselectable cursor">#</b>',
    ACTION_KEYCODES = {
        8: "backspace",
        13: "enter",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        46: "delete"
    },
    SPACE = "&nbsp;";

var escapeHTML = function (html) {
    return html.replace(/&/g, '&amp;').replace(/ /g, SPACE);
};

var refreshCursor = function () {
    var commandContent = command.textContent;
    var before = commandContent.slice(0, cursor_position),
    cursorChar = commandContent[cursor_position],
    after = commandContent.slice(cursor_position + 1),
    newContent;

    // cursor is not at end of command
    if (cursorChar) {
        endofcommand.classList.remove("cursor");

        command.innerHTML = escapeHTML(before);
        command.innerHTML += CURSOR_HTML.replace(/#/g, escapeHTML(cursorChar));
        command.innerHTML += escapeHTML(after);
    }
    // cursor is at end of command
    else {
        /* remove class with animation, cause a redraw by assigning to offset width
        then add the animation again to reset it to it's origin */
        endofcommand.classList.remove("cursor");
        endofcommand.offsetWidth = endofcommand.offsetWidth;
        endofcommand.classList.add("cursor");

        command.innerHTML = escapeHTML(before);
    }
};

var cursorMove = function (displacement) {
    if ((displacement === 0) ||
        (displacement < 0 && cursor_position === 0) ||
        (displacement > 0 && cursor_position === command.textContent.length)) {
        return;
    }
    cursor_position += displacement;
    refreshCursor();
};

// insert : string to be inserted at the cursor
// delete : number of chars to be removed behind the cursor
var edit = function (insert, remove, isUserEdit) {
    var before = command.textContent.slice(0, cursor_position),
    after = command.textContent.slice(cursor_position);

    if (remove) {
        before = before.slice(0, before.length - remove);
    }

    command.innerHTML = escapeHTML(before);
    command.innerHTML += escapeHTML(insert || "");
    command.innerHTML += escapeHTML(after);

    if (isUserEdit) {
        command_stack.updateCommand(command.textContent);
    }

    cursorMove((insert.length || 0) - (remove || 0));
};

var backspace = function () {
    if (cursor_position === 0) {
        return;
    }
    edit(false, 1, true);
};

var del = function () {
    if (cursor_position === command.textContent.length) {
        return
    }
    cursorMove(1);
    edit(false, 1, true);
};

var handleTextInput = function () {
        // set 1ms timeout to give time for the textfield to set it's textContent value
        window.setTimeout(function () {
            var commandContent,
            inputvalue;

        // add input value
        if (input.value && input.value.length) {
            inputvalue = input.value;
            scrollToBottom();
            edit(inputvalue, false, true);
            input.value = null;
        }
    }, 1)
    };

    var scrollToBottom = function () {
        content.scrollTop = content.scrollHeight;
    };

    var enter = function () {
    // Write command to log
    log.innerHTML += '<span class="prompt">' + prompt.innerHTML + '</span>';
    log.innerHTML += escapeHTML(command.textContent);
    log.innerHTML += "<br />";

    command_stack.addCommand(command.textContent);

    // remove contents of command 
    end();
    edit(false, command.textContent.length, false);
    scrollToBottom();

    command_stack.addCommand("");
};

var end = function () {
    cursorMove(command.textContent.length - cursor_position);
};

var home = function () {
    cursorMove(-cursor_position);
};

var up = function () {
    var previousCommand = command_stack.getPrevious();
    end();
    if (previousCommand) {
        edit(previousCommand, command.textContent.length, false);
    };
};

var down = function () {
    var nextCommand = command_stack.getNext();
    end();
    // user must be able to go down to a new empty command, hence only make
    // they are not already there
    if (nextCommand) {
        edit(nextCommand, command.textContent.length, false);
    };
};

input.onkeydown = function (e){
    // if arrow key, backspace, or enter
    var ev = window.event ? window.event : e,
    action = ACTION_KEYCODES[ev.keyCode];

    if (action) {
        scrollToBottom();
        switch (action) {
            case "backspace":
                backspace();
                break;
            case "enter":
                enter();
                break;
            case "end":
                end();
                break;
            case "home":
                home();
                break;
            case "left":
                cursorMove(-1)
                break;
            case "up":
                up();
                break;
            case "right":
                cursorMove(1);
                break;
            case "down":
                down();
                break;
            case "delete":
                del();
                break;
        }
    }
    else {
        handleTextInput();
    }
}

var focusTerminal = function (e) {
    input.focus();
    terminal.classList.add("active");
    menubar.classList.add("active");
    document.querySelector(".cursor").style.visibility = "visible";
    e && e.stopPropagation();
};

terminal.onclick = focusTerminal;

var blurTerminal = function () {
    terminal.classList.remove("active");
    menubar.classList.remove("active");
    document.querySelector(".cursor").style.visibility = "hidden";
};
desktop.onclick = blurTerminal;

window.onload = function () { input.focus(); };

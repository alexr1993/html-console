var command_stack = (function () {
    var commandStack = [""],
        commandStackPointer = 0;

    return {
        // public methods and properties
        addCommand: function (command) {
            commandStack.push(command);
            commandStackPointer = commandStack.length - 1;
        },
        updateCommand: function (command) {
            commandStack[commandStackPointer] = command;
        },
        getPrevious: function () {
            if (commandStackPointer !== 0) {
                return commandStack[--commandStackPointer];
            }
        },
        getNext: function () {
            if (commandStackPointer !== commandStack.length - 1) {
                return commandStack[++commandStackPointer];
            }
        },
        toString: function () {
            return commandStack.toString();
        }
    };
}());

var out_content = (function () {
    var ls = [
        "Okay this isn’t really a working terminal, it’s an empty shell. I ",
        "was thinking of making a suggestion box but for now if you have any",
        " suggestions of what it could do, let me know (alexr1993 (gmail))"
    ].join('');
    var pwd = [
        "/home/alex/conspiracy_plans/just_joking/sorry_to_disappoint/ I’m ",
        "surprised anyone is reading this. Thanks for the interest and email",
        " me if you know any good games or safe and convenient linux ",
        "environments to put here alexr1993 (gmail))"
    ].join('');

    return {
        ls: ls,
        pwd: pwd
    }
}());
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
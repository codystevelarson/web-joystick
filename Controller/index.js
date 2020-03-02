var gamepadAPI = {
    controller: {},
    turbo: false,
    buttons: [
        'B', 'A', 'Y', 'X',
        'L1', 'R1', 'L2', 'R2',
        'select', 'start', 'L3', 'R3', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right',
    ],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
    connected: false,
    connect: function (controller) {
        this.connected = true;
        this.controller = controller;
        this.buttonsStatus = controller.buttons
        this.turbo = true;
    },
    disconnect: function () {
        this.connected = false;
        this.turbo = false;
        delete gamepadAPI.controller;
        console.log('Gamepad disconnected.');
    },
    update: function () {
        gamepadAPI.connect(navigator.getGamepads()[0]);

        // clear the buttons cache
        gamepadAPI.buttonsCache = [];
        // move the buttons status from the previous frame to the cache
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
            this.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        // clear the buttons status
        gamepadAPI.buttonsStatus = [];
        // get the gamepad object
        var c = gamepadAPI.controller || {};

        // loop through buttons and push the pressed ones to the array
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < t; b++) {
                if (c.buttons[b].pressed) {
                    this.buttonPressed(gamepadAPI.buttons[b]);

                    pressed.push(this.buttons[b]);
                }
            }
        }
        // loop through axes and push their values to the array
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {
                axes.push(c.axes[a].toFixed(2));
            }
        }
        // assign received values
        this.axesStatus = axes;
        this.buttonsStatus = pressed;
        printButtons();

        printAxes(axes);


        if (!pressed.length && !axes.length) {
            console.clear();
        }

        // return buttons for debugging purposes
        return pressed;
    },
    buttonPressed: function (button, hold) {
        var newPress = false;
        // loop through pressed buttons
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {
            // if we found the button we're looking for...
            if (gamepadAPI.buttonsStatus[i] == button) {
                // set the boolean variable to true
                newPress = true;
                // if we want to check the single press
                if (!hold) {
                    // loop through the cached states from the previous frame
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {
                        // if the button was already pressed, ignore new press
                        if (gamepadAPI.buttonsCache[j] == button) {
                            newPress = false;
                        }
                    }
                }
            }
        }
        return newPress;
    },
};




window.addEventListener("gamepadconnected", (event) => {
    gamepadAPI.connect(event.gamepad);
    document.getElementById('controller').innerText = 'CONTROLLER: Connected';
    console.log(`Gamepad connected!`);
});
window.addEventListener("gamepaddisconnected", (event) => {
    document.getElementById('controller').innerText = 'CONTROLLER: Disconnected'
    gamepadAPI.disconnect
});


window.setInterval(() => {
    if (gamepadAPI.connected) {
        gamepadAPI.update();
    }
}, 50);



function printButtons() {
    let btns = ''
    for (let b = 0; b < gamepadAPI.buttonsStatus.length; b++) {
        if (btns.length > 0) {
            btns += ' + ' + gamepadAPI.buttonsStatus[b];
        } else {
            btns = gamepadAPI.buttonsStatus[b];
        }
    }
    if (btns.length > 0) {
        document.getElementById('input').innerText = 'Button: ' + btns;
        console.log(btns);
    } else {
        document.getElementById('input').innerText = 'Button: ';
    }
}

function printAxes(axes) {
    vals = axes.filter(a => a != 0.00);
    let axs = `Lx: ${axes[0]}, Ly: ${axes[1]}\n Rx: ${axes[2]}, Ry: ${axes[3]}`
    if (vals.length) {
        console.log(axs);
    }
    document.getElementById('axes').innerText = axs;

}


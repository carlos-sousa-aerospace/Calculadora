var lock_result = false;
var lock_decimals_equal = true;
var lock_comma = true;
var result = 0;
var accumulated = 0;
var buffer = "";
var listeners = new Map();
var binary_mode = "plus";

window.onload = function() {
    const decimals = new Map();
    decimals.set("zero", "0")
        .set("one", "1")
        .set("two", "2")
        .set("three", "3")
        .set("four", "4")
        .set("five", "5")
        .set("six", "6")
        .set("seven", "7")
        .set("eight", "8")
        .set("nine", "9");

    const binary_ops = new Map();
    binary_ops.set("plus", "+")
        .set("minus", "\u2212")
        .set("multiply", "\u00d7")
        .set("divide", "\u00f7");

    /* Add Event Listeners to the operations */

    for (let [key, value] of binary_ops) {

        listeners.set(key, function() {
            if (buffer.length > 0) {
                update_history(value);
                flush_buffer();
                binary_mode = key;
                clear_result();
                reset_locks();
            }
        });
    }

    /* Equal button */
    listeners.set("equal", function() {
        if (lock_result && lock_decimals_equal && buffer.length > 0) {
            buffer = result.toString();
            document.querySelector("#operation p").textContent = buffer;
            accumulated = 0;
            clear_result();
            lock_decimals_equal = false;
            lock_result = false;
        }
    });

    add_listeners();


    /* Add Event Listeners to the numbers and comma buttons */

    for (let [key, value] of decimals) {
        document.getElementById(key).addEventListener("click", function() {
            if (lock_decimals_equal) {
                update_history(value);
                buffer += value;
                update_result();
            }
        });
    }

    document.getElementById("comma").addEventListener("click", function() {
        if (lock_decimals_equal && lock_comma) {
            update_history(".");
            buffer += ".";
            lock_comma = false;
        }
    });


    /* Percent TO BE DONE...
    document.getElementById("percent").addEventListener("click", function() {
        update_history("\u0025");
        let x = parseFloat(buffer) / 100;
        buffer = x.toString();
        update_result();
        lock_decimals_equal = false;
    });
    */

    /* Add Event Listeners to the AC button */

    document.getElementById("ac").addEventListener("click", function() {
        document.querySelector("#operation p").textContent = "";
        clear_result();
        result = 0;
        accumulated = 0;
        buffer = "";
        lock_result = false;
        lock_decimals_equal = true;
        lock_comma = true;
        binary_mode = "plus";
    });
};

function reset_locks() {
    if (!lock_result) {
        lock_result = true;
    }
    if (!lock_decimals_equal) {
        lock_decimals_equal = true;
    }
    if (!lock_comma) {
        lock_comma = true;
    }
}

function add_listeners() {
    for (let [key, value] of listeners) {
        document.getElementById(key).addEventListener("click", value);
    }
}

function remove_listeners() {
    for (let [key, value] of listeners) {
        document.getElementById(key).removeEventListener("click", value);
    }
}

function clear_result() {
    let r = document.querySelector("#result p");
    if (r.textContent.length > 0) {
        r.textContent = "";
    }
}

function flush_buffer() {
    accumulated = result;
    buffer = "";
}

function calculate(x) {
    switch (binary_mode) {
        case "plus":
            result = accumulated + x;
            break;
        case "minus":
            result = accumulated - x;
            break;
        case "multiply":
            result = accumulated * x;
            break;
        case "divide":
            result = accumulated / x;
            break;
        default:
            result = accumulated;
            break;
    }
}

function update_history(chr) {
    document.querySelector("#operation p").textContent += chr;
}

function update_result() {
    calculate(parseFloat(buffer)) /* updates result */
    if (lock_result) {
        document.querySelector("#result p").textContent = result.toString();
    }
}
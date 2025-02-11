console.clear();
const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

// Selecting the Range Slider container which will effect the LENGTH property of the password.
const slider = document.querySelector(".range__slider");

// Text which will show the value of the range slider.
const sliderValue = document.querySelector(".length__title");

// Using Event Listener to apply the fill and also change the value of the text.
slider.querySelector("input").addEventListener("input", event => {
    sliderValue.setAttribute("data-length", event.target.value);
    applyFill(event.target);
});
// Selecting the range input and passing it in the applyFill func.
applyFill(slider.querySelector("input"));

// This function is responsible to create the trailing color and setting the fill.
function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
    0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

// Object of all the function names that we will use to create random letters of password
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
};

// Random more secure value
function secureMathRandom() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

// Generator Functions
// All the functions that are responsible to return a random value taht we will use to create password.
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Selecting all the DOM Elements that are necessary -->

// The input slider, will use to change the length of the password
const lengthEl = document.getElementById("slider");

// Checkboxes representing the options that is responsible to create differnt type of password based on user
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");
const moreInfoEl = document.getElementById("more-info");
// const lengthSettingEl = document.getElementById("length-setting");
const settingEl = document.getElementById("setting");

// The Viewbox where the result will be shown
let resultEl = [];
let copyBtn = [];
for (let i = 1; i <= 5; i++) {
    resultEl.push(document.getElementById(`result${i}`));
    copyBtn.push(document.getElementById(`copy-btn${i}`));
}

// Result viewbox container
const resultContainer = document.querySelector(".result");

// Update Css Props of the COPY button
// Getting the bounds of the result viewbox container
let resultContainerBound = {
    left: resultContainer.getBoundingClientRect().left,
    top: resultContainer.getBoundingClientRect().top,
};
// This will update the position of the copy button based on mouse Position
resultContainer.addEventListener("mousemove", e => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
    copyBtn.forEach((el, index) => {
        el.style.opacity = '1';
        el.style.pointerEvents = 'all';
        el.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
        el.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
    })
});
window.addEventListener("resize", e => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
});

// Copy Password in clipboard
copyBtn.forEach((el, index) => {
    el.addEventListener("click", () => {
        const textarea = document.createElement("textarea");
        const password = resultEl[index].innerText;
        if (!password || password == "CLICK GENERATE") {
            return;
        }
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        resultEl[index].classList.add('result-used');
    })
})


moreInfoEl.addEventListener("click", () => {
    if (moreInfoEl.classList.contains('show')) {
        // lengthSettingEl.style.display = 'none';
        settingEl.style.display = 'none';
        moreInfoEl.classList.remove('show')
    } else {
        // lengthSettingEl.style.display = 'block';
        settingEl.style.display = 'block';
        moreInfoEl.classList.add('show')
    }
});


let indexGenerate = 0;
// 每 100 毫秒自动生成密码
setInterval(() => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;
    indexGenerate++;
    resultEl[indexGenerate % resultEl.length].innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    resultEl[indexGenerate % resultEl.length].classList.remove('result-used');
}, 500);

// Function responsible to generate password and then returning it.
function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length);
}

// function that handles the checkboxes state, so at least one needs to be selected. The last checkbox will be disabled.
function disableOnlyCheckbox() {
    let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
    totalChecked.forEach(el => {
        if (totalChecked.length == 1) {
            el.disabled = true;
        } else {
            el.disabled = false;
        }
    })
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
    el.addEventListener('click', () => {
        disableOnlyCheckbox()
    })
})

let audioFiles = [
   "asserts/audio/knock_1.mp3",
   "asserts/audio/knock_2.mp3",
]


let dimensions = {
    small: {
    width: 1.5, height: 2.4, depth: 1.3,
    },
    medium: {
    width: 4, height: 3.2, depth: 3.9,
    },
    large: {
    width: 8, height: 3.4, depth: 9,
    },
    huge: {
    width: 20, height: 10, depth: 20,
    },
};
let materials = {
    brick: {
        left: 'brick-bare', right: 'brick-bare',
        up: 'brick-bare', down: 'wood-panel',
        front: 'brick-bare', back: 'brick-bare',
    },
    curtains: {
        left: 'curtain-heavy', right: 'curtain-heavy',
        up: 'wood-panel', down: 'wood-panel',
        front: 'curtain-heavy', back: 'curtain-heavy',
    },
    marble: {
        left: 'marble', right: 'marble',
        up: 'marble', down: 'marble',
        front: 'marble', back: 'marble',
    },
    outside: {
        left: 'transparent', right: 'transparent',
        up: 'transparent', down: 'grass',
        front: 'transparent', back: 'transparent',
    },
};

let dimensionSelection = "large";
let materialSelection = "curtains";

let audioContext;
let audioElements = [];
let audioElementSources = [];
let audioSources = [];
let scene;
let audioReady = false;
let audioBusy = false;


function initAudio() {
    console.log("initialize audio...")
    audioContext = new AudioContext();
    audioElementSource = document.createElement("audio");

    scene = new ResonanceAudio(audioContext, {
        ambisonicOrder: 1,
    });

    for (let i = 0; i < audioFiles.length; i++) {
        audioElements[i] = document.createElement("audio");
        audioElements[i].src = audioFiles[i];
        audioElements[i].crossOrigin = "anonymous";
        audioElements[i].load();
        audioElementSources[i] = 
            audioContext.createMediaElementSource(audioElements[i]);
        audioSources[i] = scene.createSource();
        audioElementSources[i].connect(audioSources[i].input)
    }

    scene.output.connect(audioContext.destination);

    audioReady = true;
}

function setRoomProperties() {
    console.log(dimensions[dimensionSelection])
    scene.setRoomProperties(dimensions[dimensionSelection], materials[materialSelection]);
}

function setRandomPosition(audioSource) {
    let dimention = dimensions[dimensionSelection];
    let cx = dimention.width / 2;
    let cy = dimention.height / 2;
    let cz = dimention.depth / 2;
    let x = Math.random() * (dimention.width + 1) - cx;
    let y = Math.random() * (dimention.height + 1) - cy;
    let z = Math.random() * (dimention.depth + 1) - cz;
    console.log(`x: ${x} y: ${y} z: ${z}`)
    audioSource.setPosition(x, y, z);
    return true;
}

async function playKnock() {
    audioBusy = true;
    let n = Math.floor(Math.random() * audioSources.length);
    setRandomPosition(audioSources[n]);
    audioElements[n].play();
    await new Promise((resolve, reject) => {
            audioElements[n].addEventListener("ended", (e) => {
            audioElements[n].currentTime = 0;
            console.log("finish")
            resolve()
        })
    });
    await sleep(Math.floor(Math.random() * (30 + 1) * 100));
    playKnock();

}

function main() {
    document.onclick = () => {
        if (!audioReady) {
            initAudio();
            setRoomProperties();
        }
        
        if (!audioBusy) {
            playKnock();
        }
    }
}

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

window.addEventListener("load", main)
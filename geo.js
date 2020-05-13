(() => {
    window.addEventListener('load', function () {
        log("window loaded")
        window["state"] = new State()
        getLocation()
    })
})()

class State {
    constructor(lat, lon, acc, intervalId) {
        log("initializing state")
        this.lat = lat
        this.lon = lon
        this.acc = acc
        this.intervalId = intervalId
    }
}

// gets the whole state
const getState = () => window['state']

// allows us to selectively update state
function setState(state) { Object.keys(state).forEach(k => { window['state'][k] = state[k] }) }

// logs text in intervals
function startStopTiming(txt = '.', ms = 500) {
    let state = getState()
    state.intervalId ? state.intervalId = clearInterval(state.intervalId) : state.intervalId = setInterval(() => log(txt, false), ms)
}

function getLocation() {
    let opts = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
    log("fetching location")
    startStopTiming()
    navigator.geolocation.getCurrentPosition((pos) => {
        let state = getState()
        state.lat = round(pos.coords.latitude)
        state.lon = round(pos.coords.longitude)
        state.acc = pos.coords.accuracy
        log()
        log(`lat: ${state.lat}°N`)
        log(`lon: ${state.lon}°E`)
        log(`accuracy: ${state.acc}m`)
        log(`<a href="//google.com/maps?q=${state.lat},${state.lon}" target="_blank">view on map</a>`)
        setState(state)
        startStopTiming()
    }, (err) => { log(`ERROR(${err.code}): ${err.message}`); startStopTiming() }, opts);
}

function log(txt = '<br/>', newline = true) {
    let lc = document.getElementById("logtext");
    if (lc.offsetParent) {
        lc.innerHTML += `${newline ? `<br/>` : ``}<span> ${txt}</span>`;
        lc.scrollTop = lc.scrollHeight
    }
    else { console.log(txt) }
}

function round(n) { return Math.round(n * 10000) / 10000 }
// create the map
let map = L.map("map", {
    center: [150, 755],
    crs: L.CRS.Simple,
    zoom: 1,
    minZoom: -5,
    maxZoom: 3,

    zoomControl: false
});

const posteIcon = L.icon({
    iconUrl: "assets/poste.gif",
    iconSize: [32, 32],
});

// create the image
const imageUrl = "assets/gtaV.jpg",
    imageBounds = [
        [-4000, -4000],
        [8000, 6000],
    ];

var markers = {}; // Dictionary to hold your markers in an outer scope.
var blipsAdded = {};

function getData() {
    fetch("http://localhost:8070/callApi?api=character_getonlinecharacters")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            AddOrUpdateMarkers(data);

            /*AddOrUpdateMarkers(data);
            UpdateChat(data);
            UpdateDashboard(data);*/
        });
}

setInterval(function () {
    getData();
}, 1000);

function UpdateDashboard(data) {
    let plys = data.persons;

    const dashboardcontent = document.getElementById("dashboard-content");
    dashboardcontent.innerHTML = '';

    for (let ply of plys) {
        let childDom = document.createElement("div");
        childDom.className = "dashboard-content";
        childDom.innerHTML =
            `
                    ${ply.name}: ${ply.occupation}
            `;
        dashboardcontent.append(childDom);
    }
}

function UpdateChat(data) {
    let msgs = data.messages;

    const history = document.getElementById("history");
    history.innerHTML = '';

    for (let msg of msgs) {
        let childDom = document.createElement("div");
        childDom.className = "entry msgtype-" + msg.type;

        childDom.innerHTML =
            `
                <span class="msg">
                    ${msg.fulltext}
                </span>
            `;
        history.append(childDom);
    }

    const chat = document.getElementById("chat");
    chat.scroll(0, chat.scrollHeight);
}

function AddOrUpdateMarkers(data) {
    var blips = data.result;
    let persons = "";
    blips.forEach((blip) => {
        var id = blip.name;
        var latLng = [blip.position.Y, blip.position.X];
        const firstSpaceindex = blip.name.indexOf(" ");
        let unit = blip.name.substring(0, firstSpaceindex);
        if (unit === "") {
            unit = blip.name;
        } else {
            persons = blip.name.substring(firstSpaceindex);
        }

        let blipPopup = L.popup({
            closeOnClick: true,
            autoClose: false,
        }).setContent(persons);

        let iconToUse = "";

        const pedIcon = L.divIcon({
            className: "blue",
            html: L.Util.template(
                `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000"
     preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
    <path d="M2418 5096 c-98 -35 -170 -78 -508 -301 -168 -112 -350 -228 -404
    -260 -313 -179 -585 -287 -899 -355 -133 -29 -189 -48 -202 -70 -3 -6 -7 -28
    -7 -50 -1 -92 120 -278 288 -440 104 -101 277 -240 298 -240 7 0 21 10 32 21
    28 31 119 91 199 131 207 103 497 176 852 215 221 24 765 24 986 0 487 -53
    872 -179 1044 -340 41 -38 43 -37 183 76 189 152 346 333 412 473 29 61 39
    129 23 154 -13 21 -68 41 -182 65 -387 83 -662 212 -1078 505 -438 308 -540
    368 -701 415 -117 34 -241 34 -336 1z m302 -557 c41 -20 95 -54 119 -75 43
    -37 43 -39 38 -88 -15 -145 -115 -330 -215 -401 -37 -25 -53 -30 -102 -30 -49
    0 -65 5 -102 30 -100 71 -200 256 -215 401 -5 50 -5 51 38 88 90 77 189 116
    289 113 63 -2 87 -8 150 -38z"/>
    <path d="M2305 3544 c-564 -44 -984 -159 -1272 -347 l-63 -41 0 -238 c0 -220
    -1 -238 -17 -238 -10 0 -43 -12 -73 -26 -146 -68 -245 -192 -280 -351 -17 -72
    -13 -223 6 -290 50 -176 184 -330 340 -391 l47 -19 49 -119 c72 -175 257 -543
    335 -666 208 -328 423 -551 663 -686 270 -151 619 -175 905 -62 293 116 551
    358 798 748 80 126 267 498 335 666 45 114 49 119 87 134 66 25 171 100 219
    154 156 179 193 453 89 668 -50 103 -169 203 -285 240 l-38 12 0 232 0 232
    -62 41 c-249 162 -619 277 -1063 328 -133 15 -606 28 -720 19z m-665 -860
    c257 -85 545 -124 920 -124 459 0 784 57 1088 188 l92 41 0 -245 0 -245 153 3
    c127 2 157 -1 184 -15 50 -27 68 -113 38 -185 -32 -76 -87 -112 -203 -132 -40
    -7 -76 -18 -81 -24 -5 -6 -36 -81 -71 -166 -214 -536 -418 -886 -652 -1118
    -138 -137 -272 -216 -420 -246 -97 -20 -159 -20 -256 0 -148 30 -282 109 -420
    246 -234 232 -435 577 -653 1118 -34 85 -66 160 -71 166 -4 6 -26 14 -48 18
    -105 17 -143 29 -177 59 -93 82 -96 225 -6 264 27 12 78 18 181 21 l142 4 0
    238 0 239 93 -41 c50 -22 126 -51 167 -64z"/>
    <path d="M2467 2398 c-48 -4 -119 -18 -158 -31 -61 -21 -77 -23 -113 -13 -25
    6 -152 11 -326 11 -244 0 -293 -3 -342 -18 -110 -34 -153 -101 -152 -237 2
    -134 52 -251 148 -345 130 -126 300 -172 474 -126 209 55 351 230 369 454 l6
    77 41 12 c23 6 88 11 146 11 58 0 123 -5 146 -11 l41 -12 6 -77 c18 -224 160
    -399 369 -454 174 -46 344 0 474 126 98 96 147 213 147 350 0 163 -55 223
    -228 246 -101 13 -538 7 -598 -9 -30 -8 -47 -6 -86 9 -92 35 -229 49 -364 37z"/>
    </g>
    </svg>`
            ),
            iconAnchor: [17, 20],
            iconSize: [32, 32],
            className: blip.color,
        });

        iconToUse = pedIcon;


        if (
            blip.text !== "OFF" &&
            blip.text != "OFF." &&
            blip.text !== "off." &&
            blip.text !== "off" &&
            blip.text !== "Off." &&
            blip.text !== "Off"
        ) {
            if (!markers[id]) {
                // If there is no marker with this id yet, instantiate a new one.
                if (persons !== "") {
                    markers[id] = L.marker(latLng, { icon: iconToUse })
                        .addTo(map)
                        .bindPopup(blipPopup)
                        .bindTooltip(unit, {
                            direction: "bottom",
                            offset: [0, 15],
                            permanent: true,
                            className: "class-tooltip",
                        })
                        .openTooltip();
                } else {
                    markers[id] = L.marker(latLng, { icon: iconToUse })
                        .addTo(map)
                        .bindTooltip(unit, {
                            direction: "bottom",
                            offset: [0, 15],
                            permanent: true,
                        })
                        .openTooltip();
                }
            } else {
                // If there is already a marker with this id, simply modify its position.
                if (persons !== "") {
                    markers[id]
                        .setLatLng(latLng)
                        .setIcon(iconToUse)
                        .bindPopup(blipPopup)
                        .setTooltipContent(unit, {
                            direction: "bottom",
                            offset: [0, 15],
                            permanent: true,
                        })
                        .openTooltip();
                } else {
                    markers[id]
                        .setLatLng(latLng)
                        .setIcon(iconToUse)
                        .unbindPopup(blipPopup)
                        .setTooltipContent(unit, {
                            direction: "bottom",
                            offset: [0, 15],
                            permanent: true,
                        })
                        .openTooltip();
                }
            }
            blipsAdded[id] = id;
        }
    });
    for (let [key, value] of Object.entries(markers)) {
        if (!blipsAdded[key]) {
            map.removeLayer(value);
            delete markers[key];
        }
    }
    blipsAdded = {};
}

// 2526.0974,-2696.7273 port
// -2371.7661,2210.2646 bayside
let newpopup = L.popup({
    closeOnClick: true,
    autoClose: false,
}).setContent("<strong>Poste de police</strong>");
L.marker([-1680, 1560], { icon: posteIcon }).bindPopup(newpopup).addTo(map);
L.imageOverlay(imageUrl, imageBounds).addTo(map);
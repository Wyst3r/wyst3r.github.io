const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

var inputsList = document.getElementById('inputs');

document.getElementById('tempo').innerText = 'Found ' + 15 + ' inputs';

    var div = document.createElement('div');
    div.style.color = "gray";
    var text = document.createTextNode('gay');
    div.appendChild(text);
    inputsList.appendChild(div);

if (gl === null) {
    alert("No WebGL support in your browser");
}

// if (navigator.requestMIDIAccess) {
//     navigator.requestMIDIAccess({
//         sysex: false
//     }).then(onMIDISuccess, onMIDIFailure);
// } else {
//     alert("No WebMIDI support in your browser.");
// }

// const white_key_count = 52;
// const black_key_count = 36;

// const white_key_width = ((1.0 - (-1.0)) / white_key_count);
// const white_key_height = 0.2; // Make it depend on aspect ratio?
// const white_to_black_width_ratio = 0.6;
// const white_to_black_height_ratio = 0.65;

// var white_key_vertices = [];
// var white_key_colors = [];
// var white_key_indices = [];

// var white_key_outline_colors = [];
// var white_key_outline_indices = [];

// var black_key_vertices = [];
// var black_key_colors = [];
// var black_key_indices = [];

// var black_key_outline_colors = [];
// var black_key_outline_indices = [];

// for (var key = 0; key < white_key_count; key++)
// {
//     const start_x = (-1.0 + (key * white_key_width));
//     const start_y = -1.0;
//     const end_x = (-1.0 + ((key + 1) * white_key_width));
//     const end_y = (-1.0 + white_key_height);
//     const index_start = (white_key_vertices.length / 2);

//     white_key_vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
//     white_key_colors.push(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
//     white_key_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));

//     white_key_outline_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
//     white_key_outline_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 3));
// }

// const black_key_offsets = [0.6, 1.2, 0.5, 0.5, 1.2];
// const black_key_width = (white_key_width * white_to_black_width_ratio);
// const black_key_height = (white_key_height * white_to_black_height_ratio);

// var black_key_start_offset = (black_key_width / 2 + 0.5 * white_key_width);
// var black_key_offset = black_key_start_offset;

// for (var key = 0; key < 36; key++) {
//     const start_x = (-1.0 + black_key_offset);
//     const start_y = (-1.0 + white_key_height - black_key_height);
//     const end_x = (-1.0 + black_key_offset + black_key_width);
//     const end_y = (-1.0 + white_key_height);
//     const index_start = (black_key_vertices.length / 2);

//     black_key_vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
//     black_key_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
//     black_key_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));
    
//     black_key_outline_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
//     black_key_outline_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 3));
    
//     black_key_offset += ((black_key_offsets[(key + 4) % 5] * white_key_width) + black_key_width);
// }

// var white_key_vb = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, white_key_vb);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_vertices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);

// var white_key_cb = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_colors), gl.DYNAMIC_DRAW);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);

// var white_key_ib = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_ib);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(white_key_indices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// var white_key_outline_cb = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, white_key_outline_cb);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_outline_colors), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);

// var white_key_outline_ib = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_outline_ib);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(white_key_outline_indices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// var black_key_vb = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, black_key_vb);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_vertices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);

// var black_key_cb = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_colors), gl.DYNAMIC_DRAW);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);

// var black_key_ib = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_ib);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(black_key_indices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// var black_key_outline_cb = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, black_key_outline_cb);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_outline_colors), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);

// var black_key_outline_ib = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_outline_ib);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(black_key_outline_indices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// var vs_src =
//    'attribute vec2 position;' +
//    'attribute vec3 color;' +
//    'varying vec3 vColor;' +
//    'void main(void) {' +
//       'gl_Position = vec4(position, 0.0, 1.0);' +
//       'vColor = color;' +
//    '}';
   
// var vs = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vs, vs_src);
// gl.compileShader(vs);

// var fs_src =
//    'precision lowp float;' +
//    'varying vec3 vColor;' +
//    'void main(void) {' +
//       ' gl_FragColor = vec4(vColor, 1);' +
//    '}';

// var fs = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fs, fs_src);
// gl.compileShader(fs);

// var program = gl.createProgram();
// gl.attachShader(program, vs);
// gl.attachShader(program, fs);
// gl.linkProgram(program);
// gl.useProgram(program);

// var position = gl.getAttribLocation(program, "position");
// var color = gl.getAttribLocation(program, "color");

// const KeyStates = {
//     NONE : 0,
//     PRESSED : 1,
//     SONG : 2
// }

// var keyStates = [];

// for (var key = 0; key < (white_key_count + black_key_count); key++) {
//     keyStates.push(KeyStates.NONE);
// }

// const gradient = [
//     0.2, 1.0, 1.0, 0.2
// ]

// const white_keys = [
//     0,2,3,5,7,8,10,12,14,15,17,19,20,22,24,26,27,29,31,32,34,36,38,39,41,43,44,46,48,50,51,53,55,56,58,60,62,63,65,67,68,70,72,74,75,77,79,80,82,84,86,87
// ]
// const black_keys = [
//     1,4,6,9,11,13,16,18,21,23,25,28,30,33,35,37,40,42,45,47,49,52,54,57,59,61,64,66,69,71,73,76,78,81,83,85
// ]

// function updateColors() {
//     for (var key = 0; key < white_key_count; key++) {
//         var state = keyStates[white_keys[key]];
//         var primaryColor = [];

//         switch (state) {
//             case KeyStates.NONE: {
//                 primaryColor.push(1, 1, 1);
//                 break;
//             }

//             case KeyStates.PRESSED: {
//                 primaryColor.push(1.0, 0.0, 0);
//                 break;
//             }

//             case KeyStates.SONG: {
//                 primaryColor.push(0, 0.75, 0);
//                 break;
//             }
//         }

//         for (var i = 0; i < 4; i++) {
//             for (var j = 0; j < 3; j++) {
//                 white_key_colors[(key * 4 * 3) + (i * 3) + j] = (primaryColor[j] * gradient[i]);
//             }
//         }
//     }

//     gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);    
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_colors), gl.DYNAMIC_DRAW);
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);

//     for (var key = 0; key < black_key_count; key++) {
//         var state = keyStates[black_keys[key]];
//         var primaryColor = [];

//         switch (state) {
//             case KeyStates.NONE: {
//                 primaryColor.push(0, 0, 0);
//                 break;
//             }

//             case KeyStates.PRESSED: {
//                 primaryColor.push(1.0, 0, 0);
//                 break;
//             }

//             case KeyStates.SONG: {
//                 primaryColor.push(0, 0.75, 0);
//                 break;
//             }
//         }

//         for (var i = 0; i < 4; i++) {
//             for (var j = 0; j < 3; j++) {
//                 black_key_colors[(key * 4 * 3) + (i * 3) + j] = (primaryColor[j] * gradient[i]);
//             }
//         }
//     }    

//     gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);    
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_colors), gl.DYNAMIC_DRAW);
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
// }

function resize(gl) {
    var devicePixelRatio = window.devicePixelRatio;
  
    var displayWidth  = Math.floor(gl.canvas.clientWidth  * devicePixelRatio);
    var displayHeight = Math.floor(gl.canvas.clientHeight * devicePixelRatio);
  
    if ((gl.canvas.width  !== displayWidth) ||
        (gl.canvas.height !== displayHeight)) {
      gl.canvas.width  = displayWidth;
      gl.canvas.height = displayHeight;
    }
}

// var info = '';
// var inputs = [];
// var outputs = [];

// function updateInfo() {
//     var inputsList = document.getElementById('inputs');
//     var outputsList = document.getElementById('outputs');

//     document.getElementById('tempo').innerText = 'Found ' + inputs.length + ' inputs';

//     if (inputs.length > 0) {
//         for (var input of inputs) {
//             var div = document.createElement('div');
//             div.style.color = "gray";
//             var text = document.createTextNode(input);
//             div.appendChild(text);
//             inputsList.appendChild(div);
//         }
//     }
//     else {
//         var div = document.createElement('div');
//         div.style.color = "gray";
//         var text = document.createTextNode('None');
//         div.appendChild(text);
//         inputsList.appendChild(div);
//     }


//     if (outputs.length > 0) {
//         for (var output of outputs) {
//             var div = document.createElement('div');
//             div.style.color = "gray";
//             var text = document.createTextNode(output);
//             div.appendChild(text);
//             outputsList.appendChild(div);
//         }
//     }
//     else {
//        var div = document.createElement('div');
//        div.style.color = "gray";
//        var text = document.createTextNode('None');
//        div.appendChild(text);
//        outputsList.appendChild(div);
//     }
// }

requestAnimationFrame(drawScene);

function drawScene(time) {
    resize(gl);
    // updateColors();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.bindBuffer(gl.ARRAY_BUFFER, white_key_vb);
    // gl.vertexAttribPointer(position, 2, gl.FLOAT, true, 0, 0);
    // gl.enableVertexAttribArray(position);
    // gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);
    // gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(color);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_ib);
    // gl.drawElements(gl.TRIANGLES, white_key_indices.length, gl.UNSIGNED_SHORT, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, white_key_outline_cb);
    // gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(color);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_outline_ib);
    // gl.drawElements(gl.LINES, white_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, black_key_vb);
    // gl.vertexAttribPointer(position, 2, gl.FLOAT, true, 0, 0);
    // gl.enableVertexAttribArray(position);
    // gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);
    // gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(color);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_ib);
    // gl.drawElements(gl.TRIANGLES, black_key_indices.length, gl.UNSIGNED_SHORT, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, black_key_outline_cb);
    // gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(color);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_outline_ib);
    // gl.drawElements(gl.LINES, black_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, null);  
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    requestAnimationFrame(drawScene);
}

// function onMIDISuccess(access) {
//     for (var input of access.inputs.values()) {
//         input.onmidimessage = onMIDIMessage;
//         inputs.push(input.name);
//     }
//     for (var output of access.outputs.values()) {
//         outputs.push(output.name);
//     }
    
//     updateInfo();
// }

// function onMIDIFailure(e) {
//     alert('MIDI access request failed');
// }

// function onMIDIMessage(message) {
//     var command = message.data[0];
//     var note = message.data[1];
//     var velocity = ((message.data.length > 2) ? message.data[2] : 0);
//     var time = message.timeStamp;

//     switch (command) {
//         case 144:
//             if (velocity > 0) {
//                 onNoteOn(note, time);
//             } else {
//                 onNoteOff(note, time);
//             }
//             break;
//         case 152:
//             if (note == 34) {
//                 onMetronomeMeasure(time);
//             } else if (note == 33) {
//                 onMetronomeBeat(time);
//             }
//         case 128:
//             onNoteOff(note, time);
//             break;
//     }
// }

// var tempo = 0;
// var prev_measure_start = null;

// function onNoteOn(note, time) {
//     keyStates[note - 21] = KeyStates.PRESSED;
// }

// function onNoteOff(note, time) {
//     keyStates[note - 21] = KeyStates.NONE;
// }

// function onMetronomeMeasure(time) {
//     if (prev_measure_start != null) {
//         tempo = Math.floor((60 * 1000) / ((time - prev_measure_start) / 4));

//         document.getElementById('tempo').innerText = tempo;
//     }

//     prev_measure_start = time;
// }

// function onMetronomeBeat(time) {

// }

// canvas.addEventListener('mousedown', onMouseDown);
// canvas.addEventListener('mousemove', onMouseMove);
// canvas.addEventListener('mouseup', onMouseUp);
// canvas.addEventListener('mouseleave', onMouseLeave);
// canvas.addEventListener('touchstart', onTouchStart);
// canvas.addEventListener('touchend', onTouchEnd);
// canvas.addEventListener('touchmove', onTouchMove);
// canvas.addEventListener('touchcancel', onTouchCancel);

// var isMouseDown = false;

// function onMouseDown(event) {
//     checkKeyPressed('mouse', event);
//     isMouseDown = true;
// }

// function onMouseMove(event) {
//     if (isMouseDown) {
//         checkKeyPressed('mouse', event);
//     }
// }

// function onMouseUp(event) {
//     isMouseDown = false;
//     checkKeyReleased('mouse');
// }

// function onMouseLeave(event) {
//     onMouseUp(event);
// }

// var currentTouches = new Map();

// function onTouchStart(event) {
//     for (var touch of event.touches) {   
//         checkKeyPressed(touch.identifier, event);
//         currentTouches.set(touch.identifier, touch);
//     }
// }

// function onTouchEnd(event) {
//     for (var touch of event.touches) {
//         if (currentTouches.has(touch.identifier)) {
//             checkKeyReleased(touch.identifier);
//             currentTouches.delete(touch.identifier)
//         }
//     }
// }

// function onTouchMove(event) {
//     for (var touch of event.touches) {
//         if (currentTouches.has(touch.identifier)) {
//             checkKeyPressed(touch.identifier, event);
//         }
//     }
// }

// function onTouchCancel(event) {
//     onTouchEnd(event);
// }

// var idToKeyMap = new Map();

// function checkKeyPressed(id, event) {
//     var x = (-1.0 + (2.0 * (event.clientX / window.innerWidth)));
//     var y = (1.0 - (2.0 * (event.clientY / window.innerHeight)));

//     var pressedKey = null;

//     if (y > (-1.0 + white_key_height)) {
//         checkKeyReleased(id, event);
//         return;
//     }

//     if (y > (-1.0 + white_key_height - black_key_height)) {
//         black_key_offset = black_key_start_offset;

//         for (var key = 0; key < black_key_count; key++) {
//             var start_x = -1.0 + black_key_offset;
//             var end_x = (start_x + black_key_width);

//             if (x >= start_x && x <= end_x) {
//                 pressedKey = black_keys[key];
//                 break;
//             }

//             black_key_offset += ((black_key_offsets[(key + 4) % 5] * white_key_width) + black_key_width);
//         }
//     }

//     if (pressedKey == null) {
//         pressedKey = white_keys[Math.floor((x - (-1.0)) / white_key_width)];
//     }
    
//     if (idToKeyMap.has(id)) {
//         keyStates[idToKeyMap.get(id)] = KeyStates.NONE;
//     }
//     keyStates[pressedKey] = KeyStates.PRESSED;

//     idToKeyMap.set(id, pressedKey);
// }

// function checkKeyReleased(id) {
//     if (idToKeyMap.has(id)) {
//         keyStates[idToKeyMap.get(id)] = KeyStates.NONE;
//         idToKeyMap.delete(id);
//     }
// }



// var notes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1",
//              "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2",
//              "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3",
//              "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4",
//              "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5",
//              "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6",
//              "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7",
//              "A7", "A#7", "B7", "C8"];


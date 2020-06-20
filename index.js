const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

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

const white_key_count = 52;
const black_key_count = 36;

const white_key_width = ((1.0 - (-1.0)) / white_key_count);
const white_key_height = 0.2;
const white_to_black_width_ratio = 0.6;
const white_to_black_height_ratio = 0.65;

var white_key_vertices = [];
var white_key_colors = [];
var white_key_indices = [];

var white_key_outline_colors = [];
var white_key_outline_indices = [];

var black_key_vertices = [];
var black_key_colors = [];
var black_key_indices = [];

for (var key = 0; key < white_key_count; key++)
{
    const start_x = (-1.0 + (key * white_key_width));
    const start_y = -1.0;
    const end_x = (-1.0 + ((key + 1) * white_key_width));
    const end_y = (-1.0 + white_key_height);
    const index_start = (white_key_vertices.length / 2);

    white_key_vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
    white_key_colors.push(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
    white_key_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));

    white_key_outline_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    white_key_outline_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 3));
}

const black_key_offsets = [0.6, 1.2, 0.5, 0.5, 1.2];
const black_key_width = (white_key_width * white_to_black_width_ratio);
const black_key_height = (white_key_height * white_to_black_height_ratio);

var black_key_offset = (black_key_width / 2 + 0.5 * white_key_width);

for (var key = 0; key < 36; key++) {
    const start_x = (-1.0 + black_key_offset);
    const start_y = (-1.0 + white_key_height - black_key_height);
    const end_x = (-1.0 + black_key_offset + black_key_width);
    const end_y = (-1.0 + white_key_height);
    const index_start = (black_key_vertices.length / 2);

    black_key_vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
    black_key_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    black_key_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));
    
    black_key_offset += ((black_key_offsets[(key + 4) % 5] * white_key_width) + black_key_width);
}

var white_key_vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, white_key_vb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var white_key_cb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_colors), gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var white_key_ib = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_ib);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(white_key_indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

var white_key_outline_cb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, white_key_outline_cb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_outline_colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var white_key_outline_ib = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_outline_ib);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(white_key_outline_indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

var black_key_vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, black_key_vb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var black_key_cb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_colors), gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var black_key_ib = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_ib);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(black_key_indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

var vs_src =
   //'uniform mat4 rotation;' +
   'attribute vec2 position;' +
   'attribute vec3 color;' +
   'varying vec3 vColor;' +
   'void main(void) {' +
      'gl_Position = vec4(position, 0.0, 1.0);' +
      'vColor = color;' +
   '}';
   
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vs_src);
gl.compileShader(vs);

var fs_src =
   'precision lowp float;' +
   'varying vec3 vColor;' +
   'void main(void) {' +
      ' gl_FragColor = vec4(vColor, 1);' +
   '}';

var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fs_src);
gl.compileShader(fs);

var program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

var position = gl.getAttribLocation(program, "position");
var color = gl.getAttribLocation(program, "color");

const KeyStates = {
    NONE : 0,
    PRESSED : 1,
    SONG : 2
}

var keyStates = [];

const gradient = [
    0.2, 1.0, 1.0, 0.2
]

function updateKeys() {
    for (var key = 0; key < (white_key_count + black_key_count); key++) {
        keyStates[key] = KeyStates.NONE;//Math.floor(Math.random() * 2.99);
    }    
}

function updateColors() {
    for (var key = 0; key < white_key_count; key++) {
        var state = keyStates[key];
        var primaryColor = [];

        switch (state) {
            case KeyStates.NONE: {
                primaryColor.push(1, 1, 1);
                break;
            }

            case KeyStates.PRESSED: {
                primaryColor.push(1, 0, 0);
                break;
            }

            case KeyStates.SONG: {
                primaryColor.push(0, 1, 0);
                break;
            }
        }

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                white_key_colors[(key * 4 * 3) + (i * 3) + j] = (primaryColor[j] * gradient[i]);
            }
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

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

updateKeys();
requestAnimationFrame(drawScene);

function drawScene(time) {
    resize(gl);
    updateColors();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_vb);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_ib);
    gl.drawElements(gl.TRIANGLES, white_key_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_outline_cb);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_outline_ib);
    gl.drawElements(gl.LINES, white_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_vb);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_ib);
    gl.drawElements(gl.TRIANGLES, black_key_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    requestAnimationFrame(drawScene);
}

/*
// midi functions
function onMIDISuccess(midiAccess) {
    document.getElementById('supported').innerHTML = 'WebMIDI is supported';
    
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    document.getElementById('message').innerHTML = 'Found ' + inputs.size + ' inputs and ' + outputs.size + ' outputs.';

    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure(e) {
    document.getElementById('supported').innerHTML = 'WebMIDI is not supported';
}

function onMIDIMessage(midiMessage) {
    var command = midiMessage.data[0];
    var note = midiMessage.data[1];
    var velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                noteOn(note, velocity);
            } else {
                noteOff(note);
            }
            break;
        case 128: // noteOff
            noteOff(note);
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}

let notes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1",
             "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2",
             "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3",
             "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4",
             "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5",
             "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6",
             "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7",
             "A7", "A#7", "B7", "C8"];

let onNotes = [];

onNotes.fill(false, 0, 88);

function noteOn(note, velocity) {
    document.getElementById('message').innerHTML = 'noteOn: ' + notes[note - 21]

    onNotes[note - 21] = true;
}

function noteOff(note) {
    document.getElementById('message').innerHTML = 'noteOff: ' + notes[note - 21];
    
    onNotes[note - 21] = false;
}*/


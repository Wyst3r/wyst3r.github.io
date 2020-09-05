const canvas = document.getElementById("canvas");
const overlay = document.getElementById("overlay");
const gl = canvas.getContext("webgl");
const ctx = overlay.getContext("2d");

if (gl === null) {
    alert("No WebGL support in your browser");
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No WebMIDI support in your browser.");
}

document.getElementById("file").addEventListener("change", onFileChanged, false);

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

var black_key_outline_colors = [];
var black_key_outline_indices = [];

const white_keys = [
    0,2,3,5,7,8,10,12,14,15,17,19,20,22,24,26,27,29,31,32,34,36,38,39,41,43,44,46,48,50,51,53,55,56,58,60,62,63,65,67,68,70,72,74,75,77,79,80,82,84,86,87
]
const black_keys = [
    1,4,6,9,11,13,16,18,21,23,25,28,30,33,35,37,40,42,45,47,49,52,54,57,59,61,64,66,69,71,73,76,78,81,83,85
]

key_start_x = new Array(88);
key_end_x = new Array(88);

for (var key = 0; key < white_key_count; key++)
{
    const start_x = (-1.0 + (key * white_key_width));
    const start_y = -1.0;
    const end_x = (-1.0 + ((key + 1) * white_key_width));
    const end_y = (-1.0 + white_key_height);
    const index_start = (white_key_vertices.length / 2);

    createRectangle(white_key_vertices, white_key_colors, white_key_indices, start_x, start_y, end_x, end_y, 1.0, 1.0, 1.0, 1.0);

    white_key_outline_colors.push(0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    white_key_outline_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 3));

    key_start_x[white_keys[key]] = start_x;
    key_end_x[white_keys[key]] = end_x;
}

const black_key_offsets = [0.6, 1.2, 0.5, 0.5, 1.2];
const black_key_width = (white_key_width * white_to_black_width_ratio);
const black_key_height = (white_key_height * white_to_black_height_ratio);

var black_key_start_offset = (black_key_width / 2 + 0.5 * white_key_width);
var black_key_offset = black_key_start_offset;

for (var key = 0; key < 36; key++) {
    const start_x = (-1.0 + black_key_offset);
    const start_y = (-1.0 + white_key_height - black_key_height);
    const end_x = (-1.0 + black_key_offset + black_key_width);
    const end_y = (-1.0 + white_key_height);
    const index_start = (black_key_vertices.length / 2);
    
    createRectangle(black_key_vertices, black_key_colors, black_key_indices, start_x, start_y, end_x, end_y, 0.0, 0.0, 0.0, 1.0);
    
    black_key_outline_colors.push(0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    black_key_outline_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 3));
    
    black_key_offset += ((black_key_offsets[(key + 4) % 5] * white_key_width) + black_key_width);
    
    key_start_x[black_keys[key]] = start_x;
    key_end_x[black_keys[key]] = end_x;
}

var octave_r = 0.3;
var octave_g = 0.3;
var octave_b = 0.3;
var octave_a = 1.0;

var octaves_vertices = [];
var octaves_colors = [];

for (var i = 0; i < 8; i++) {
    var start_x = (-1.0 + ((2 + (i * 7)) * white_key_width));
    var start_y = (-1.0 + white_key_height);
    var end_x = start_x;
    var end_y = 1.0;

    octaves_vertices.push(start_x, start_y, end_x, end_y);
    octaves_colors.push(octave_r, octave_g, octave_b, octave_a, octave_r, octave_g, octave_b, octave_a);
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

var black_key_outline_cb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, black_key_outline_cb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_outline_colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var black_key_outline_ib = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_outline_ib);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(black_key_outline_indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

var octaves_vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, octaves_vb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(octaves_vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var octaves_cb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, octaves_cb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(octaves_colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var measures_vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, measures_vb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(measures_vertices), gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var measures_cb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, measures_cb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(measures_colors), gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const texture_vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1,  1, -1,  1, 1, -1, 1,  1,]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var notes_vb = gl.createBuffer();
var notes_cb = gl.createBuffer();
var notes_ib = gl.createBuffer();

var timeline_vb = gl.createBuffer();
var timeline_cb = gl.createBuffer();
var timeline_ib = gl.createBuffer();

var default_vs_src =
   'attribute vec2 position;' +
   'attribute vec4 color;' +
   'varying vec4 vColor;' +
   'void main(void) {' +
        'gl_Position = vec4(position, 0.0, 1.0);' +
        'vColor = color;' +
   '}';

var default_fs_src =
   'precision lowp float;' +
   'varying vec4 vColor;' +
   'void main(void) {' +
        'gl_FragColor = vColor;' +
   '}';

var default_program = createProgram(default_vs_src, default_fs_src);
var default_position = gl.getAttribLocation(default_program, "position");
var default_color = gl.getAttribLocation(default_program, "color");

var key_count = (white_key_count + black_key_count);

class Keyboard {
    constructor() {
        this.keys = new Array(key_count).fill();
        this.clear();
    }

    press(key) {
        this.keys[key].pressed = true;
    }

    release(key) {
        this.keys[key].pressed = false;
    }

    get(key) {
        return this.keys[key].pressed;
    }

    clear() {
        for (var i = 0; i < this.keys.length; i++) {
            this.keys[i] = {pressed: false};
        }
    }
}

var songKeyboard = new Keyboard();
var pianoKeyboard = new Keyboard();
var mouseKeyboard = new Keyboard();

const gradient = [
    0.2, 1.0, 1.0, 0.2
]

function updateKeys() {
    for (var key = 0; key < white_key_count; key++) {
        var index = white_keys[key];
        var pressed = (songKeyboard.get(index) || pianoKeyboard.get(index) || mouseKeyboard.get(index));
        var primaryColor = [];

        if (pressed) {
            primaryColor.push(notes_color.r, notes_color.g, notes_color.b);
        } else {
            primaryColor.push(1, 1, 1);
        }

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                white_key_colors[(key * 4 * 4) + (i * 4) + j] = (primaryColor[j] * gradient[i]);
            }
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(white_key_colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    for (var key = 0; key < black_key_count; key++) {
        var index = black_keys[key];
        var pressed = (songKeyboard.get(index) || pianoKeyboard.get(index) || mouseKeyboard.get(index));
        var primaryColor = [];

        if (pressed) {
            primaryColor.push(notes_color.r, notes_color.g, notes_color.b);
        } else {
            primaryColor.push(0, 0, 0);
        }

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                black_key_colors[(key * 4 * 4) + (i * 4) + j] = (primaryColor[j] * gradient[i]);
            }
        }
    }    

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

var aspectRatio = (gl.canvas.width / gl.canvas.height);

function resize(gl) {
    var devicePixelRatio = window.devicePixelRatio;
  
    var displayWidth  = Math.floor(gl.canvas.clientWidth  * devicePixelRatio);
    var displayHeight = Math.floor(gl.canvas.clientHeight * devicePixelRatio);
  
    if ((gl.canvas.width  !== displayWidth) ||
        (gl.canvas.height !== displayHeight)) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
        ctx.canvas.width = displayWidth;
        ctx.canvas.height = displayHeight;
        
        aspectRatio = (gl.canvas.width / gl.canvas.height);

        gl.deleteTexture(notes_tex);
        gl.deleteTexture(final_tex);
        gl.deleteTexture(read_tex);
        gl.deleteTexture(write_tex);
        gl.deleteFramebuffer(notes_fb);
        gl.deleteFramebuffer(final_fb);
        gl.deleteFramebuffer(read_fb);
        gl.deleteFramebuffer(write_fb);

        notes_tex = createTexture(displayWidth, displayHeight);
        notes_fb = createFramebuffer(notes_tex);

        final_tex = createTexture(displayWidth, displayHeight);
        final_fb = createFramebuffer(final_tex);

        read_tex = createTexture(displayWidth, displayHeight);
        read_fb = createFramebuffer(read_tex);

        write_tex = createTexture(displayWidth, displayHeight);
        write_fb = createFramebuffer(write_tex);
    }
}

var info = '';
var inputs = [];
var outputs = [];

function updateInfo() {
    var inputsList = document.getElementById('inputs');
    var outputsList = document.getElementById('outputs');

    if (inputs.length > 0) {
        for (var input of inputs) {
            var div = document.createElement('div');
            div.style.color = "gray";
            var text = document.createTextNode(input.name);
            div.appendChild(text);
            inputsList.appendChild(div);
        }
    }
    else {
        var div = document.createElement('div');
        div.style.color = "gray";
        var text = document.createTextNode('None');
        div.appendChild(text);
        inputsList.appendChild(div);
    }


    if (outputs.length > 0) {
        for (var output of outputs) {
            var div = document.createElement('div');
            div.style.color = "gray";
            var text = document.createTextNode(output.name);
            div.appendChild(text);
            outputsList.appendChild(div);
        }
    }
    else {
       var div = document.createElement('div');
       div.style.color = "gray";
       var text = document.createTextNode('None');
       div.appendChild(text);
       outputsList.appendChild(div);
    }
}

function createTexture(width, height) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

function createFramebuffer(texture) {
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return framebuffer;
}

var notes_tex = null;
var final_tex = null;
var read_tex = null;
var write_tex = null;
var read_fb = null;
var write_fb = null;
var notes_fb = null;
var final_fb = null;

function createVertexShader(source) {
    var shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var log = gl.getShaderInfoLog(shader);
    if (log.length > 0) {
        alert('Failed to compile vertex shader:\n' + log);
    }
    return shader;
}

function createFragmentShader(source) {
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var log = gl.getShaderInfoLog(shader);
    if (log.length > 0) {
        alert('Failed to compile fragment shader:\n' + log);
    }
    return shader;
}

function createProgram(vs_src, fs_src) {
    var vertex_shader = createVertexShader(vs_src);
    var fragment_shader = createFragmentShader(fs_src);
    var program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    return program;
}

var texture_vs_src =
   'attribute vec2 position;' +
   'varying vec2 vTexcoord;' +
   'void main(void) {' +
        'gl_Position = vec4(position, 0.0, 1.0);' +
        'vTexcoord = ((position * 0.5) + 0.5);' +
   '}';

var texture_fs_src =
   'precision mediump float;' +
   'varying vec2 vTexcoord;' +
   'uniform sampler2D texture;' +
   'uniform vec2 resolution;' +
   'void main(void) {' +
        'gl_FragColor = vec4(texture2D(texture, vTexcoord).rgb * smoothstep(90.0, 400.0, (resolution.y * (1.0 - vTexcoord.y))), 1.0);' +
   '}';


var texture_program = createProgram(texture_vs_src, texture_fs_src);
var texture_position = gl.getAttribLocation(texture_program, "position");
var texture_texture = gl.getUniformLocation(texture_program, "texture");
var texture_resolution = gl.getUniformLocation(texture_program, "resolution");

// var blur_fs_src = 
//     'precision lowp float;' +
//     'precision lowp int;' +
//     'varying vec2 vTexcoord;' +
//     'uniform sampler2D texture;' +
//     'uniform vec2 resolution;' +
//     'uniform vec2 direction;' +
//     'uniform float weights[5];' +
//     'void main(void) {' +
//         'vec2 step = (1.0 / resolution);' +
//         'vec3 color = (texture2D(texture, vTexcoord).rgb * weights[0]);' +
//         'for (int i = 1; i < 5; i++) {' +
//             'color += (texture2D(texture, (vTexcoord + (direction * step * float(i)))).rgb * weights[i]);' +
//             'color += (texture2D(texture, (vTexcoord - (direction * step * float(i)))).rgb * weights[i]);' +
//         '}' +
//         'gl_FragColor = vec4(color, 1.0);' +
//     '}';

var blur_fs_src = 
    'precision mediump float;' +
    'varying vec2 vTexcoord;' +
    'uniform sampler2D texture;' +
    'uniform vec2 resolution;' +
    'uniform vec2 direction;' +
    'uniform float weights[11];' +
    'uniform float Z;' +
    'void main(void) {' +
        'vec3 final_colour = vec3(0.0);' +        
        'for (int i=-5; i <= 5; ++i) {' +
            'for (int j=-5; j <= 5; ++j) {' +
                'final_colour += weights[5+j]*weights[5+i]*texture2D(texture, vTexcoord + (vec2(float(i),float(j)) / resolution)).rgb;' + 
            '}' +
        '}' +        
        'gl_FragColor = vec4(final_colour/(Z*Z), 1.0);' +
    '}';

var blur_program = createProgram(texture_vs_src, blur_fs_src);
var blur_position = gl.getAttribLocation(blur_program, "position");
var blur_texture = gl.getUniformLocation(blur_program, "texture");
var blur_resolution = gl.getUniformLocation(blur_program, "resolution");
var blur_direction = gl.getUniformLocation(blur_program, "direction");
var blur_weights = gl.getUniformLocation(blur_program, "weights");
var blur_Z = gl.getUniformLocation(blur_program, "Z");

var mix_fs_src =
   'precision lowp float;' +
   'varying vec2 vTexcoord;' +
   'uniform sampler2D texture0;' +
   'uniform sampler2D texture1;' +
   'void main(void) {' +
        'float gamma = 1.5;' +
        'float exposure = 1.0;' +
        'vec3 color1 = texture2D(texture0, vTexcoord).rgb;' +
        'vec3 color2 = texture2D(texture1, vTexcoord).rgb;' +
        'vec3 result = (color1 + color2);' +
        'result = vec3(pow(result.r, (1.0 / gamma)), pow(result.g, (1.0 / gamma)), pow(result.b, (1.0 / gamma)));' +
        'if (length(color1) > 0.0) {' +
            'result = vec3(clamp(result.r, 0.0, color1.r), clamp(result.g, 0.0, color1.g), clamp(result.b, 0.0, color1.b));' +
        '}' +
        //'result = vec3((1.0 - exp(-result.r * exposure)), (1.0 - exp(-result.g * exposure)), (1.0 - exp(-result.b * exposure)));' +
        'result *= max(1.0 - (0.4 * smoothstep(0.6, 0.8, vTexcoord.y)) - smoothstep(0.8, 0.975, vTexcoord.y), 0.0);' + 
        'gl_FragColor = vec4(result, 1.0);' +
   '}';

var mix_program = createProgram(texture_vs_src, mix_fs_src);
var mix_position = gl.getAttribLocation(mix_program, "position");
var mix_texture0 = gl.getUniformLocation(mix_program, "texture0");
var mix_texture1 = gl.getUniformLocation(mix_program, "texture1");

function swapBuffers() {
    var temp_fb = read_fb;
    read_fb = write_fb;
    write_fb = temp_fb;
    var temp_tex = read_tex;
    read_tex = write_tex;
    write_tex = temp_tex;
}

class MovingAverage {
    constructor(period) {
        this.period = period;
        this.samples = [];
    }

    add(sample) {
        this.samples.push(sample);
        if (this.samples.length > this.period) {
            this.samples.splice(0, 1);
        }
    }

    get() {
        var sum = 0.0;
        for (var sample of this.samples) {
            sum += sample;
        }
        return (sum / this.samples.length);
    }
};

var framerate_average = new MovingAverage(60);

function updateFramerate() {
    document.getElementById('framerate').innerText = Math.round(framerate_average.get());
}

setInterval(updateFramerate, 1000);

requestAnimationFrame(onDraw);

var previous_time = 0.0;

function onDraw(current_time) {
    var delta_time = (current_time - previous_time);
    framerate_average.add(1000.0 / delta_time);

    if (isPlaying) {
        var previous_tick = current_tick;
        current_tick = getTick(current_time);
        if (loop_end != null) {
            if ((previous_tick <= loop_end) && (current_tick > loop_end)) {
                pause();
                seek(loop_start);
                synchronize();
            }
        }
        if (current_tick >= song_length) {
            pause();
        }
    }

    resize(gl);

    updateTimeline();
    updateMeasures();
    updateNotes();
    updateKeys();
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindFramebuffer(gl.FRAMEBUFFER, notes_fb);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, octaves_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, octaves_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.drawArrays(gl.LINES, 0, (octaves_vertices.length / 2));

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, measures_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, measures_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.drawArrays(gl.LINES, 0, (measures_vertices.length / 2));

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, notes_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, notes_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, notes_ib);
    gl.drawElements(gl.TRIANGLES, notes_indices.length, gl.UNSIGNED_SHORT, 0);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, write_fb);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.useProgram(blur_program);
    // gl.uniform1i(blur_texture, 0);
    // gl.uniform2f(blur_resolution, gl.canvas.width, gl.canvas.height);
    // gl.uniform2f(blur_direction, 1.0, 0.0);
    // gl.uniform1f(blur_Z, Z);
    // gl.uniform1fv(blur_weights, weights);//new Float32Array([0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216]));
    // gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    // gl.vertexAttribPointer(blur_position, 2, gl.FLOAT, true, 0, 0);
    // gl.enableVertexAttribArray(blur_position);
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, notes_tex);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
    
    // swapBuffers();

    // gl.bindFramebuffer(gl.FRAMEBUFFER, write_fb);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.useProgram(blur_program);
    // gl.uniform1i(blur_texture, 0);
    // gl.uniform2f(blur_resolution, gl.canvas.width, gl.canvas.height);
    // gl.uniform2f(blur_direction, 0.0, 1.0);
    // gl.uniform1fv(blur_weights, new Float32Array([0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216]));
    // gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    // gl.vertexAttribPointer(blur_position, 2, gl.FLOAT, true, 0, 0);
    // gl.enableVertexAttribArray(blur_position);
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, read_tex);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);

    // for (var i = 0; i < 5; i++) {
    //     swapBuffers();

    //     gl.bindFramebuffer(gl.FRAMEBUFFER, write_fb);
    //     gl.clear(gl.COLOR_BUFFER_BIT);

    //     gl.useProgram(blur_program);
    //     gl.uniform1i(blur_texture, 0);
    //     gl.uniform2f(blur_resolution, gl.canvas.width, gl.canvas.height);
    //     gl.uniform2f(blur_direction, 1.0, 0.0);
    //     gl.uniform1fv(blur_weights, new Float32Array([0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216]));
    //     gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    //     gl.vertexAttribPointer(blur_position, 2, gl.FLOAT, true, 0, 0);
    //     gl.enableVertexAttribArray(blur_position);
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, read_tex);
    //     gl.drawArrays(gl.TRIANGLES, 0, 6);
        
    //     swapBuffers();

    //     gl.bindFramebuffer(gl.FRAMEBUFFER, write_fb);
    //     gl.clear(gl.COLOR_BUFFER_BIT);

    //     gl.useProgram(blur_program);
    //     gl.uniform1i(blur_texture, 0);
    //     gl.uniform2f(blur_resolution, gl.canvas.width, gl.canvas.height);
    //     gl.uniform2f(blur_direction, 0.0, 1.0);
    //     gl.uniform1fv(blur_weights, new Float32Array([0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216]));
    //     gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    //     gl.vertexAttribPointer(blur_position, 2, gl.FLOAT, true, 0, 0);
    //     gl.enableVertexAttribArray(blur_position);
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, read_tex);
    //     gl.drawArrays(gl.TRIANGLES, 0, 6);
    // }

    // swapBuffers();

    // gl.bindFramebuffer(gl.FRAMEBUFFER, final_fb);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.useProgram(mix_program);
    // gl.uniform1i(mix_texture0, 0);
    // gl.uniform1i(mix_texture1, 1);
    // gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    // gl.vertexAttribPointer(mix_position, 2, gl.FLOAT, true, 0, 0);
    // gl.enableVertexAttribArray(mix_position);
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, notes_tex);
    // gl.activeTexture(gl.TEXTURE1);
    // gl.bindTexture(gl.TEXTURE_2D, read_tex);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);

    // swapBuffers();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(texture_program);
    gl.uniform1i(texture_texture, 0);
    gl.uniform2f(texture_resolution, (gl.canvas.width / window.devicePixelRatio), (gl.canvas.height / window.devicePixelRatio));
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    gl.vertexAttribPointer(texture_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(texture_position);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, notes_tex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, timeline_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, timeline_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, timeline_ib);
    gl.drawElements(gl.TRIANGLES, timeline_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_ib);
    gl.drawElements(gl.TRIANGLES, white_key_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_outline_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_outline_ib);
    gl.drawElements(gl.LINES, white_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_ib);
    gl.drawElements(gl.TRIANGLES, black_key_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_outline_cb);
    gl.vertexAttribPointer(default_color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_outline_ib);
    gl.drawElements(gl.LINES, black_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = (particles.length - 1); i >= 0; i--) {
        var particle = particles[i];
        particle.tick(delta_time);
        if (particle.dead()) {
            particles.splice(i, 1);
        } else {
            particle.draw();
        }
    }
    
    previous_time = current_time;

    requestAnimationFrame(onDraw);
}

class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    add(rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
    }
    
    subtract(rhs) {
        this.x -= rhs.x;
        this.y -= rhs.y;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    scaled(scalar) {
        return new Vector2((this.x * scalar), (this.y * scalar));
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

function accuracy_to_color(accuracy) {
    // if (accuracy > 0.75) {
    //     return new Color(0.0, 1.0, 0.0);
    // } else if (accuracy > 0.50) {
    //     return new Color(0.0, 1.0, 1.0);
    // } else if (accuracy > 0.25) {
    //     return new Color(1.0, 1.0, 0.0);
    // } else if (accuracy > 0.0) {
    //     return new Color(1.0, 0.0, 1.0);
    if (Math.abs(accuracy) > 0.0) {
        return new Color(0.0, 1.0, 0.0);
    } else {
        return new Color(1.0, 0.0, 0.0);
    }
}

function accuracy_to_text(accuracy) {
    if (Math.abs(accuracy > 0.75)) {
        return "Perfect!";
    } else if (accuracy > 0.0) {
        return "Late!";
    } else if (accuracy < 0.0) {
        return "Early!";
    } else {
        return "Miss!";
    }
}

class Particle {
    constructor(position, velocity, acceleration, lifetime) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.lifetime = lifetime;
        this.age = 0;
    }

    dead() {
        return (this.age > this.lifetime);
    }

    tick(delta) {
        this.velocity.add(this.acceleration.scaled(delta / 1000.0));
        this.position.add(this.velocity.scaled(delta / 1000.0));
        this.age += delta;
    }
}

function hsla_to_css(h, s, l, a) {
    return "hsla("+h+","+s+"%,"+l+"%,"+a+")";
}

function rgba_to_css(r, g, b, a) {
    return "rgba("+r+","+g+","+b+","+a+")";
}

class Points extends Particle {
    constructor(position, velocity, acceleration, lifetime, amount) {
        super(position, velocity, acceleration, lifetime);
        this.amount = amount;
    }

    draw() {
        // var hue = this.amount > 75 ? 180 : this.amount > 50 ? 120 : this.amount > 25 ? 60 : 0; //Math.round(120.0 * (this.amount / 100.0));
        // var saturation = 100;
        // var luminence = 50;
        var color = accuracy_to_color(this.amount / 100.0);
        var alpha = (1.0 - (this.age / this.lifetime));
        var text = accuracy_to_text(this.amount / 100.0);
        ctx.font = "20px Times New Roman";
        ctx.textAlign = "center";
        //ctx.textBaseline = "middle";
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba_to_css(0.0, 0.0, 0.0, alpha);
        ctx.fillStyle = rgba_to_css(Math.round(color.r * 255.0), Math.round(color.g * 255.0), Math.round(color.b * 255.0), alpha);//hsla_to_css(hue, saturation, luminence, alpha);
        ctx.strokeText(text, this.position.x, this.position.y);
        ctx.fillText(text, this.position.x, this.position.y);
    }
}

var particles = [];

function onMIDISuccess(access) {
    var iter = access.inputs.values();
    for (var input = iter.next(); !input.done; input = iter.next()) {
        input.value.onmidimessage = onMIDIMessage;
        inputs.push(input.value);
    }

    iter = access.outputs.values();
    for (var output = iter.next(); !output.done; output = iter.next()) {
        outputs.push(output.value);
    }

    updateInfo();
}

function onMIDIFailure(e) {
    alert('MIDI access request failed');
}

function onMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = ((message.data.length > 2) ? message.data[2] : 0);
    var timestamp = message.timeStamp;

    switch (command) {
        case 144:
            if (velocity > 0) {
                onNoteOn(note, velocity, timestamp);
            } else {
                onNoteOff(note, timestamp);
            }
            break;
        case 152:
            if (note == 34) {
                onMetronomeMeasure(timestamp);
            } else if (note == 33) {
                onMetronomeBeat(timestamp);
            }
        case 128:
            onNoteOff(note, timestamp);
            break;
    }
}

var tempo = 0;
var previous_beat_timestamp = null;
var previous_beat_index = null;
var current_streak = 0;

function getTick(current_time) {
    return (current_tick + milliseconds_to_ticks(current_time - previous_time));
}

var notes_timeout = 50; // in milliseconds

// Should we have a notes_sent, notes_played, notes_passed? Should we also have a list of notes played similar to notes_sorted? Turn on/off overlay of played notes? Or switch between song/played notes?
function onNoteOn(note, velocity, timestamp) {
    var key = (note - 21);
    pianoKeyboard.press(key);
    if (isPlaying) {
        var tick = getTick(timestamp);// - millisecondsToTicks(getMetronomeDeviation()));
        if (recording) {
            recording.press(key, velocity, tick);
            for (var i = notes_played; i < notes_song.length; i++) {
                var delta = ticks_to_milliseconds(notes_song.get(i).start - tick); // This is tempo-dependent, convert start to milliseconds instead? Or wait, is it? We started with a timestamp?
                if (delta > notes_timeout) {
                    break;
                } else if (notes_song.get(i).key == key && delta >= -notes_timeout) {
                    var accuracy = (Math.sign(delta) * (1.0 - (Math.abs(delta) / notes_timeout)));
                    var notes = recording.get_notes();
                    notes_song.get(i).accuracy = accuracy;
                    notes.get(notes.length - 1).accuracy = accuracy;       
                }
            }   
        }     
    }
}

function onNoteOff(note, timestamp) {
    var key = (note - 21);
    pianoKeyboard.release(key);
    if (recording) {
        recording.release(key, getTick(timestamp)); // - millisecondsToTicks(getMetronomeDeviation()));
    }
}

function onMetronomeMeasure(timestamp) {
    previous_beat_index = -1;
    onMetronomeBeat(timestamp);
}

function onMetronomeBeat(timestamp) {
    if (previous_beat_timestamp != null) {
        reportTempo(60000.0 / (timestamp - previous_beat_timestamp));
    }

    previous_beat_timestamp = timestamp;

    if (previous_beat_index != null) {
        previous_beat_index++;
        updateSync();
    }
}

var beats_per_measure = 4;

function updateSync() {
    if (isPlaying) {
        document.getElementById('sync').innerText = Math.round(getMetronomeDeviation()) + ' ms';
    } else {
        document.getElementById('sync').innerText = '-';
    }
}

function getMetronomeDeviation() {
    var current_time = window.performance.now();
    var song_tick = getTick(current_time);
    var ticks_since_previous_measure_song = (song_tick - (ticks_per_measure * Math.floor(song_tick / ticks_per_measure)));
    var ticks_since_previous_measure_metronome = ((ticks_per_beat * previous_beat_index) + milliseconds_to_ticks(current_time - previous_beat_timestamp));
    var deviation = (ticks_since_previous_measure_song - ticks_since_previous_measure_metronome);
    if (deviation > (ticks_per_measure / 2)) {
        deviation = (-ticks_per_measure + deviation);
    } else if (deviation < -(ticks_per_measure / 2)) {
        deviation = (ticks_per_measure + deviation);
    }
    return ticks_to_milliseconds(deviation);
}

var play_timeout_id = null;

function synchronize() {
    if (previous_beat_index == null) {
        return;
    }    
    showLoadingScreen('Synchronizing...');
    var timeout = getMetronomeDeviation();
    if (timeout < 0) {
        timeout = (ticks_to_milliseconds(ticks_per_measure) + timeout);
    }
    play_timeout_id = setTimeout(play, timeout);
}

var tempo_average = new MovingAverage(4);

function updateTempo(new_tempo) {
    tempo = new_tempo;

    if (song_tempo == 0 || tempo == song_tempo) {
        document.getElementById('tempo').innerText = tempo + (tempo_stable ? '' : '?');
    } else if (tempo < song_tempo) {
        document.getElementById('tempo').innerText = tempo + (tempo_stable ? '' : '?') + ' (-' + (song_tempo - tempo) + ')';
    } else {
        document.getElementById('tempo').innerText = tempo + (tempo_stable ? '' : '?') + ' (+' + (tempo - song_tempo) + ')';
    }
}

var tempo_stable = true;
var tempo_stable_count = 0;

function reportTempo(new_tempo) {
    tempo_average.add(new_tempo);
    new_tempo = Math.round(tempo_average.get());
    if (new_tempo != tempo) {
        if (tempo_stable) {
            tempo_stable = false;
            forcePause();
            showLoadingScreen('Detecting tempo...');
        }
        tempo_stable_count = 0;
        updateTempo(new_tempo);
    } else if (!tempo_stable) {
        tempo_stable_count++;
        if (tempo_stable_count >= 3) {
            tempo_stable = true;
            updateTempo(tempo);
            hideLoadingScreen();
            unforcePause();
        }
    }
}

function updateOffset() {
    offset = (window.performance.now() - ticks_to_milliseconds(current_tick));
}

overlay.addEventListener('mousedown', onMouseDown);
overlay.addEventListener('mousemove', onMouseMove);
overlay.addEventListener('mouseup', onMouseUp);
overlay.addEventListener('mouseleave', onMouseLeave);
overlay.addEventListener('touchstart', onTouchStart);
overlay.addEventListener('touchend', onTouchEnd);
overlay.addEventListener('touchmove', onTouchMove);
overlay.addEventListener('touchcancel', onTouchCancel);

var isMouseDown = false;

function onMouseDown(event) {
    checkTimelinePressed('mouse', event);
    checkKeyPressed('mouse', event);
    isMouseDown = true;
}

function onMouseMove(event) {
    if (isMouseDown) {
        checkTimelineDragged('mouse', event);
        checkKeyPressed('mouse', event);
    }
}

function onMouseUp(event) {
    isMouseDown = false;
    checkTimelineReleased('mouse', event);
    checkKeyReleased('mouse');
}

function onMouseLeave(event) {
    onMouseUp(event);
}

var currentTouches = new Map();

function onTouchStart(event) {
    event.preventDefault();    
    for (var touch of event.changedTouches) {
        checkTimelinePressed(touch.identifier, touch);
        checkKeyPressed(touch.identifier, touch);
        currentTouches.set(touch.identifier, touch);
    }
}

function onTouchEnd(event) {
    event.preventDefault();
    for (var touch of event.changedTouches) {
        if (currentTouches.has(touch.identifier)) {
            checkTimelineReleased(touch.identifier, touch);
            checkKeyReleased(touch.identifier);
            currentTouches.delete(touch.identifier);
        }
    }
}

function onTouchMove(event) {
    event.preventDefault();
    for (var touch of event.changedTouches) {
        if (currentTouches.has(touch.identifier)) {
            checkTimelineDragged(touch.identifier, touch);
            checkKeyPressed(touch.identifier, touch);
        }
    }
}

function onTouchCancel(event) {
    onTouchEnd(event);
}

function onLoop() {
    if (loop_start == null) {
        loop_start = thumb_to_tick(timeline_thumb_x);
    } else if (loop_end == null) {
        loop_end = thumb_to_tick(timeline_thumb_x);
        if (loop_end == loop_start) {
            loop_start = null;
            loop_end = null;
        } else if (loop_end < loop_start) {
            [loop_start, loop_end] = [loop_end, loop_start];
        }
    } else {
        loop_start = null;
        loop_end = null;
    }
}

var timeline_captured_id = null;
var timeline_leeway = 2.0;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function tick_to_thumb(tick) {
    return (timeline_start_x + (clamp((tick / song_length), 0.0, 1.0) * timeline_length));
}

function thumb_to_tick(thumb) {
    return (clamp(((thumb - timeline_start_x) / timeline_length), 0.0, 1.0) * song_length);
}

function checkTimelinePressed(id, event) {
    if (song_length == 0) {
        return;
    }

    if (timeline_captured_id && (id != timeline_captured_id)) {
        return;
    }

    var x = (-1.0 + (2.0 * (event.pageX / window.innerWidth)));
    var y = (1.0 - (2.0 * (event.pageY / window.innerHeight)));

    var start_x = timeline_start_x;
    var start_y = (timeline_thumb_y - (timeline_thumb_radius * timeline_leeway));
    var end_x = timeline_end_x;
    var end_y = (timeline_thumb_y + (timeline_thumb_radius * timeline_leeway));
    
    if ((x >= start_x && x <= end_x) &&
        (y >= start_y && y <= end_y)) {
        timeline_captured_id = id;
        forcePause();
        seek(thumb_to_tick(x));
    }
}

function checkTimelineDragged(id, event) {
    if (id != timeline_captured_id) {
        return;
    }

    var x = (-1.0 + (2.0 * (event.pageX / window.innerWidth)));
    var y = (1.0 - (2.0 * (event.pageY / window.innerHeight)));

    seek(thumb_to_tick(x));
}

function checkTimelineReleased(id, event) {
    if (id != timeline_captured_id) {
        return;
    }

    var x = (-1.0 + (2.0 * (event.pageX / window.innerWidth)));
    var y = (1.0 - (2.0 * (event.pageY / window.innerHeight)));

    seek(thumb_to_tick(x));
    unforcePause();
    
    timeline_captured_id = null;
}

var idToKeyMap = new Map();

function checkKeyPressed(id, event) {
    var x = (-1.0 + (2.0 * (event.pageX / window.innerWidth)));
    var y = (1.0 - (2.0 * (event.pageY / window.innerHeight)));

    var pressedKey = null;

    if (y > (-1.0 + white_key_height)) {
        checkKeyReleased(id, event);
        return;
    }

    if (y > (-1.0 + white_key_height - black_key_height)) {
        black_key_offset = black_key_start_offset;

        for (var key = 0; key < black_key_count; key++) {
            var start_x = -1.0 + black_key_offset;
            var end_x = (start_x + black_key_width);

            if (x >= start_x && x <= end_x) {
                pressedKey = black_keys[key];
                break;
            }

            black_key_offset += ((black_key_offsets[(key + 4) % 5] * white_key_width) + black_key_width);
        }
    }

    if (pressedKey == null) {
        pressedKey = white_keys[Math.floor((x - (-1.0)) / white_key_width)];
    }

    if (idToKeyMap.has(id) && (pressedKey == idToKeyMap.get(id))) {
        return;
    }
    
    checkKeyReleased(id);
    mouseKeyboard.press(pressedKey);
    idToKeyMap.set(id, pressedKey);
    send_note_on(pressedKey);
}

function checkKeyReleased(id) {
    if (idToKeyMap.has(id)) {
        var key = idToKeyMap.get(id);
        mouseKeyboard.release(key);
        idToKeyMap.delete(id);
        send_note_off(key);
    }
}

function send_note_on(key, velocity = 0x3F, timestamp = window.performance.now()) {   
    for (var output of outputs) {         
        output.send([0x90, (key + 21), velocity], timestamp);
    }
}

function send_note_off(key, timestamp = window.performance.now()) {    
    for (var output of outputs) {
        output.send([0x80, (key + 21), 0], timestamp);
    }
}

const Origin = {
    BEGINNING: 0,
    CURRENT: 1,
    END: 2
};

const Direction = {
    FORWARD: 0,
    BACKWARD: 1
};

class Notes{
    constructor(notes) {
        this.notes = notes;
        this.index = 0;
        this.interval = 50; // ms
        this.id = null;
        this.muted = false;
    }

    get length() {
        return this.notes.length;
    }

    get(index) {
        return this.notes[index];
    }

    empty() {
        return (this.length == 0);
    }

    mute() {
        this.muted = true;
    }

    unmute() {
        this.muted = false;
    }

    play() {
        if (this.empty()) {
            return;
        }
        this.stop();
        var self = this;
        this.id = setInterval(function() {self.send()}, this.interval);
    }

    stop() {
        if (this.id) {
            clearInterval(this.id);
            this.id = null;
        }
    }

    send() {
        var end_tick = (current_tick + milliseconds_to_ticks(2 * this.interval));
        for (; this.index < this.length; this.index++) {
            if (this.index < 0) {
                continue;
            }
            var note = this.notes[this.index];
            if (note.start > end_tick) {
                break;
            }
            if (!this.muted) {
                var note_start_ms = (ticks_to_milliseconds(note.start) + offset);
                var note_end_ms = (ticks_to_milliseconds(note.end) + offset);                
                send_note_on(note.key, note.velocity, note_start_ms);
                send_note_off(note.key, note_end_ms);
            }
        }
    }

    seek(tick, origin, direction) {
        if (this.empty()) {
            return;
        }
        if (origin == Origin.BEGINNING) {
            this.index = 0;
        } else if (origin == Origin.END) {
            this.index = (this.length - 1);
        }
        if (direction == Direction.FORWARD) {
            for (; this.index < this.length; this.index++) {
                if (this.index < 0) {
                    continue;
                }
                if (this.notes[this.index].start >= tick) {
                    break;
                }
            }
        } else {
            for (; this.index >= 0; this.index--) {
                if (this.index >= this.length) {
                    continue;
                }
                if (this.notes[this.index].start <= tick) {
                    this.index++;
                    break;
                }
            }
        }
    }
}

var notes_played = 0;

function onNotePlayed(note) {
    var x = (((((key_start_x[note.key] + key_end_x[note.key]) / 2.0) * 0.5) + 0.5) * ctx.canvas.width);
    var y = ((1.0 - (((-1.0 + white_key_height) * 0.5) + 0.5)) * ctx.canvas.height);

    // Create TextParticle here?
    particles.push(new Points(new Vector2(x, y), new Vector2((Math.random() * 2.0 - 1.0) * 150, -120), new Vector2(0, 200), 1500, Math.round(note.accuracy * 100.0)));    
}

function onCheckNotesMissed() {
    var tick = getTick(window.performance.now());
    for (; notes_played < notes_song.length; notes_played++) {
        var note = notes_song.get(notes_played);
        if (note.accuracy != null) {
            onNoteHit(note);
        } else if (ticks_to_milliseconds(tick - note.start) > notes_timeout) {
            onNoteMiss(note);
        } else {
            break;
        }        
    }
    document.getElementById("streak").innerText = current_streak;
    document.getElementById("score").innerText = score;
}

function onNoteHit(note)
{
    onNotePlayed(note);
    current_streak++;
    score += Math.round(Math.abs(note.accuracy) * 100);
}

function onNoteMiss(note)
{
    onNotePlayed(note);
    current_streak = 0;
    note.accuracy = 0;
}

function seek(tick) {
    if (tick == current_tick) {
        return;
    }
    function seek_internal(tick, origin, direction) {
        notes_song.seek(tick, origin, direction);
        notes_recorded.seek(tick, origin, direction);
    }
    var previous_tick = current_tick;
    current_tick = tick;
    var diff = (current_tick - previous_tick);
    if (diff < 0.0) {
        if (-diff > (current_tick * 0.5)) {
            seek_internal(tick, Origin.BEGINNING, Direction.FORWARD);
        } else {
            seek_internal(tick, Origin.CURRENT, Direction.BACKWARD);
        }
    } else {
        if (diff > ((song_length - previous_tick) * 0.5)) {
            seek_internal(tick, Origin.END, Direction.BACKWARD);
        } else {
            seek_internal(tick, Origin.CURRENT, Direction.FORWARD);
        }
    }    
    notes_played = notes_song.index;
}

function showLoadingScreen(text) {
    document.getElementById('loadingtext').innerText = text;    
    document.getElementById("loadingscreen").style.display = "block";
}

function hideLoadingScreen() {    
    document.getElementById('loadingtext').innerText = '';    
    document.getElementById("loadingscreen").style.display = "none";
}

var forcedPauseCount = 0;
var wasPlaying = false;

function forcePause() {
    if (forcedPauseCount == 0) {
        wasPlaying = isPlaying;
        onPause();
    }
    forcedPauseCount++;
}

function unforcePause() {
    forcedPauseCount--;
    if (forcedPauseCount == 0) {
        if (wasPlaying) {
            onPlay();
        }
    }
}

var isPlaying = false;
var recording = null;
var score = 0;

function onPlay() {
    if (isPlaying || (forcedPauseCount > 0) || (current_tick >= song_length) || (tempo == 0) || (play_timeout_id != null)) {
        return;
    }
    synchronize();
}

var notes_missed_interval = 15;
var notes_missed_interval_id = null;

function play() {
    hideLoadingScreen();
    isPlaying = true;
    score = 0;
    current_streak = 0;
    updateOffset();
    if (replay) {
        notes_recorded.play();
        notes_song.play();
    } else {
        recording = new Recording();
        for (var i = 0; i < notes_song.length; i++) {
            notes_song.get(i).accuracy = null;
        }
        notes_song.play();
        notes_missed_interval_id = setInterval(onCheckNotesMissed, notes_missed_interval)
    }    
    play_timeout_id = null;
}

function onPause() {
    pause();
}

function pause() {
    isPlaying = false;
    if (play_timeout_id != null) {
        clearTimeout(play_timeout_id);
        play_timeout_id = null;
    }
    if (replay) {
        notes_recorded.stop();
        notes_song.stop();
    } else {
        notes_song.stop();
        if (recording) {
            notes_recorded = recording.get_notes();
            recording = null;
        }
        if (notes_missed_interval_id != null) {
            clearInterval(notes_missed_interval_id);
            notes_missed_interval_id = null;
        }
    }
}

function onStop() {
    stop();
}

function stop() {
    pause();
    seek(0);
}

var muted = false;

function onToggleSound() {
    muted = !muted;    
    var src = null;
    if (muted) {
        notes_song.mute();
        src = "./img/soundoff.svg";
    } else {
        notes_song.unmute();
        src = "./img/soundon.svg";
    }
    document.getElementById('soundicon').src = src;
}

var replay = false;

function onToggleReplay() {
    if (isPlaying) {
        return;
    }
    replay = !replay;
}

function onFileChanged() {
    var file = this.files[0];
    document.getElementById('song').innerText = file.name.split('.')[0];
    var reader = new FileReader();
    reader.onloadend = onFileLoaded;
    reader.readAsArrayBuffer(file);
}

function onFileLoaded(event) {
    var data = new Uint8Array(event.target.result);
    var midi = parseMidi(data);
    
    loadMidi(midi);
}

var notes_vertices = [];
var notes_colors = [];
var notes_indices = [];

var ticks_per_beat = 0;
var ticks_per_measure = 0;

function notesLeft(midi, indices) {
    for (var i = 0; i < midi.tracks.length; i++) {
        if (indices[i] < midi.tracks[i].length) {
            return true;
        }
    }

    return false;
}

class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    get start() {
        return this.start;
    }

    get end() {
        return this.end;
    }

    get length() {
        return (this.end - this.start);
    }
}

var song_length = 0;
var song_tempo = 0;
var loop_start = null;
var loop_end = null;

function loadMidi(midi) {
    ticks_per_beat = midi.header.ticksPerBeat;
    ticks_per_measure = (beats_per_measure * ticks_per_beat);
    var times = new Array(midi.tracks.length);
    times.fill(0);
    var indices = new Array(midi.tracks.length);
    indices.fill(0);
    var recording = new Recording(midi.tracks.length);

    song_length = 0;
    song_tempo = 0;
    loop_start = null;
    loop_end = null;

    while (notesLeft(midi, indices)) {
        var nextIndex = 0;
        var nextTime = Number.MAX_SAFE_INTEGER;
        var nextEvent = null;
        for (var i = 0; i < midi.tracks.length; i++) 
        {
            var index = indices[i];
            var track = midi.tracks[i];
            if (index >= track.length) {
                continue;
            }
            var event = track[index];
            var eventTime = (times[i] + event.deltaTime);
            if (eventTime < nextTime) {
                nextTime = eventTime;
                nextIndex = i;
                nextEvent = event;
            }
        }

        times[nextIndex] = nextTime;
        indices[nextIndex]++;

        switch (nextEvent.type) {
            case 'noteOn': {
                recording.press((nextEvent.noteNumber - 21), nextEvent.velocity, nextTime, nextIndex);
                break;
            }

            case 'noteOff': {
                recording.release((nextEvent.noteNumber  - 21), nextTime, nextIndex);
                break;
            }

            case 'setTempo': {
                if (song_tempo == 0) {
                    song_tempo = Math.round(60000000.0 / nextEvent.microsecondsPerBeat);
                    updateTempo(tempo);
                }
            }

            case 'endOfTrack': {
                song_length = Math.max(song_length, nextTime);
            }
        }
    }

    notes_song = recording.get_notes();

    if (muted) {
        notes_song.mute();
    }
}

// CSS pixels
function unitsToPixelsX(units) {
    return (units * (gl.canvas.width / 2.0) * (1.0 / window.devicePixelRatio));
}

function unitsToPixelsY(units) {
    return (units * (gl.canvas.height / 2.0) * (1.0 / window.devicePixelRatio));
}

function pixelsToUnitsX(pixels) {
    return (pixels * window.devicePixelRatio * (2.0 / gl.canvas.width));
}

function pixelsToUnitsY(pixels) {
    return (pixels * window.devicePixelRatio * (2.0 / gl.canvas.height));
}

var timeline_vertices = [];
var timeline_colors = [];
var timeline_indices = [];

var timeline_start_x = null;
var timeline_start_y = null;
var timeline_end_x = null;
var timeline_end_y = null;
var timeline_length = null;

var timeline_thumb_x = null;
var timeline_thumb_y = null;
var timeline_thumb_radius = 0.02;

var timeline_loop_start_x = null;
var timeline_loop_end_x = null;

function updateTimeline() {
    timeline_vertices = [];
    timeline_colors = [];
    timeline_indices = [];

    var percentage = 0.0;

    if (song_length > 0) {
        percentage = Math.min((current_tick / song_length), 1.0);
    }

    timeline_start_x = -0.9;
    timeline_start_y = (1.0 - pixelsToUnitsY(93));
    timeline_end_x = 0.9;
    timeline_end_y = (1.0 - pixelsToUnitsY(90));
    timeline_length = (timeline_end_x - timeline_start_x);
    var radius = ((timeline_end_y - timeline_start_y) / 2.0);
    timeline_thumb_x = (timeline_start_x + (timeline_length * percentage));
    timeline_thumb_y = ((timeline_end_y + timeline_start_y) / 2.0);
    timeline_thumb_radius = pixelsToUnitsY(8);

    createRoundedRectangle(timeline_vertices, timeline_colors, timeline_indices, timeline_start_x, timeline_start_y, timeline_end_x, timeline_end_y, radius, 0.2, 0.2, 0.2, 1.0);
    createRoundedRectangle(timeline_vertices, timeline_colors, timeline_indices, timeline_start_x, timeline_start_y, timeline_thumb_x, timeline_end_y, radius, 1.0, 1.0, 1.0, 1.0);

    var thumb_color = new Color(1.0, 1.0, 1.0);
    if (loop_start != null) {
        var timeline_loop_start_x = tick_to_thumb(loop_start);
        var timeline_loop_end_x = ((loop_end != null) ? tick_to_thumb(loop_end) : timeline_thumb_x);
        if (timeline_loop_end_x < timeline_loop_start_x) {
            [timeline_loop_start_x, timeline_loop_end_x] = [timeline_loop_end_x, timeline_loop_start_x];
        }
        createRoundedRectangle(timeline_vertices, timeline_colors, timeline_indices, timeline_loop_start_x, timeline_start_y, timeline_loop_end_x, timeline_end_y, radius, notes_color.r, notes_color.g, notes_color.b, 1.0);
        if ((timeline_thumb_x >= timeline_loop_start_x) && (timeline_thumb_x <= timeline_loop_end_x)) {
            thumb_color = notes_color;
        }
    }
    createCircle(timeline_vertices, timeline_colors, timeline_indices, timeline_thumb_x, timeline_thumb_y, timeline_thumb_radius, thumb_color.r, thumb_color.g, thumb_color.b, 1.0);   

    gl.bindBuffer(gl.ARRAY_BUFFER, timeline_vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(timeline_vertices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, timeline_cb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(timeline_colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, timeline_ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(timeline_indices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

class Recording {
    constructor(tracks = 1) {
        this.active_notes = new Array(tracks);
        for (var i = 0; i < tracks; i++) {
            this.active_notes[i] = new Map();
        }
        this.notes = [];
    }

    press(key, velocity, timestamp, track = 0) {
        if (this.active_notes[track].has(key) || (velocity == 0)) {
            this.release(key, timestamp);
        } else {
            this.active_notes[track].set(key, this.notes.length);
            this.notes.push({'key': key, 'start': timestamp, 'end': null, 'velocity': velocity, 'accuracy': null});
        }
    }

    release(key, timestamp, track = 0) {
        if (this.active_notes[track].has(key)) {
            this.notes[this.active_notes[track].get(key)].end = timestamp;
            this.active_notes[track].delete(key);
        }
    }

    get_notes() {
        return new Notes(this.notes);
    }
};

var notes_song = new Notes([]);
var notes_recorded = new Notes([]);

var zoom = 1.0; // in measures
var current_tick = 0.0; // in ticks
var offset = 0.0; // in milliseconds

function ticks_to_milliseconds(ticks) {
    return ((60000.0 / (tempo * ticks_per_beat)) * ticks);
} 

function milliseconds_to_ticks(milliseconds) {
    return (milliseconds / (60000.0 / (tempo * ticks_per_beat)));
}

var measure_r = 0.6;
var measure_g = 0.6;
var measure_b = 0.6;
var measure_a = 1.0;

var beat_r = 0.2;
var beat_g = 0.2;
var beat_b = 0.2;
var beat_a = 1.0;

var measures_vertices = [];
var measures_colors = [];

function updateMeasures() {
    measures_vertices = [];
    measures_colors = [];

    var ticks_per_measure = (beats_per_measure * ticks_per_beat);
    var previous_measure_tick = (ticks_per_measure * Math.floor(current_tick / ticks_per_measure));

    var start_tick = current_tick;
    var end_tick = (start_tick + (beats_per_measure * ticks_per_beat * zoom) - 1);
    
    var total_height = (2.0 - white_key_height);
    var total_duration = (end_tick - start_tick);
    var units_per_tick = (total_height / total_duration);

    var beat = 0;

    for (var tick = previous_measure_tick; tick <= end_tick; tick += ticks_per_beat, beat++) {
        if (tick < start_tick) {
            continue;
        }

        var start_x = -1.0;
        var start_y = (-1.0 + white_key_height + (units_per_tick * (tick - start_tick)));
        var end_x = 1.0;
        var end_y = start_y;
    
        measures_vertices.push(start_x, start_y, end_x, end_y);

        if (beat % beats_per_measure == 0) {
            measures_colors.push(measure_r, measure_g, measure_b, measure_a, measure_r, measure_g, measure_b, measure_a);
        } else {
            measures_colors.push(beat_r, beat_g, beat_b, beat_a, beat_r, beat_g, beat_b, beat_a);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, measures_vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(measures_vertices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, measures_cb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(measures_colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

var notes_color = new Color(0.0, 0.0, 0.0);

function onColorChanged(color) {
    notes_color = new Color((color.r / 255.0), (color.g / 255.0), (color.b / 255.0));
}

jscolor.trigger('change');

function updateNotes() {
    notes_vertices = [];
    notes_colors = [];
    notes_indices = [];

    var start_tick = current_tick;
    var end_tick = (start_tick + (beats_per_measure * ticks_per_beat * zoom) - 1);

    songKeyboard.clear();

    var alpha = (document.getElementById("opacityrange").value / 100.0);

    for (var i = 0; i < notes_song.length; i++) {
        var note = notes_song.get(i);
        if (note.start > end_tick) {
            break;
        }
        if (note.end < start_tick) {
            continue;
        }

        if ((note.start <= start_tick) && 
            (note.end >= start_tick)) {
                songKeyboard.press(note.key);
        }

        var start_time = (note.start - start_tick);
        var end_time = (note.end - start_tick);

        var total_height = (2.0 - white_key_height);
        var total_duration = (end_tick - start_tick);
        var units_per_tick = (total_height / total_duration);

        var start_x = key_start_x[note.key];
        var start_y = (-1.0 + white_key_height + (units_per_tick * start_time));
        var end_x = key_end_x[note.key];
        var end_y = (-1.0 + white_key_height + (units_per_tick * end_time));
        var radius = 0.02;
        var color = (replay ? ((note.accuracy != null) ? accuracy_to_color(note.accuracy) : new Color(0.5, 0.5, 0.5)) : notes_color);
        
        createRoundedRectangle(notes_vertices, notes_colors, notes_indices, start_x, start_y, end_x, end_y, radius, color.r, color.g, color.b, 1.0);//, 1.0 - alpha);                
    }

    if (replay) {
        for (var i = 0; i < notes_recorded.length; i++) {
            var note = notes_recorded.get(i);
            if (note.start > end_tick) {
                break;
            }
            if (note.end < start_tick) {
                continue;
            }

            var start_time = (note.start - start_tick);
            var end_time = (note.end - start_tick);

            var total_height = (2.0 - white_key_height);
            var total_duration = (end_tick - start_tick);
            var units_per_tick = (total_height / total_duration);

            var start_x = key_start_x[note.key];
            var start_y = (-1.0 + white_key_height + (units_per_tick * start_time));
            var end_x = key_end_x[note.key];
            var end_y = (-1.0 + white_key_height + (units_per_tick * end_time));
            var radius = 0.02;

            createRoundedRectangle(notes_vertices, notes_colors, notes_indices, start_x, start_y, end_x, end_y, radius, 1.0, 1.0, 1.0, alpha);//note.accuracy ? 0.0 : 1.0, note.accuracy ? 1.0 : 0.0, 0.0, /*0.6*/alpha);
        }
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, notes_vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(notes_vertices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, notes_cb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(notes_colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, notes_ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(notes_indices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function createLine(vertices, colors, indices, start_x, start_y, end_x, end_y, color_r, color_g, color_b, color_a) {
    var index_start = (vertices.length / 2);
    vertices.push(start_x, start_y, end_x, end_y);
    colors.push(color_r, color_g, color_b, color_a, color_r, color_g, color_b, color_a);
    indices.push((index_start + 0), (index_start + 1));
}

function createCircle(vertices, colors, indices, center_x, center_y, radius, color_r, color_g, color_b, color_a) {
    radius_y = radius;
    radius_x = radius_y / aspectRatio;
    var index_start = (vertices.length / 2);
    var divisions = 30;
    vertices.push(center_x, center_y);
    colors.push(color_r, color_g, color_b, color_a);
    var angle = 0.0;
    for (var i = 0; i < divisions; i++) {
        var x = (center_x + (Math.cos(angle) * radius_x));
        var y = (center_y + (Math.sin(angle) * radius_y));
        vertices.push(x, y);
        colors.push(color_r, color_g, color_b, color_a);
        indices.push((index_start + 0), (index_start + i + 1), (index_start + i + 2));
        angle += ((2 * Math.PI) / divisions);
    }
    var x = (center_x + (Math.cos(angle) * radius_x));
    var y = (center_y + (Math.sin(angle) * radius_y));
    vertices.push(x, y);
    colors.push(color_r, color_g, color_b, color_a);
}

function createRectangle(vertices, colors, indices, start_x, start_y, end_x, end_y, color_r, color_g, color_b, color_a) {
    var index_start = (vertices.length / 2);
    vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
    colors.push(color_r, color_g, color_b, color_a, color_r, color_g, color_b, color_a, color_r, color_g, color_b, color_a, color_r, color_g, color_b, color_a);    
    indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));
}

function createRoundedRectangle(vertices, colors, indices, start_x, start_y, end_x, end_y, radius, color_r, color_g, color_b, color_a) {
    var radius_max_x = ((end_x - start_x) / 2.0);
    var radius_max_y = ((end_y - start_y) / 2.0);
    var radius_y = Math.min(radius, radius_max_y);
    var radius_x = Math.min((radius_y / aspectRatio), radius_max_x);
    radius_y = (radius_x * aspectRatio);

    var divisions = 3;
    var vertices_per_corner = (divisions + 2);
    var index_start = (vertices.length / 2);

    center_start_x = (start_x + radius_x);
    center_start_y = (start_y + radius_y);
    center_end_x = (end_x - radius_x);
    center_end_y = (end_y - radius_y);

    var centers_x = [
        center_end_x,
        center_start_x,
        center_start_x,
        center_end_x
    ];

    var centers_y = [
        center_end_y,
        center_end_y,
        center_start_y,
        center_start_y
    ];

    var angle = 0.0;
    for (var i = 0; i < 4; i++) {
        var corner_start = (vertices.length / 2);
        var center_x = centers_x[i];
        var center_y = centers_y[i];
        vertices.push(center_x, center_y);
        colors.push(color_r, color_g, color_b, color_a);
        for (var j = 0; j < divisions; j++) {
            var x = (center_x + (Math.cos(angle) * radius_x));
            var y = (center_y + (Math.sin(angle) * radius_y));
            vertices.push(x, y);
            colors.push(color_r, color_g, color_b, color_a);
            indices.push((corner_start + 0), (corner_start + j + 1), (corner_start + j + 2));
            angle += (Math.PI / 2 / divisions);
        }
        var x = (center_x + (Math.cos(angle) * radius_x));
        var y = (center_y + (Math.sin(angle) * radius_y));
        vertices.push(x, y);
        colors.push(color_r, color_g, color_b, color_a);
    }

    for (var i = 0; i < 4; i++) {
        var index_0 = (index_start + (((i + 0) % 4) * vertices_per_corner) + 0);
        var index_1 = (index_start + ((i + 1) * vertices_per_corner) - 1);
        var index_2 = (index_start + (((i + 1) % 4) * vertices_per_corner) + 1);
        var index_3 = (index_start + (((i + 1) % 4) * vertices_per_corner) + 0);

        indices.push(index_0, index_1, index_2, index_0, index_2, index_3);
    }

    var index_0 = (index_start + (0 * vertices_per_corner));
    var index_1 = (index_start + (1 * vertices_per_corner));
    var index_2 = (index_start + (2 * vertices_per_corner));
    var index_3 = (index_start + (3 * vertices_per_corner));

    indices.push(index_0, index_1, index_2, index_0, index_2, index_3);
}



// var notes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1",
//              "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2",
//              "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3",
//              "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4",
//              "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5",
//              "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6",
//              "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7",
//              "A7", "A#7", "B7", "C8"];


const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

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

    white_key_vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
    white_key_colors.push(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
    white_key_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));

    white_key_outline_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
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

    black_key_vertices.push(start_x, start_y, start_x, end_y, end_x, end_y, end_x, start_y);
    black_key_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    black_key_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 0), (index_start + 2), (index_start + 3));
    
    black_key_outline_colors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    black_key_outline_indices.push((index_start + 0), (index_start + 1), (index_start + 2), (index_start + 3));
    
    black_key_offset += ((black_key_offsets[(key + 4) % 5] * white_key_width) + black_key_width);
    
    key_start_x[black_keys[key]] = start_x;
    key_end_x[black_keys[key]] = end_x;
}

var octave_r = 0.2;
var octave_g = 0.2;
var octave_b = 0.2;

var octaves_vertices = [];
var octaves_colors = [];

for (var i = 0; i < 8; i++) {
    var start_x = (-1.0 + ((2 + (i * 7)) * white_key_width));
    var start_y = (-1.0 + white_key_height);
    var end_x = start_x;
    var end_y = 1.0;

    octaves_vertices.push(start_x, start_y, end_x, end_y);
    octaves_colors.push(octave_r, octave_g, octave_b, octave_r, octave_g, octave_b);
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

const texture_vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1,  1, -1,  1, 1, -1, 1,  1,]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var notes_vb = gl.createBuffer();
var notes_cb = gl.createBuffer();
var notes_ib = gl.createBuffer();

var default_vs_src =
   'attribute vec2 position;' +
   'attribute vec3 color;' +
   'varying vec3 vColor;' +
   'void main(void) {' +
        'gl_Position = vec4(position, 0.0, 1.0);' +
        'vColor = color;' +
   '}';

var default_fs_src =
   'precision lowp float;' +
   'varying vec3 vColor;' +
   'void main(void) {' +
        'gl_FragColor = vec4(vColor, 1);' +
   '}';

var default_program = createProgram(default_vs_src, default_fs_src);
var default_position = gl.getAttribLocation(default_program, "position");
var default_color = gl.getAttribLocation(default_program, "color");

var songKeyPressed = [];
var pianoKeyPressed = [];
var mouseKeyPressed = [];

for (var key = 0; key < (white_key_count + black_key_count); key++) {
    songKeyPressed.push(false);
    pianoKeyPressed.push(false);
    mouseKeyPressed.push(false);
}

const gradient = [
    0.2, 1.0, 1.0, 0.2
]

function updateKeys() {
    for (var key = 0; key < white_key_count; key++) {
        var index = white_keys[key];
        var pressed = (songKeyPressed[index] || pianoKeyPressed[index] || mouseKeyPressed[index]);
        var primaryColor = [];

        if (pressed) {
            primaryColor.push(notes_r, notes_g, notes_b);
        } else {
            primaryColor.push(1, 1, 1);
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

    for (var key = 0; key < black_key_count; key++) {
        var index = black_keys[key];
        var pressed = (songKeyPressed[index] || pianoKeyPressed[index] || mouseKeyPressed[index]);
        var primaryColor = [];

        if (pressed) {
            primaryColor.push(notes_r, notes_g, notes_b);
        } else {
            primaryColor.push(0, 0, 0);
        }

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                black_key_colors[(key * 4 * 3) + (i * 3) + j] = (primaryColor[j] * gradient[i]);
            }
        }
    }    

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(black_key_colors), gl.DYNAMIC_DRAW);
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
            var text = document.createTextNode(input);
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
            var text = document.createTextNode(output);
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
   'precision lowp float;' +
   'varying vec2 vTexcoord;' +
   'uniform sampler2D texture;' +
   'void main(void) {' +
        'gl_FragColor = vec4(texture2D(texture, vTexcoord).rgb * smoothstep(0.92, 0.7, vTexcoord.y), 1.0);' +
   '}';


var texture_program = createProgram(texture_vs_src, texture_fs_src);
var texture_position = gl.getAttribLocation(texture_program, "position");
var texture_texture = gl.getUniformLocation(texture_program, "texture");

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

function normpdf(x, sigma)
{
	return 0.39894*Math.exp(-0.5*x*x/(sigma*sigma))/sigma;
}

var weights = new Float32Array(11);
var Z = 0.0;

for (var j = 0; j <= 5; ++j)
{
    weights[5+j] = weights[5-j] = normpdf(j, 7.0);
}

for (var j = 0; j < 11; ++j)
{
    Z += weights[j];
}

requestAnimationFrame(drawScene);

var previousTime = 0.0;

function drawScene(currentTime) {
    if (isPlaying) {
        time += (currentTime - previousTime);
    }

    resize(gl);
    updateNotes();
    updateKeys();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, notes_fb);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, octaves_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, octaves_cb);
    gl.vertexAttribPointer(default_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.drawArrays(gl.LINES, 0, (octaves_vertices.length / 2));

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, notes_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, notes_cb);
    gl.vertexAttribPointer(default_color, 3, gl.FLOAT, false, 0, 0);
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
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_vb);
    gl.vertexAttribPointer(texture_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(texture_position);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, notes_tex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(default_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_cb);
    gl.vertexAttribPointer(default_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_ib);
    gl.drawElements(gl.TRIANGLES, white_key_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, white_key_outline_cb);
    gl.vertexAttribPointer(default_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, white_key_outline_ib);
    gl.drawElements(gl.LINES, white_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_vb);
    gl.vertexAttribPointer(default_position, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(default_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_cb);
    gl.vertexAttribPointer(default_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_ib);
    gl.drawElements(gl.TRIANGLES, black_key_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, black_key_outline_cb);
    gl.vertexAttribPointer(default_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(default_color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, black_key_outline_ib);
    gl.drawElements(gl.LINES, black_key_outline_indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    previousTime = currentTime;

    requestAnimationFrame(drawScene);
}

function onMIDISuccess(access) {
    var iter = access.inputs.values();
    for (var input = iter.next(); !input.done; input = iter.next()) {
        input.value.onmidimessage = onMIDIMessage;
        inputs.push(input.value.name);
    }

    iter = access.outputs.values();
    for (var output = iter.next(); !output.done; output = iter.next()) {
        outputs.push(output.value.name);
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
    var time = message.timeStamp;

    switch (command) {
        case 144:
            if (velocity > 0) {
                onNoteOn(note, time);
            } else {
                onNoteOff(note, time);
            }
            break;
        case 152:
            if (note == 34) {
                onMetronomeMeasure(time);
            } else if (note == 33) {
                onMetronomeBeat(time);
            }
        case 128:
            onNoteOff(note, time);
            break;
    }
}

var tempo = 60; // TODO: Set to 0
var prev_measure_start = null;

function onNoteOn(note, time) {
    pianoKeyPressed[note - 21] = true;
}

function onNoteOff(note, time) {
    pianoKeyPressed[note - 21] = false;
}

function onMetronomeMeasure(time) {
    if (prev_measure_start != null) {
        tempo = Math.floor((60 * 1000) / ((time - prev_measure_start) / 4));

        document.getElementById('tempo').innerText = tempo;
    }

    prev_measure_start = time;
}

function onMetronomeBeat(time) {

}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mouseleave', onMouseLeave);
canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchmove', onTouchMove);
canvas.addEventListener('touchcancel', onTouchCancel);

var isMouseDown = false;

function onMouseDown(event) {
    checkKeyPressed('mouse', event);
    isMouseDown = true;
}

function onMouseMove(event) {
    if (isMouseDown) {
        checkKeyPressed('mouse', event);
    }
}

function onMouseUp(event) {
    isMouseDown = false;
    checkKeyReleased('mouse');
}

function onMouseLeave(event) {
    onMouseUp(event);
}

var currentTouches = new Map();

function onTouchStart(event) {
    for (var touch of event.touches) {   
        checkKeyPressed(touch.identifier, event);
        currentTouches.set(touch.identifier, touch);
    }
}

function onTouchEnd(event) {
    for (var touch of event.touches) {
        if (currentTouches.has(touch.identifier)) {
            checkKeyReleased(touch.identifier);
            currentTouches.delete(touch.identifier)
        }
    }
}

function onTouchMove(event) {
    for (var touch of event.touches) {
        if (currentTouches.has(touch.identifier)) {
            checkKeyPressed(touch.identifier, event);
        }
    }
}

function onTouchCancel(event) {
    onTouchEnd(event);
}

var idToKeyMap = new Map();

function checkKeyPressed(id, event) {
    var x = (-1.0 + (2.0 * (event.clientX / window.innerWidth)));
    var y = (1.0 - (2.0 * (event.clientY / window.innerHeight)));

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
    
    if (idToKeyMap.has(id)) {
        mouseKeyPressed[idToKeyMap.get(id)] = false;
    }
    mouseKeyPressed[pressedKey] = true;

    idToKeyMap.set(id, pressedKey);
}

function checkKeyReleased(id) {
    if (idToKeyMap.has(id)) {
        mouseKeyPressed[idToKeyMap.get(id)] = false;
        idToKeyMap.delete(id);
    }
}

var isPlaying = false;

function onPlay() {
    isPlaying = true;
}

function onPause() {
    isPlaying = false;
}

function onStop() {
    isPlaying = false;
    time = 0.0;
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

function notesLeft(midi, indices) {
    for (var i = 0; i < midi.tracks.length; i++) {
        if (indices[i] < midi.tracks[i].length) {
            return true;
        }
    }

    return false;
}

function loadMidi(midi) {
    ticks_per_beat = midi.header.ticksPerBeat;
    var times = new Array(midi.tracks.length);
    times.fill(0);
    var indices = new Array(midi.tracks.length);
    indices.fill(0);
    var notes = new Array(midi.tracks.length);
    for (var i = 0; i < notes.length; i++) {
        notes[i] = new Map();
    }

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

        if (nextEvent.meta) {
            continue;
        }
        switch (nextEvent.type) {
            case 'noteOn': {
                var note = (nextEvent.noteNumber - 21);
                if (nextEvent.velocity == 0) {
                    if (notes[nextIndex].has(note)) {
                        notes_sorted[notes[nextIndex].get(note)].end = nextTime;
                        notes[nextIndex].delete(note);
                    }
                } else {
                    notes[nextIndex].set(note, notes_sorted.length);
                    addNote(note, nextTime);
                }

                break;
            }

            case 'noteOff': {
                var note = (nextEvent.noteNumber - 21);
                if (notes[nextIndex].has(note)) {
                    notes_sorted[notes[nextIndex].get(note)].end = nextTime;
                    notes[nextIndex].delete(note);
                }
                break;
            }
        }
    }
}

var notes_sorted = [];

function addNote(key, start) {
    notes_sorted.push({'key': key, 'start': start, 'end': null});
}

var zoom = 1.0; // in measures
var time = 0.0; // in milliseconds

function ticksToMilliseconds(ticks) {
    return ((60000.0 / (tempo * ticks_per_beat)) * ticks);
} 

function millisecondsToTicks(milliseconds) {
    return (milliseconds / (60000.0 / (tempo * ticks_per_beat)));
}

document.getElementById('notes-color').value

var notes_r = 0.0;
var notes_g = 0.0;
var notes_b = 0.0;

onColorChanged(document.getElementById('notes-color').value);

function onColorChanged(color) {
    var collen=(color.length-1)/3;
    var fact=[17,1,0.062272][collen-1];
    notes_r = (Math.round(parseInt(color.substr(1,collen),16)*fact) / 256.0);
    notes_g = (Math.round(parseInt(color.substr(1+collen,collen),16)*fact) / 256.0);
    notes_b = (Math.round(parseInt(color.substr(1+2*collen,collen),16)*fact) / 256.0);
}

// can we cache note start index somehow to avoid searching whole list? like first note that actually is shown
function updateNotes() {
    notes_vertices = [];
    notes_colors = [];
    notes_indices = [];

    var start_tick = millisecondsToTicks(time);
    var end_tick = (start_tick + (4 * ticks_per_beat * zoom) - 1);

    songKeyPressed.fill(false);

    for (var i = 0; i < notes_sorted.length; i++) {
        var note = notes_sorted[i];
        if (note.start > end_tick) {
            break;
        }
        if (note.end < start_tick) {
            continue;
        }

        if ((note.start <= start_tick) && 
            (note.end >= start_tick)) {
                songKeyPressed[note.key] = true;
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

        var radius_x = (white_key_width * 0.28);
        var radius_y = (radius_x * (gl.canvas.width / gl.canvas.height));

        createRoundedRectangle(notes_vertices, notes_colors, notes_indices, start_x, start_y, end_x, end_y, radius_x, radius_y, notes_r, notes_g, notes_b);//(7 / gl.canvas.width) * 2, (7 / gl.canvas.height) * 2);
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


function createRoundedRectangle(vertices, colors, indices, start_x, start_y, end_x, end_y, radius_x, radius_y, color_r, color_g, color_b) {
    var length_x = (end_x - start_x);
    var length_y = (end_y - start_y);
    //var radius = (Math.min(length_x, length_y) / 2);
    var divisions = 15;
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
        colors.push(color_r, color_g, color_b);
        for (var j = 0; j < divisions; j++) {
            var x = (center_x + (Math.cos(angle) * radius_x));
            var y = (center_y + (Math.sin(angle) * radius_y));
            vertices.push(x, y);
            colors.push(color_r, color_g, color_b);
            indices.push((corner_start + 0), (corner_start + j + 1), (corner_start + j + 2));
            angle += (Math.PI / 2 / divisions);
        }
        var x = (center_x + (Math.cos(angle) * radius_x));
        var y = (center_y + (Math.sin(angle) * radius_y));
        vertices.push(x, y);
        colors.push(color_r, color_g, color_b);
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

    notes_indices.push(index_0, index_1, index_2, index_0, index_2, index_3);
}



// var notes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1",
//              "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2",
//              "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3",
//              "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4",
//              "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5",
//              "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6",
//              "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7",
//              "A7", "A#7", "B7", "C8"];


struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(1) uv: vec2<f32>
};

struct Camera {
  viewProjectionMatrix: mat4x4<f32>
};

struct Mesh {
    transform: mat4x4<f32>
}



@group(0) @binding(0) var<uniform> camera : Camera;
@group(0) @binding(1)  var<uniform> mesh : Mesh;

@group(0) @binding(2) var ourSampler: sampler;
@group(0) @binding(3) var ourTexture: texture_2d<f32>;

@vertex
fn main(
    input: VertexInput
) -> VertexOutput {
    var output: VertexOutput;
    let worldPosition = mesh.transform * vec4<f32>(input.position, 1.0);
    output.position = camera.viewProjectionMatrix * worldPosition;
    output.uv = input.uv;
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    return textureSample(ourTexture, ourSampler, input.uv);
}

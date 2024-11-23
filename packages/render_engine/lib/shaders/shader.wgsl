struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
};

struct Camera {
  viewProjectionMatrix: mat4x4<f32>
};

struct Mesh {
    transform: mat4x4<f32>
}


@binding(0) @group(0) var<uniform> camera : Camera;
@binding(1) @group(0) var<uniform> mesh : Mesh;

@vertex
fn main(
    input: VertexInput
) -> VertexOutput {
    var output: VertexOutput;
    output.color = input.color;


    let worldPosition = mesh.transform * vec4<f32>(input.position, 1.0);
    output.position = camera.viewProjectionMatrix * worldPosition;
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {

    return input.color;
}

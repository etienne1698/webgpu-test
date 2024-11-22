struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>,
    @location(2) modelMatrixRow1: vec4<f32>,
    @location(3) modelMatrixRow2: vec4<f32>,
    @location(4) modelMatrixRow3: vec4<f32>,
    @location(5) modelMatrixRow4: vec4<f32>
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
};

struct Camera {
  viewProjectionMatrix: mat4x4<f32>
};


@binding(0) @group(0) var<uniform> camera : Camera;

@vertex
fn main(
    input: VertexInput
) -> VertexOutput {
    var output: VertexOutput;
    output.color = input.color;

    let modelMatrix = mat4x4<f32>(
        input.modelMatrixRow1,
        input.modelMatrixRow2,
        input.modelMatrixRow3,
        input.modelMatrixRow4,
    );

    let worldPosition = modelMatrix * vec4<f32>(input.position, 1.0);
    output.position = camera.viewProjectionMatrix * worldPosition;
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {

    return input.color;
}

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
};

struct Uniforms {
  modelMatrix: mat4x4<f32>
};
@binding(0) @group(0) var<uniform> cameraPos : Uniforms;

@vertex
fn main(
    input: VertexInput
) -> VertexOutput {
    var output: VertexOutput;
    output.position = cameraPos.modelMatrix * vec4(input.position, 1);
    output.color = input.color;
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {

    return input.color;
}

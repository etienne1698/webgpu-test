struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>
}

struct Uniforms {
  modelMatrix: mat4x4<f32>
};
@binding(0) @group(0) var<uniform> cameraPos : Uniforms;

@vertex
fn main(
    input: VertexInput
) -> @builtin(position) vec4<f32> {
    return cameraPos.modelMatrix * vec4(input.position, 1) ;
}

@fragment
fn fragmentMain() -> @location(0) vec4f {

    return vec4f(1, 0, 0, 0);
}

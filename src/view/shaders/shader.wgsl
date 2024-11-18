struct Uniforms {
  modelMatrix : mat4x4 < f32>
};
@binding(0) @group(0) var<uniform> uniforms : Uniforms;
@binding(1) @group(0) var<uniform> cameraPos : vec3 < f32>;

@vertex
fn main(
@location(0) position : vec3 < f32>
) -> @builtin(position) vec4 < f32> {
  return uniforms.modelMatrix * vec4(position - cameraPos, 1) * vec4(cameraPos.z + 1, cameraPos.z + 1, 1, 1);
}

@fragment
fn fragmentMain() -> @location(0) vec4f {

  return vec4f(1, 0, 0, 0);
}

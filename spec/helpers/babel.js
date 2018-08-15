require("babel-core/register")({
  plugins: [
    "transform-object-rest-spread",
    ["transform-class-properties", {"spec": true}]
  ],
  presets: ["env", "react"]
});
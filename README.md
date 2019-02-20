# ts-mind[Bata 版]

TSMind 是一款使用 `typescript`编写的脑图库，灵感来自 `jsmind` 脑图库。

# 依赖与支持

TSMind 没有任何第三方依赖，包体积更小；

# 安装与使用

```bash
$ npm i ts-mind
```

```javascript
import { TSMind } from "ts-mind";
import "ts-mind/dist/style.css";

const tsm = new TSMind({
  container: "#container" // or Node
  ...otherOpts
})
```

# 接口

接口暂时与 `jsmind` 保持一致，后续将进行调整，并出具相应的接口文档。

# 优点 [相比`jsmind`和其他脑图库]

- 性能更优
- 可扩展性更高
- 基于`es6+`接口设计，接口调用更清晰
- 基于`Typescript`的接口定义，使得开发效率大大提升

# 开源协议

[MIT](https://opensource.org/licenses/MIT)

Copyright &copy; 2019-present, JasonDRZ

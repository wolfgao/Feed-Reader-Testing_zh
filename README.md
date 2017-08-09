# 项目预览

在这个项目中，你会得到一个基于 web 的用来读取 rss 源的应用，更重要的是如何使用jasmine框架来编写测试spec，完成Unit test甚至integration test.

## 项目目的

测试是开发过程中一个很重要的部分，很多组织把一个标准的开发过程称之为测试驱动开发。意思就是开发人员在他们开始着手编写应用代码之前先写好测试用例。当然这个时候所有的测试用例都是通不过的，然后他们就开始编写应用代码使测试全部通过。

## 我会学到什么

你会学到怎么使用 Jasmine 来给已经写好的应用编写一定数量的测用例。
### 理解和实现test suit
针对一个类，或者一个主要的feature，我们可以编写一个test suit来完成，在这个下面我们可以写很多test cases，这些test cases 都或多或少有一些联系，有可能需要共同的变量，有可能需要统一的预制执行函数，在jasmine这个test suit通过[describe](https://jasmine.github.io/api/2.6/global.html#describe)来定义。

### 理解和实现test case
针对某个或者某几个验证点，我们可以编写一个test case来完成，在jasmine通过[it](https://jasmine.github.io/api/2.6/global.html#it)方法来完成。在每一个it方法里面我们可以完成相关联的验证点的实现，这个通过[expect](https://jasmine.github.io/api/2.6/global.html#expect)来完成。

### 异步ajax的测试开发
本项目最难完成和对课程最难理解的地方就是如何实现对异步方法的验证。理论上我们必须等异步操作完成之后才能实现it部分，因此如何把这两个地方关联起来。我们先要定义一个回调函数done(), 在进行异步完成后，启动回调函数done。在it部分结束后我们也再次回调done。比如下面的ajax异步调用的验证。
``` js
beforeEach(function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; //Change default timeout to a longer time.
            loadFeed(0, function(){
                done(); // we're done, Jasmine can run the specs now
            });
        });
```
补充内容：
在老师评审之后，简化了我的done 回调函数，另外收获更多，希望和大家分享一下：
我们来梳理一下两者的执行过程，分析出为什么可以进行简化：

``` js 
loadFeed(0, function() {
  done();
}); // 简化前
```
上面的函数其实就是在调用 js——>app.js 中的 loadFeed 函数，该函数接收两个参数，一个是数字类型，一个是函数类型。忽略掉函数内部其他逻辑代码，专注于第二个参数的调用，可以写出如下的伪代码：

``` js
function loadFeed(id, cb) {
  cb = function() {
      done();
  } // 参数cb就等于我们的在开头传递的第二个参数：匿名函数。

  cb(); // 调用函数。此时执行 cb ，本质上就是在执行 feedreader.js 中 beforeEach 的可选参数 `done`，即 cb() == done() . 当done函数被调用，表明异步操作的回调函数调用成功.
}
loadFeed(0, done); // 简化后
```
简化后的伪代码：
``` js
function loadFeed(id, cb) {
  cb = done;
  cb(); // 看出效果没有呢？ 此时的cb就是 beforeEach 中传递的 done 函数，调用 cb 就等同于 调用 done 
}
```

## 这对我的职业有何帮助？

* 编写测试需要分析应用中诸如 html , css , javascript 之类的各个层面。当你换了团队工作或者加入到一个新的公司，这项技能尤其重要（译者注：指阅读新的项目代码的能力）
* 长期编写测试会让你拥有不需要手动编写测试去测试所有的功能就能快速分析新的代码是否和已知代码冲突的能力。

# 我如何完成这个项目

1. 仔细阅读[jasmine网站](https://jasmine.github.io/)的介绍和API文档。
2. 查看 Jasmine spec 文件 **./jasmine/spec/feedreader.js** 
3. 根据课程的要求可以通过 red -> green ->coding来完成每一个TODO项目。
4. 对每一个spec的测试用例也要进行测试，保证引用正确并达到目的。
5. 对隐藏菜单的case，需要仔细研究index.html和style.css文件中点击菜单icon的变化，这样才能保证你的spec编写正确。
6. 对`"Initial Entries"` 和`"New Feed Selection"` 的测试用例的测试用例是本项目最难的部分，需要充分理解异步调用机制和如何使用回调函数来确保数据返回结束后才进行test spec的验证，上面总结中我也上传了自己的code，希望有所帮助。
7. 每个测试都不应该依赖别的测试的结果。
8. 额外的测试（来提高测试覆盖率）：
- 检查name和url是否为空，我定义了3个expectatoins: 是否defined,是否null,是否为''。
```
    expect(feed.url).toBeDefined();
    expect(feed.url).not.toBeNull();
    expect(feed.url).not.toEqual('');
```
- 换feed之后的检查点，我写了两个，一个是title是否变化，另一个是feed是否改变？
```
    expect($('.header-title').html()).not.toEqual(oldTitle);
    expect($('.feed').html).not.toEqual(oldFeed);
```

以上是这个项目总结，希望能不断总结jasmine的使用经验，为以后的项目打好基础。

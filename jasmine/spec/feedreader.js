/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function() {
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
    */
    describe('RSS Feeds', function() {
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
        */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        //Because name and URL use the samiliar detections, so we let them in a function together.
        var sameDetection = function(val){
          expect(val).toBeDefined();
          expect(val).not.toBeNull();
          expect(val).not.toEqual('');
        }
        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('Each link in allFeeds is defined, valid and not null, or not \'\'', function(){
          var regularExpressionUrl = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/; // 检查 URL 格式是否正确的正规表达式
            $.each(allFeeds, function(index, feed){
              //Check the url is valid URL
              expect(feed.url).toMatch(regularExpressionUrl);
              sameDetection(feed.url);
            })

        });

        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('Each name in allFeeds is defined and not null, or not \'\'', function(){
            $.each(allFeeds, function(index, feed){
              sameDetection(feed.name);
            })

        });
    });


    /* TODO: 写一个叫做 "The menu" 的测试用例 */
    describe('The Menu', function() {
            var menuIcon = $('.menu-icon-link'),
                body = $("body");

        /* TODO:
         * 写一个测试用例保证菜单元素默认是隐藏的。你需要分析 html 和 css
         * 来搞清楚我们是怎么实现隐藏/展示菜单元素的。
         */
        it('body class has \"menu-hidden\" by default', function(){
            //menu-hidden .slide-menu {transform: translate3d(-12em, 0, 0);
            expect(body.hasClass('menu-hidden')).toBeTruthy(); //If having "menu-hidden", will return true
        });

         /* TODO:
          * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
          * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
          * 再次点击的时候是否隐藏。
          */
         it('Menu icon can be toggled after clicking', function(){
            // Click once to show the menu
            menuIcon.trigger('click');
            expect(body.hasClass('menu-hidden')).toBeFalsy(); //click link icon will remove the class.
            //Click again to hide the menu
            menuIcon.trigger('click');
            expect(body.hasClass('menu-hidden')).toBeTruthy(); // if click again, body will has the class to hide the menu.
        });
    });
    /* TODO: 13. 写一个叫做 "Initial Entries" 的测试用例 */
    describe('Initial Entries', function() {
        var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        /* TODO:
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         *
         * 记住 loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */
        beforeEach(function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; //Change default timeout to a longer time.
            loadFeed(0, done);
        });

        //在发出ajax请求后，获得entry数组,至少有一个存在。
        //这里的 it 测试用例中不包含任何的异步请求，所以删除99行的 function(done) 可选参数 done。
        it('At least one .entry element exists in .feed.', function(){
            expect($('.feed .entry').length).toBeGreaterThan(0);
            //done();
        })

        //执行完测试用例后，恢复改变的属性值
        afterEach(function(){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });
        /* TODO: 写一个叫做 "New Feed Selection" 的测试用例 */
    describe('New Feed Selection', function() {
        var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        var oldFeed, oldTitle = null;

        //在IT执行前完成feed的变化，从feed的变化看结果是否改变
        //因为是个异步函数，因此必须使用一个回调函数在完成数据获取后
        beforeEach( function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; //Change default timeout to a longer time.
            loadFeed(0, function(){
                oldFeed = $('.feed').html();
                oldTitle = $('.header-title').html();
                loadFeed(1, done);
            });
        });

        /* TODO:
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * 记住，loadFeed() 函数是异步的。
         */
        it('Change new Feed will change content', function(){
            expect($('.header-title').html()).not.toEqual(oldTitle);
            expect($('.feed').html).not.toEqual(oldFeed);
        });

        //执行完测试用例后，恢复改变的属性值
        afterEach(function(){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

}());

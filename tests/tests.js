    'use strict';

    var TEST_FIXTURE_ID = "qunit-fixture";
    var EMBEDDED_FLASH_ID = "flash-content";

    function embedFlash(swfUrl, callback)
    {
        $FlashWarp(EMBEDDED_FLASH_ID, "dispose");

        $("#" + TEST_FIXTURE_ID).append("<div id='" + EMBEDDED_FLASH_ID + "'></div>");

        var onEmbedded = function(e) {
            $FlashWarp(EMBEDDED_FLASH_ID).map("ready", function(){
                callback();
            });  
        };

        var swfVersionStr = "0";
        var xiSwfUrlStr = "";
        var flashvars = {};
        var params = {};
        params.quality = "high";
        params.bgcolor = "#ffffff";
        params.allowscriptaccess = "sameDomain";
        var attributes = {};
        attributes.id = EMBEDDED_FLASH_ID;
        attributes.name = EMBEDDED_FLASH_ID;
        attributes.align = "middle";
        swfobject.embedSWF(
            swfUrl, EMBEDDED_FLASH_ID,
            "100%", "100%",
            swfVersionStr, xiSwfUrlStr,            
            flashvars, params, attributes, onEmbedded);   
    }

    //--------------------------------------------------------------------------
    //
    //  Function invokation tests
    //
    //--------------------------------------------------------------------------

    asyncTest("Function invokation: single argument & return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_1", "Hello World");

            strictEqual(result, "echo: Hello World", "Echo result is valid");
            start();
        });
    });

    asyncTest("Function invokation: multiple arguments & return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_2", "Hello", "World");

            strictEqual(result, "echo: Hello, World", "Result is valid");
            start();
        });
    });

    asyncTest("Function invokation: no arguments & no return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_3");

            strictEqual(result, undefined, "Result is valid");
            start();
        });
    });

    asyncTest("Function invokation: array argument & return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_4", ["Hello", "World"]);

            strictEqual(result, "Hello, World", "Result is valid");
            start();
        });
    });

    asyncTest("Function invokation: null argument & null return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_5", null);

            strictEqual(result, null, "Result is valid");
            start();
        });
    });

    asyncTest("Function invokation: error expected", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            throws( function() {
                $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_6");
            },
            "Function throws an error");

            start();
        });
    });

    //--------------------------------------------------------------------------
    //
    //  Object tests
    //
    //--------------------------------------------------------------------------

    asyncTest("Object test: null argument & no return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_b_1", null);

            strictEqual(result, undefined, "Result is valid");
            start();
        });
    });

    asyncTest("Object test: basic argument & same return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_b_2", { msg: "Hello" });

            strictEqual(result.msg, "Hello World", "Result is valid");
            start();
        });
    });

    asyncTest("Object test: complex argument & same return value", function()
    {
        expect(2);

        embedFlash("app/bin/FlashWarpTests.swf", function() {
            ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_b_3", { msg1: { value: "Hello" }, msg2: { value: "World" } });

            strictEqual(result.msg1.value + result.msg2.value, "Hello World", "Result is valid");
            start();
        });
    });
/*jslint browser: true*/

/*global $FlashWarp */
/*global swfobject */
/*global QUnit */
/*global $ */

    'use strict';

    var TEST_FIXTURE_ID = "qunit-fixture";
    var EMBEDDED_FLASH_ID = "flash-content";
    var TEST_RUNNER_URL = "app/bin/App.swf";

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

    QUnit.asyncTest("Function invokation: single argument & return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_1", "Hello World");

            QUnit.strictEqual(result, "echo: Hello World", "Echo result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Function invokation: multiple arguments & return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_2", "Hello", "World");

            QUnit.strictEqual(result, "echo: Hello, World", "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Function invokation: no arguments & no return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_3");

            QUnit.strictEqual(result, undefined, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Function invokation: array argument & return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_4", ["Hello", "World"]);

            QUnit.strictEqual(result, "Hello, World", "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Function invokation: null argument & null return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_5", null);

            QUnit.strictEqual(result, null, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Function invokation: error expected", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            QUnit.throws( function() {
                $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_a_6");
            },
            "Function throws an error");

            QUnit.start();
        });
    });

    //--------------------------------------------------------------------------
    //
    //  Object tests
    //
    //--------------------------------------------------------------------------

    QUnit.asyncTest("Object test: null argument & no return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_b_1", null);

            QUnit.strictEqual(result, undefined, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Object test: basic argument & same return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_b_2", { msg: "Hello" });

            QUnit.strictEqual(result.msg, "Hello World", "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Object test: complex argument & same return value", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_b_3", { msg1: { value: "Hello" }, msg2: { value: "World" } });

            QUnit.strictEqual(result.msg1.value + result.msg2.value, "Hello World", "Result is valid");
            QUnit.start();
        });
    });

    //--------------------------------------------------------------------------
    //
    //  Primitives tests
    //
    //--------------------------------------------------------------------------

    QUnit.asyncTest("Primitives: boolean", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_1", true);

            QUnit.strictEqual(result, true, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Primitives: negative integer", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_2", -1);

            QUnit.strictEqual(result, -2, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Primitives: unsigned integer", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_3", 100);

            QUnit.strictEqual(result, 100, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Primitives: largest positive integer", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_4", 2147483647);

            QUnit.strictEqual(result, 2147483647, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Primitives: smallest negative integer", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_4", -2147483648);

            QUnit.strictEqual(result, -2147483648, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Primitives: largest positive unsigned integer", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_3", 4294967295);

            QUnit.strictEqual(result, 4294967295, "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Primitives: number", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_c_5", -100.01);

            QUnit.strictEqual(result, -100.01, "Result is valid");
            QUnit.start();
        });
    });

    //--------------------------------------------------------------------------
    //
    //  Array tests
    //
    //--------------------------------------------------------------------------

    QUnit.asyncTest("Arrays: manipulation", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_d_1", ["Hello"]);

            QUnit.strictEqual(result.join(" "), "Hello World", "Result is valid");
            QUnit.start();
        });
    });

    QUnit.asyncTest("Arrays: complex", function()
    {
        QUnit.expect(2);

        embedFlash(TEST_RUNNER_URL, function() {
            QUnit.ok(true, "Application started");

            var result = $FlashWarp(EMBEDDED_FLASH_ID).invoke("test_d_2", ["Hello"]);

            QUnit.strictEqual(result[1][0], "World", "Result is valid");
            QUnit.start();
        });
    });
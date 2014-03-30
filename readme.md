Consider the following code:

      <object id="FlashContent"></object>
      <input id="textField" type="text" /><br/>
      <button id="helloButton">Call Flash</button>

      var txtInput = document.getElementById("textField");
      var button = document.getElementById("helloButton");

You can call Flash function by alias, and you can do the same thing from Flash side as well.
      
      var warp = $FlashWarp("FlashContent"); //Get the Flash object by ID
      
      //Call Flash when the button is clicked
      button.addEventListener("click", function (e) {
          warp.invoke("hello", txtInput.value);
      });
      
      //Handle Flash call
      warp.map("hello", function(message) { 
          alert("Message from Flash: " + message);
      });

You can also define bindings between Flash and JavaScript. Once its value is changed, both sides will receive an update event.
      
      //Listen for binding changes and update the textfield
      warp.binding("textfield").addListener(function (value) {
          txtInput.value = value;
      });
      
      //Update the textfield binding value
      txtInput.onkeyup = function (e) {
          warp.binding("textfield").setValue(this.value);
      };

It is even simplier on the Flash side:

      [Bindable] private var binding:IObservable;

      private function initializeHandler(event:FlexEvent):void
      {
      	FlashWarp.map("hello", function(text:String):void{
      		Alert.show(text, "Message from HTML");
      	});
      	
      	binding = FlashWarp.binding("textfield");
      }
      
      private function creationCompleteHandler(event:FlexEvent):void
      {
      	binding.value = "Hello World";
      }		
      
      private function clickHanlder(event:MouseEvent):void
      {
      	FlashWarp.invoke("hello", [ txt.text ]);
      }
      
      <s:TextInput id="txt" text="@{binding.value}" /> <!-- Two-way binding -->
      <s:Button label="Call HTML" click="clickHanlder(event)" />

## Example project

See [FlashWarp example project](https://github.com/artema/flash-warp-example) and [this blog post](http://abashev.com/flashwarp-library/) for more details.

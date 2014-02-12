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

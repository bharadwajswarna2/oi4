window.addEventListener('DOMContentLoaded', function () {
    $('#myPopup').hide();
    $('#feature').hide();
  
    const url = new URL(window.location.href);
    // Get the query parameters
    const queryParams = new URLSearchParams(url.search);
    console.log("=================================================");
    console.log(queryParams);
    // Access individual query parameters
    const maxed_check = queryParams.get('maxed'); // "John"
    if (maxed_check){
      console.log("===maxed======");
      $('#myPopup').hide();
      $('#feature').show();
    
  
  
    function close_popup(){
      $('#myPopup').hide();
    }
  
    class Chatbox {
        constructor() {
          this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
          };
      
          this.state = false;
          this.messages = [];
        }
  
        popUp(ai_message){
            console.log('popUp',this.args);
            const { openButton, chatBox, sendButton } = this.args;
            chatBox.classList.add('chatbox--active');
            // let content='<a href="www.google.com" target="_blank">Visa Process</a>'
            let msg2 = { name: 'Sam', message: ai_message};
            // I saw you were searching for the Visa Process click on the below link for futher process ${content}` };
            this.messages.push(msg2);
            this.updateChatText(chatBox);
  
        }
  
        bubbleUp(ai_message){
          console.log('bubbleUp')
          let s =document.getElementById('myPopup')
          s.innerHTML = ai_message
          $('#myPopup').show();
        }
      
  
        display() {
          const { openButton, chatBox, sendButton } = this.args;
          
          openButton.addEventListener('click', () => this.toggleState(chatBox));
      
          sendButton.addEventListener('click', () => this.onSendButton(chatBox));
      
          const node = chatBox.querySelector('input');
          node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
              this.onSendButton(chatBox);
            }
          });
      }
      
        toggleState(chatbox) {
          this.state = !this.state;
      
          // show or hides the box
          if (this.state) {
            chatbox.classList.add('chatbox--active');
          } else {
            chatbox.classList.remove('chatbox--active');
          }
        }
      
        onSendButton(chatbox) {
          var textField = chatbox.querySelector('input');
          let text1 = textField.value;
          if (text1 === '') {
            return;
          }
      
          let msg1 = { name: 'User', message: text1 };
          this.messages.push(msg1);
          this.updateChatText(chatbox);
          textField.value = '';
      
          fetch('https://www.oimax.in/chat_gpt_query', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((r) => r.json())
            .then((r) => {
              let msg2 = { name: 'Sam', message: r.message };
              this.messages.push(msg2);
              this.updateChatText(chatbox);
              textField.value = '';
            })
            .catch((error) => {
              console.error('Error:', error);
              this.updateChatText(chatbox);
              textField.value = '';
            });
        }
      
        updateChatText(chatbox) {
            var html = '';
            this.messages
              .slice()
              .reverse()
              .forEach(function (item, index) {
                if (item.name === 'Sam') {
                  html +=
                    '<div class="messages__item messages__item--visitor">' +
                    item.message +
                    '</div>';
                } else {
                  html +=
                    '<div class="messages__item messages__item--operator">' +
                    item.message +
                    '</div>';
                }
              });
        
            const chatmessage = chatbox.querySelector('.chatbox__messages');
            chatmessage.innerHTML = html;
          }
    }
  
  
        function handleReload(){
            const chatbox = new Chatbox();
            chatbox.display();
            console.log('loaded')
            let counter = 0;
            const intervalId = setInterval(() => {
            console.log('Interval running...',counter);
            //  clearInterval(intervalId);
            fetch('https://www.oimax.in/initial_query', {
              method: 'POST',
              body: JSON.stringify({session_identifier : getCookie()}),
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((r) => r.json())
              .then((r) => {
                let msg2 = { name: 'Sam', message: r.ai_result};
                console.log("======")
                console.log(r);
                console.log(msg2)
  
                // if r.action_type == "bubble":
                if (r.use_status === 0) {
                  let msg2 = { name: 'Sam', message: r.ai_result };
                  
                  if (r.action_type == "bubble") {
                    console.log("if condition")
                    chatbox.bubbleUp(r.ai_result)
  
  
                    const myDiv = document.querySelector('#myPopup');
                    myDiv.addEventListener('click', () => {
                    $('#myPopup').hide();
                    // chatbox.popUp(r.ai_result);
                    // clearInterval(intervalId);
                    });
  
                  } else {
                    console.log("Enter else")
                    $('#myPopup').hide();
                    chatbox.popUp(r.ai_result);
                    clearInterval(intervalId); // to be changedddddddd
  
                  }       
                  // clearInterval(intervalId);
                } else {
                  // Do nothing
                }
  
                // chatbox.popUp(r.ai_result);
  
                // this.messages.push(msg2);
                // this.updateChatText(chatbox);
                // textField.value = '';
              })
              .catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox);
                textField.value = '';
              });
  
  
  
            //  chatbox.popUp();
            //  clearInterval(intervalId);
  
            //alert('API CALL')
            //clearInterval(intervalId);
        
            counter++;
            if (counter >= 2000) {
            //   clearInterval(intervalId);
              console.log('Interval continue');
            }
            }, 4000);
        }
  
        function getCookie() {
  
          const cookies = document.cookie.split(";"); // split cookies by semicolon
          let session_id = null;
  
          cookies.forEach(cookie => {
            const [name, value] = cookie.split("=");
            if (name.trim() === "session_id") {
              session_id = value;
            }
            
          });
          console.log(session_id, "ideeeeeeeeeeeee");
          return session_id;
        }
        
          function setSessionId(sessionId, expirationDays) {
            // let session_id = ""
            var d = new Date();
            d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = "session_id" + "=" + sessionId + ";" + expires + ";path=/";
          
          }
        
  
          // $('.close_bubble').click(function() {
          // $('#myPopup').hide();
          // });
  
        $(document).ready(function() {
          handleReload()
          $('#myPopup').hide();
//           setSessionId("S-1234", 1)
      })
    
      // You can initialize and interact with your chatbot here
  
      //////////////////////////////////////////////////////////////////////////////////////
    
      // Example code for adding the chatbot HTML to the page
      var chatboxHTML = `
      <div id="feature">
      <div class="container">
          <div class="chatbox">
              <div class="chatbox__support">
                  <div class="chatbox__header">
                      <div class="chatbox__image--header">
                          <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="image">
                          <!-- <img src="https://cdn.jsdelivr.net/gh/optimus-ohya/oimax_chat@latest/frontend/images/oi.png" alt="image"> -->
                      </div>
                      <div class="chatbox__content--header">
                          <h4 class="chatbox__heading--header">OiMax</h4>
                      </div>
                      <img src="close.png" onclick="document.getElementById('chatbox1').click()" class="close-btn" alt="image">
                  </div>
                  <hr/ class="hr-line">
                  <div class="chatbox__messages">
                      <div></div>
                  </div>
                  <div class="chatbox__footer">
                      <input type="text" placeholder="Write a message...">
                      <button class="chatbox__send--footer send__button">Send</button>
                  </div>
              </div>
              <div class="bubble" onclick="close_popup()" id="myPopup">
                <!-- <span>
                  Hey ! this is a bubble !
                </span> -->
                <span class="close_bubble"></span>
              </div>
              <div class="chatbox__button" >
                  <button onclick="close_obtn()"  id="chatbox1"><img src="https://cdn.jsdelivr.net/gh/optimus-ohya/oimax_chat@latest/frontend/images/oi.png" /></button>
              </div>
          </div>
      </div>
    </div>
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
  <script src="app.js"></script>
      `;
    
      // Append the chatbox HTML to the body element
      document.body.insertAdjacentHTML('beforeend', chatboxHTML);
    
      // Example code for closing the popup on click
      function close_popup() {
        var popup = document.getElementById('myPopup');
        popup.style.display = 'none';
      }
    }});
    

      // Example code for closing the Button on click mobiles
      function close_obtn() {
        var btnopn = document.getElementById('chatbox1');
        if($('btnopn').hasClass('hide-chat')) {
          btnopn.classList.add('hide-chat');
        }
        else{
          btnopn.classList.remove('hide-chat');
        }
      }
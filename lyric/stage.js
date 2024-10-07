function getTheme(host) {

  fetch(`http://${host}:4316/api/v2/controller/live-theme`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      window.theme = data;
      // TODO set body background url
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

}

function renderSlide(host) {
  fetch(`http://${host}:4316/api/v2/controller/live-item`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const template = document.getElementById('template').innerHTML;
      const rendered = Mustache.render(template, data);
      document.getElementById('template-container').innerHTML = rendered;
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const host = window.location.hostname;
  const websocket_port = 4317;
  //getTheme(host);

  ws = new WebSocket(`ws://${host}:${websocket_port}`);
  ws.onmessage = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const state = JSON.parse(reader.result.toString()).results;

      console.log(state);
      console.log(`blank: ${state.blank}, theme: ${state.theme}, display: ${state.display}`);
      if (state.blank) {
        console.log('screen blank is ON');
        document.querySelectorAll('body,body *').forEach(function(d) {
          d.classList.add('blank')
        });
      } else {
        console.log('screen blank is OFF');
        document.querySelectorAll('body,body *').forEach(function(d) {
          d.classList.remove('blank')
        });
      }
      if (state.theme) {
        console.log('theme is ON');
        document.querySelectorAll('body,body *').forEach(function(d) {
          d.classList.add('theme')
        });
      } else {
        console.log('theme is OFF');
        document.querySelectorAll('body,body *').forEach(function(d) {
          d.classList.remove('theme')
        });
      }
      if (!state.blank && !state.theme) {
        renderSlide(host);
      }
    };
    reader.readAsText(event.data);
  };
});


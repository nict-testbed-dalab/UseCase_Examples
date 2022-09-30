// URL mapping, from hash to a function that responds to that URL action
const router = {
  "/": () => showContent("content-home"),
  // "/profile": () =>
  //   requireAuth(() => showContent("content-profile"), "/profile"),
  "/login": () => login()
};

//Declare helper functions

/**
 * Iterates over the elements matching 'selector' and passes them
 * to 'fn'
 * @param {*} selector The CSS selector to find
 * @param {*} fn The function to execute for every element
 */
const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

/**
 * Tries to display a content panel that is referenced
 * by the specified route URL. These are matched using the
 * router, defined above.
 * @param {*} url The route URL
 */
const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }

  return false;
};

/**
 * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
 * @param {*} element The element to check
 */
const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

/**
 * Displays a content panel specified by the given element id.
 * All the panels that participate in this flow should have the 'page' class applied,
 * so that it can be correctly hidden before the requested content is shown.
 * @param {*} id The id of the content to show
 */
const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

/**
 * Updates the user interface
 */
const updateUI = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0.getUser();

      if (document.getElementById("profile-data") != null){
        document.getElementById("profile-data").innerText = JSON.stringify(
          user,
          null,
          2
        );
 
      }

      // document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      // eachElement(".user-email", (e) => (e.innerText = user.email));
      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));

      accessToken = await auth0.getTokenSilently();
  	  console.log("accessToken(must be JWT)", accessToken);
      //document.getElementById("map").contentWindow.accessToken = accessToken;
      document.getElementById("atk").value = accessToken;
// API TEST
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/api/v1/test",
        "method": "GET",
        "headers": {
        "authorization": "Bearer " + accessToken
        }
      }

      $.ajax(settings).done(function (response) {
        console.log(response);
      });
      update_MAP();

    } else {
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));
      accessToken = "";
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }

  console.log("UI updated");
};

window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};



const update_MAP = async () => {
  //currentTime = $("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%y-%mm-%dd %H:%M:%S"   );
  //console.log(currentTime);
  if (accessToken != ""){
     console.log("update_MAP");
  }
  //   var map = new mapboxgl.Map({
  //     container: 'map',
  //     style: './json/simple.json?date=20211117_1',
  //     center: [139.767144, 35.680621],
  //     zoom: 15,
  //     transformRequest: (url, resourceType) => {
  //         if (resourceType === 'Tile') {
  //             console.log("url", url);
  //             return {
  //                     url: url,
  //                     headers: {
  //                         'Authorization': 'Bearer ' + accessToken }
  //             }
  //         }
  //     }            
  //   });
        
  //   map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  //   map.addControl(new mapboxgl.ScaleControl());
  // }
}

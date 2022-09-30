// The Auth0 client, initialized in configureClient()
let auth0 = null;
let accessToken = "";

const app_path = "itowns_template/";
// const app_path = "";

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    let op_temp = window.location.origin

    if(app_path != ""){
      op_temp = window.location.origin + "/" + app_path
    }

    const options = {
        redirect_uri: op_temp
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    if(auth0 != null){
      await auth0.loginWithRedirect(options);
    }else{
      console.log("Log in failed auth0 is null.");
    }

  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = () => {
  try {
    console.log("Logging out");
    // returnTo: window.location.origin
    auth0.logout({
      returnTo: window.location.origin + "/" + app_path
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */

 let temp_root = "";
 if(app_path != ""){
  temp_root = "/" + app_path
}
//const fetchAuthConfig = () => fetch(temp_root + "/auth_config.json?date=20220107_2");
//geo
const fetchAuthConfig = () => fetch(location.pathname + "/auth_config.json?date=20220107_2");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();
	
  console.log("configureClient config",config.domain);

  try {
    auth0 = await createAuth0Client({
      domain: config.domain,
      audience : config.audience,
      client_id: config.clientId,
      cacheLocation: 'localstorage'
    });

    console.log("auth0 is activate.(not localstorage)");

  } catch (err) {
    console.log("auth0 is NOT activate.");
    console.log("configureClient failed", err);
  }
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

// Will run when page finishes loading
window.onload = async () => {
	console.log("window.onload");
  await configureClient();

  // If unable to parse the history hash, default to the root URL
//  if (!showContentFromUrl(window.location.pathname)) {
//    showContentFromUrl("/" + app_path);
//    window.history.replaceState({ url: "/" + app_path }, {}, "/" + app_path);
//  }

//  const bodyElement = document.getElementsByTagName("body")[0];

  // Listen out for clicks on any hyperlink that navigates to a #/ URL
//  bodyElement.addEventListener("click", (e) => {
//    if (isRouteLink(e.target)) {
//      const url = e.target.getAttribute("href");

//    if (showContentFromUrl(url)) {
//        e.preventDefault();
//        window.history.pushState({ url }, {}, url);
//      }
//    }
//  });

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    //window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    return;
  }

  console.log("> User is not until authenticated");

  console.log("window.location:",window.location)

  const query = window.location.search;
  console.log("query:", query);
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");
    	

    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    //window.history.replaceState({}, document.title, "/" + app_path);
  }else{
    console.log("query is null.")
  }

  updateUI();
};

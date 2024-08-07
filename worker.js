addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Retrieve environment variables
  const email = EMAIL; // Use the environment variable for email
  const password = PASSWORD; // Use the environment variable for password

  if (!email || !password) {
    return new Response('Email or password is missing in environment variables.', { status: 500 });
  }

  // Define the login and faucet URLs
  const loginUrl = 'https://faucetearner.org/api.php?act=login';
  const faucetUrl = 'https://faucetearner.org/api.php?act=faucet';

  // Define the login request options
  const loginRequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Origin': 'https://faucetearner.org',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://faucetearner.org/login.php',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  };

  // Perform the login request
  const loginResponse = await fetch(loginUrl, loginRequestOptions);

  // Check if login was successful
  if (loginResponse.ok) {
    // Extract cookies from the login response
    const cookies = loginResponse.headers.get('set-cookie');

    // Split cookies and format for request
    const formattedCookies = cookies ? cookies.split(',').map(cookie => cookie.trim()).join('; ') : '';

    // Define the faucet request options with formatted cookies
    const faucetRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Origin': 'https://faucetearner.org',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://faucetearner.org/faucet.php',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
        'Cookie': formattedCookies,
      },
      body: JSON.stringify({})
    };

    // Perform the faucet request
    const faucetResponse = await fetch(faucetUrl, faucetRequestOptions);
    const faucetResponseBody = await faucetResponse.text();

    // Return the faucet response
    return new Response(faucetResponseBody, {
      status: faucetResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    // Handle login failure
    return new Response('Login failed', { status: 401 });
  }
}

//user can manipulate cookies that are store in browser so we should not used it for storing sensitive data


exports.getLogin = (req, res, next)=>{   
    //browser send cookies to server for every request we make
    // console.log(req.get('Cookie'));
    // const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];

    //express-session  
    console.log(req.session.isLoggedIn);
    console.log(req.session);
    
    res.render('auth/login',{
        pageTitle: "Login",
        path: '/login',
        // isAuthenticated : isLoggedIn
        isAuthenticated : true
    });
}

//cookies are great for tracking user //tracking pixel
exports.postLogin = (req, res, next)=>{
    // req.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'loggedIn=true');  //key value pair 
    // res.setHeader('Set-Cookie', 'loggedIn=true; Expires=');  //expire date(http date format) when cookies should expires cookies if we don't set cookie expires when browser close 
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');  //take 10 second to expire
    // res.setHeader('Set-Cookie', 'loggedIn=true;  Domain=');  //we can set the domain to which cookies are sent to 
    // res.setHeader('Set-Cookie', 'loggedIn=true;' Secure);  //Cookies are only sent when our page is serve by https 
    
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');  //cookies can't be access by client side js  hence avoid cross site scripting attack malicous code from browser can't access but user can still see them(look at inspect mode application->cookies->http has check mark)

    //storing the session in the memory not on database
    req.session.isLoggedIn = true;  //session object attached by session middleware of express-session
    res.redirect('/');
}


//we can't store some information realted to one user in request req.user but req reset(new) for each new reuqest
//we can't store information realted to one user in global variable in nodejs as that variable is shared to all user 
// so session are used on server side we can't use them on client side 
// we store encrypted id of session on to the client side cookie
//npm install --save express-session


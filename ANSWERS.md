# Task 7 — Code Explanations

## Question A
Explain what `validationResult(req)` does, what you check for, and what happens next if there are errors. Why call `next(err)` instead of `res.status(400).json(...)` directly?

**Answer:**
- When the user inserts his email and password, validationResult(req) carries it and passes it through a series of error handlings by checking if the password or email is empty, or, if your input is wrong.
- If an error is found, it would display the errors prepared i.e., error 400.
- The reason we use next(err) is to avoid unnecessary repetition in our code and applies the same handling to all routes.

---

## Question B
Explain what `jwt.sign()` does in your login handler. What are the three arguments? What would break if you changed the secret on the verify endpoint to a different string?

**Answer:**
- jwt.sign() gives a user, who has logged in, a SIGNED token to use as proof of logging.
- The three arguments are { email: user.email } which contains the email of the token holder, JWT_SECRET, which acts as the signature of the token only known to the server, and { expiresIn: '1h' } which contains the time taken before the token becomes invalid.
- If the secret in any token is changed, the system would automatically fail the verification because it does not match the secret stored within the server.

---

## Question C
Describe how your `errorHandler` middleware works. Why does it need four parameters instead of three? What does the conditional inclusion of `details` do in your JSON response?

**Answer:**
- When an error occurs, it is automatically sent into errorHandler.js where it would read what type of error it is (err.status), read the error message (err.message), generate and send a response based on this (message{error:{message}}) to the user.
- The reason we use four arguments is because Express only recognise error handler that have 4 arguments.
- (if (err.details)) is used to check if the error received has any details. If it has, it would add the details. If not, it would remove the details.

---

## Question D
Explain the role of `next()` in your `requestLogger`. What happens if you forget to call it? Why does middleware order matter, and how did you ensure your logger runs before the route handlers?

**Answer:**
- When Express gets a result from a function, it uses (next()) to transfer that result to the next function in line.
- If (next()) is forgotten, the program would be stuck there since Express does not know the next step.
- The reason why it needs to be in order is because the server reads your code from top to bottom.
- I make it run first by inserting the request function (app.use(requestLogger);) above the other functions.

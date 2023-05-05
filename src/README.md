# Modules.

A Module is definned by annotating a class with the @Module decorator
The decorator provides metadata that Nest uses to organize the application structure.
MODULE DECORATOR PROPERTIES:

- providers: Array of providers to be available within the module via dependency injection.
- controllers: Array of controllers to be instantiated with the module
- exports: Array of providers to export to other modules
- imports: List of modules required by this module. Any exported provider by these modules will now be available in our module via dependency injection.
  CREATE A MODULE BY INTEGRATED TERMINAL
  `nest g module nameOfModule`
  nest for nestjs cli, g for generate, module for schematic to create and nameOfModule that I want to created. Nest creates a new subfolder and edit the src/app.module.ts

---

# Controllers.

Definition: Controllers are defined by decoration a class the @Controller decorator.
The decorator accepts a string, which is the path to be handled by the controller.

- Controllers are the responsibles for handling incoming requests and returning responses to the client.
- Are bound to a specific path (for ex: '/tasks', for the resourse.)
- Contains handlers, which handle endpoints and request methods (GET, POST, DELETE, etc).
- Can take advantage of dependency injection to consume providers within the same module.

## Create a controller with NestCLI

`nest g controller tasks`

(path of the controller ) --no-spec (no test unit for now)
New file has been created and updated scr/task/task.module.ts

---

# Handlers

Definition: Handler are a simply methods within the controller class, decorated with decorators such as @Get, @Post, etc..

FLOW:
When a HTTP request incomming to our app:
-> The request are routed to Controller
-> the handler is called with arguments: NestJS parse the relevant request data and it will be available in the handler.
-> Handler handles the request: perform operations such as communication with a service. For example: retrieving an item from the database.
-> Handle returns response value: Response can be of any type and even an exception. Nest will wrap the returned value as an HTTP response and return it to the client.

---

# Providers

Can be injected into constructors if decorated as an @Injectable, dependency injection.
Can be a plain value, a class, sync/async factory, etc.
Providers must be provided to a module for them to be usable.
Can be exported from a module - and then be available to other modules that import it.
WHAT IS A SERVICE?
Define as providers. NOT ALL PROVIDERS ARE SERVICES.
Common concept within software develompment and are not exclusive NestJS, JavaScript or back-end develompment.
Singleton when wrapped with @Injectable() and provided to a module. That means, the same instance will be shared across the app. acting as a single source of truth.
The main source of business logic. For example, a service will be called from a controller to validate data, create an item in the database and return a response.

---

## Dependency injection in NestJS

Any component within the NestJS ecosystem can injected a provider that is decorated with the @Injectable.
We define the dependencies in the constructor of the class. NestJS will take care of the injection for us, and it will then be available as a class property.
CREATE A SERVICE:
nest g service tasks --no-spec

---

## Difference between Interfaces & Models

- Interfaces are a TS concept that simply enforces the shape of an object upon compilation, therefore after compilation interfaces are not preserved as a interfaces anymore.
- Classes however already exist in JavaScript since ECMA6, therefore even both compilation our classes will be preserved. Classes are usefull when you want to create objects based on blueprint and add some self-contained functionality to them, using methods for example. Convert from Interface to class it's quite easy to do.

---

## Data Transfer object (DTO)

`A data transfer object is an object that defines how the data will be sent over the network.`

- Common concept in software develompment that is not specific to NestJS
- Result in more bulletproof code, as it can be used as a TypeScript type.
- Do not have any behavior except for storage, retrieval, serialization and deserialization of its own data.
- Results increased performance (although negligible in small applications).
- Can be usedful for data validation.
- A DTO is NOT a model definition. It defines the shape of data a specific case, for example - creating a task.
- Can be defined using an interface or a class.
  CLASS VS INTERFACE FOR DTOS.
  The recommended approach is to use classes, also clearly documented in the NestJS documentation. The reason is that interfaces are a part of TypeScript and therefore are not preserved post-compilation. Classes allow us to do more, and since they are a part of JavaScript, they will be preserved post-compilation.
  NestJS cannot refer to interfaces in run-time, but can refer to classes.
  CLASSES ARE THE WAY TO GO FOR DTO'S
  ** IMPORTANT **
  Data Transfer object are NOT mandatory.
  You can still develomp applications without using DTOs.
  However, the value they add makes it worthwhile to use them when applicable.
  Applying the DTO pattern as soon as possible will make it easy for you to mantein and refactor your code.

---

## First way to create a task

It's important to understand the problem that leads us to using DTOS, for example:

- The client send an HTTP POST request to /tasks to creating one that's contain the title and the description.
- The req body is then passed on to the route Handler in the controller where the body parameters are explicity picked by using the body decorator (the title and the description)
- Then the task service create task method is called with the title and the description as arguments. Where the create task method then picks these arguments, creates de tasks, pushes it to the array and then return the task back to the controller in the form of a task which is the model that we've created.
- The controller then send an HTTP response back to the client containing the task object.
  HOW MANY TIMES WE REFER TO THE PROPERTIES OF A TASK WITHIN OUR CODE. Both in the controller and in the service, just in order to retrieve the title and the description.
  Imagine a situation where we have to the make changes to this shake of data, maybe at some point we need to change the types of those parameters maybe we need to introduce a new value, or remove a value. To apply such change you have to change the parameters we extracted in the Handler Definition in our controller, we'll also have to change the code where we call task service create task in the controller handler, and also have to change the create task definition in the service to support the new parameters.
  WE DO NOT HAVE A UNIFIED WAY TO DEFINE WHAT THE DATA LOOKS LIKE THROUGHOUT THE PROCESS.

```
  retrieve the entire request body, we'll define a param here and call it body and decorate it with the body decorator.
  When this handler is called after an HTTP request SGS will collect the entire request, and put it in this param as an argument

  @Post()
  createTask(
  @Body('title') title: string,
  @Body('description') description: string,
  ): Task {
  return this.tasksService.createTask(title, description);
  }
```

## Second way to create a task

We can create a DTO for the create task operation and applied to the controller and the service this will make it easier for us to maintain the shape of this data that is circulated across the app and introduce new changes to this sort of data.

```
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }
```

---

## Update a task

- Incoming PATCH HTTP request
- The URL will contain the ID of the task to be deleted
- The request body will contain the new status
- Handle the req - extract the ID and the status and update the task's status.
- Return the task back to the client.
  Patch best practices
- Refer to the resource in the URL;
- Refer to a specific item by ID
- Specific the what has to be patched in the URL, in this case the status;
- Provide the required parameters in the request body

  `PATCH: http://locaholost:3000/tasks/25d6ee00-e4f0-11ed-ae23-056ba5723150/status`
  `{ "status": "IN_PROGRESS" }`

---

# NestJS Pipes

- Pipes operate on the argument to be processed by the route handler, just before the handler is called.
- Pipes can perform _data transformation_ or _data validation_
- Pipes can return data - either original or modified - which will be passed on to the route handler.
- Pipes can throw exceptions. Exceptions thrown will be handled by NestJS and parsed into an error response.
- Pipes can be asynchronous.

## Default Pipes in NestJS

- NestJS ships with useful pipes within the `@nestjs/common` module.
  **Validation Pipe**
  Validate the compatibility of an entire object against a class (goes well with DTOs). If any property cannot be mapped properly (for example, mismatching type) validation will fail.
  A very common use case, therefore having a build-in validation pipe is extremely useful.
  **ParseIntPipe**
  By default, arguments are of type _string_. This pipe validates that an argument is a number. If successful, the argument is transformed into a _number_ and passed on to the handler. This is very useful when you expect a number and don't want to parse it manually everytime.
  **Custom Pipe Implementation**
  We can also implement our own custom pipes.
- Pipes are classes annotated with the _@Injectable()_ decorator.
- Pipes must implement the _PipesTransform_ generic interface. Therefore, every pipe must have a _transform()_ method. This method will called by NestJS to process the arguments.
- The transform() method accept _two_ parameters:
  _value_: the value of the processed argument.
  _metadata_ (optional): an object containing metadata about the argument.
- Whatever is returned from the _transform()_ method will be passed on to the route handler. Exceptions will be send back to the client.
  **Pipes can be consumed in different ways.**
  _Handler-level pipes_ are defined at the handler level, via the _UsePipes()_ decorator. Such pipe will process all parameters for the incoming request:

```
@Post()
@UsePipes(SomePipe)
createTask(
  @Body('description') description
) {
  //...
}
```

Or then there are parameters level types, which are defined at the parameter level, only that specific parameter for which the pipe has been specified will be process:

```
@Post()
createTask(
  @Body('description', SomePipe) description
) {
  //...
}
```

And finally there are Global pipes, this are defined at the application level and to will be applied to any incoming request within the app.

```
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(SomePipe);
  await app.listen(3000);
}
bootstrap();
```

### Parameter-level VS Handler-level pipes. Which one?

It depends.
**Parameter-level pipes** tend to be slimmer and cleaner. However, they often result in extra code added handlers - this can get messy and hard to maintain.
**Handler-level pipes** require some more code, but provide some great benefits:

- Such pipes do not require extra code at the parameter leve.
- Easier to maintain and expand. If the shape of the data changes, it is easy to make the necessary changes within the pipe only.
- Responsability if identifying the arguments to process is shifted to be one central file - the pipe file.
- Promote usage of DTOs which is a very good practice.

---

# ORM and TypeORM

Objetc-Relational-Mapping is a technique that lets you query and manipulate data from a database, using an object-oriented paradigm.
There are many ORM libraries that allow developers to communicate to the database using their preferred programming language - rather than sending plain queries directly.

---

### Pros and cons of using an ORM library

PROS:

- Writing the data model in one place - easier to maintain. Less repetition.
- Lots of things done automatically - database handling, data types, relations, etc.
- No need to write SQL syntax (easy to learn, hard to master). Using your natural way of coding.
- Database abstraction - you can change the database type whenever you wish.
- Leverages OOP, therefore things like inheritance are easy to achieve.
  CONS:
- You have to learn it, and ORM libraries are not always simple.
- Performance is alright, but it's easy to neglect.
- Makes it easy to forget (or never learn) what's happening behind the scenes, which can lead to a variety of maintainability issues.
  _TypeORM_
  Is an ORM library that can run in Node.js and be used with TypeScript (or JS).
  Helps us define and manage entities, repositories, columns, relations, replications, indices, queries, logging, and so much more.
  **Example**
  Retrieving all task owned by "Ashley", and are of status "Done".

**TypeORM**

```
const task = await Task.find({ status: 'Done', user: 'Ashley' });
```

**Pure JavaScript**

```
let tasks;
db.query('SELECT * FROM task WHERE status = "Done" AND user = "Ashley"', (err, result) => {
  if(err) {
    throw new Error(`Could not retrieve tasks!`);
  }
  tasks = result.rows;
});
```

---

## Config the DB connection

Providing the data as an object

- Create a new folder whit my configuration files in it (typeorm.config.ts)
- Export this obj(TypeOrmConfig) with an Interface (TypeOrmModuleOptions) that's import from @nest/typeorm and we create a pool connection
- Connection: type: 'postgres', host: 'localhost', port, username, password, DBname, entities: typeOrm use entities that translate to tables in DB and these are save in files.

`[__dirname + '/../**/*.entity.ts']`

---

## Hashing password

A salt is used as some additional input to a one-way hashing operation to safeguard the password in storage. Our code encrypts this password and then we get this hash generated, we stored this hash in the DB and it is associated with a user. We can't prevent that someday any one can get to our DB and get the hashed password, and with a program decrypt.
So we can prevent this by using salts when we generate our passwords, so even if users choose for whatever reason to a common password, even though we have really strict passwords rules, there are still some common passwords, you'll still not be able to discover the password using websites like "Sha256() Encrypt & Decrypt".
So it's going to prefix the password with some randon unique string, and then after we encrypt this password our hash result is going to be completely different, and if the attackers get access to this hash, they will try to decrypt but they will not be able to find out our password, cause even though our password is 123456, it's actually encrypted with the salt and **this salt is going to be unique per user**

### Feature validation password - Sign In

In the sign in operation we want to do is receive the username in plain text password from request body and then check for a match in our DB, if we have a match that means the user should be signed in.
_validatePassword_: is a custom method to validate a password for a individual user. We expect a string and we're gonna return a Promise of boolean. True/False whether the password is valid or not. We retreive the password from the request body, that is not necessarily the correct password, and then we're going to apply the same hash against the original user salt and then we're gonna compare the result hash with the actual user password hash and if it's a match that means the password input is correct and the user should be signed in so it'll return true.

---

## JSON Web Tokens

It's an open-source industry standard (RFC-7519).
Is usable for Authorization or secure exchange of information between parties.
It's use to verify that the sender is who it/he/she claims to be.
It is signed by the issuer (the one issuing the token), using a secret or keypair using some cryptographic algorithms such as HMAC algorithm, RSA, or ECDSA.

### JWT Structure

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJP`._eyJzdWIi0iIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvag4gRG9lIiwiaXNTb2NpYQwiOnRydWV9_.**4pcPyMD09olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4**.

`Header` contains metadata about the token (type, hashing algorithm, etc).

_Payload_ it contains claims (statement about an entity - for example, a user and additional data).

**Signature** is the result of the encoder header, the encoded payload, signed against a secret.

Practical example:
User "Jane Doe" signs into our application. We want to create a token which Jane can authorized for a while.
We create a payload cointaining the username and role. We then sign the token with an expiry time of 1 hour. We use a secret for signing

```
{
  "username": "Jane Doe",
  "role": "admin",
  "iat": 1516239020, -> means issued at the time in which the token is ussued
  "exp": 1515242620 -> means issued at the time in which the token is expires
}

```

the result of that JSON it's a token like the other one. Within that token there is a signature, and the signature is the result of the header, payload, processed against a secret that only we know after a cryptographic hash.

---

### Authorizing a real Jane Doe

Jane Doe send a request to API, she wants to delete a task. In the request headers, we can find a JWT token.
To validate her token, we take the headers and payload, and re-generated the signature using our secret.
We then compare the result signature with the signature in her token.
If it's a match, so the signature is valid and therefore Jane Doe is who she claims to be. And we can take the claims in that signature is valid.

### Reject a fake Jane Doe.

Dane Joe send a request to our API, and she wants to access some information that should be only available to admins. In reality, she is a normal user with no admin rights. But DJ is smart, she managed to grab the token and modified the payload:

```
{
  "username": "Dane Joe",
  "role": "admin",
  "iat": 1516239020,
  "exp": 1516242620

}
```

DJ is not goind to beat us. We will take the header and payload from this fake token, and generate a signature against our secret.
We will then compare the result signature to the signature provided in her token. Since JD does not know our secret - there is no way she could fake signature as well. We compare the signature that she's provided with a signature that we generated based on the real secret and what we get is a no match.

### More about JSON Web Tokens.

JWT can be decoded by anyone. They should not contain sensitive information such as passwords.
It's useful for front-end applications to use these tokens to toggle features conditionally. For example, if a user is an administrator, we could show or hide a certain button based on the claims in the token.
Finally, JWT should ideally be short-lived.

\*\*3.48.00

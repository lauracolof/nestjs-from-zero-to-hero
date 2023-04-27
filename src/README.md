# NOTES

### Definition of module.

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

### NestJS Controllers

Definition: Controllers are defined by decoration a class the @Controller decorator.
The decorator accepts a string, which is the path to be handled by the controller.

- Controllers are the responsibles for handling incoming requests and returning responses to the client.
- Are bound to a specific path (for ex: '/tasks', for the resourse.)
- Contains handlers, which handle endpoints and request methods (GET, POST, DELETE, etc).
- Can take advantage of dependency injection to consume providers within the same module.

CREATE A CONTROLLER WITH NEST CLI

`nest g controller tasks`

(path of the controller ) --no-spec (no test unit for now)
New file has been created and updated scr/task/task.module.ts

### Handlers

Definition: Handler are a simply methods within the controller class, decorated with decorators such as @Get, @Post, etc..

FLOW:
When a HTTP request incomming to our app:
-> The request are routed to Controller
-> the handler is called with arguments: NestJS parse the relevant request data and it will be available in the handler.
-> Handler handles the request: perform operations such as communication with a service. For example: retrieving an item from the database.
-> Handle returns response value: Response can be of any type and even an exception. Nest will wrap the returned value as an HTTP response and return it to the client.

### Providers

Can be injected into constructors if decorated as an @Injectable, dependency injection.
Can be a plain value, a class, sync/async factory, etc.
Providers must be provided to a module for them to be usable.
Can be exported from a module - and then be available to other modules that import it.
WHAT IS A SERVICE?
Define as providers. NOT ALL PROVIDERS ARE SERVICES.
Common concept within software develompment and are not exclusive NestJS, JavaScript or back-end develompment.
Singleton when wrapped with @Injectable() and provided to a module. That means, the same instance will be shared across the app. acting as a single source of truth.
The main source of business logic. For example, a service will be called from a controller to validate data, create an item in the database and return a response.

### Dependency injection in NestJS

Any component within the NestJS ecosystem can injected a provider that is decorated with the @Injectable.
We define the dependencies in the constructor of the class. NestJS will take care of the injection for us, and it will then be available as a class property.
CREATE A SERVICE:
nest g service tasks --no-spec

### Difference between Interfaces & Models

- Interfaces are a TS concept that simply enforces the shape of an object upon compilation, therefore after compilation interfaces are not preserved as a interfaces anymore.
- Classes however already exist in JavaScript since ECMA6, therefore even both compilation our classes will be preserved. Classes are usefull when you want to create objects based on blueprint and add some self-contained functionality to them, using methods for example. Convert from Interface to class it's quite easy to do.

### Data Transfer object (DTO)

`A data transfer objetc is an object that defines how the data will be sent over the network.`

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

### First way to create a task

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

### Second way to create a task

We can create a DTO for the create task operation and applied to the controller and the service this will make it easier for us to maintain the shape of this data that is circulated across the app and introduce new changes to this sort of data.

```
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }
```

### Update a task

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

### NestJS Pipes

- Pipes operate on the argument to be processed by the route handler, just before the handler is called.
- Pipes can perform _data transformation_ or _data validation_
- Pipes can return data - either original or modified - which will be passed on to the route handler.
- Pipes can throw exceptions. Exceptions thrown will be handled by NestJS and parsed into an error response.
- Pipes can be asynchronous.

### Default Pipes in NestJS

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

````
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

**Parameter-level VS Handler-level pipes. Which one?**
It depends.
*Parameter-level pipes* tend to be slimmer and cleaner. However, they often result in extra code added handlers - this can get messy and hard to maintain.
*Handler-level pipes* require some more code, but provide some great benefits:
- Such pipes do not require extra code at the parameter leve.
- Easier to maintain and expand. If the shape of the data changes, it is easy to make the necessary changes within the pipe only.
- Responsability if identifying the arguments to process is shifted to be one central file - the pipe file.
- Promote usage of DTOs which is a very good practice.





\* TODO:
````

---
title: "Wrangle Your Business Logic with Laravel Pipelines"
slug: "wrangle-your-business-logic-with-laravel-pipelines"
subtitle: "A guide on how to use pipe patterns in Laravel to handle complex data processing tasks."
author: "Chris Arter"
seo:
  image:
    src: "/images/laravel-pipelines-chris-arter.jpg"
    alt: "A cat herder"
publishDate: "2025-01-29T14:48:31.175Z"
dateUpdated: ""
---


Picture this: A user uploads a CSV file to your application. Simple enough, right? You just need to:
- Parse the file
- Validate the data
- Transform it to match your database schema
- Save it to your database
- Send a confirmation email
- Maybe update some analytics

Your first instinct might be to write something like this:

```php
public function handleUpload($file) {
    $data = parseCsv($file);
    $validData = validateRows($data);
    $transformed = transformData($validData);
    $this->repository->saveAll($transformed);
    $this->sendConfirmation();
    $this->updateAnalytics();
    
    return response()->json(['message' => 'Success']);
}
```

It works great in development. Then you deploy it, and reality hits:

Some CSVs are 100MB large, and your users are timing out. Others have special characters that break your parser. A few users have thousands of rows with complex validation rules. Your email service occasionally hiccups. The analytics update sometimes takes longer than expected.

Suddenly, you're adding try-catch blocks everywhere. You're implementing retry logic. You're moving things to background jobs. Your simple function has evolved into a tangled mess of error handling and edge cases.


```php
public function handleUpload($file) {
    try {
        // Should this be in a transaction?
        DB::beginTransaction();
        
        $data = $this->processWithRetry(function() use ($file) {
            return parseCsv($file);
        });
        
        // What if validation fails halfway through?
        $validData = collect($data)->map(function($row) {
            try {
                return $this->validateRow($row);
            } catch (ValidationException $e) {
                // Log error? Skip row? Stop everything?
                Log::error($e);
                return null;
            }
        })->filter();
        
        // Should we process in chunks?
        foreach($validData->chunk(100) as $chunk) {
            dispatch(new ProcessDataJob($chunk));
        }
        
        DB::commit();
        
        // What if the email fails but data was saved?
        dispatch(new SendConfirmationEmail());
        
        // Fire and forget? Wait for result?
        UpdateAnalyticsJob::dispatch()->onQueue('low');
        
        return response()->json(['message' => 'Processing started']);
    } catch (Exception $e) {
        DB::rollBack();
        Log::error($e);
        // How do we clean up already dispatched jobs?
        return response()->json(['error' => 'Something went wrong'], 500);
    }
}
```
<div class="tenor-gif-embed" data-postid="7676797" data-share-method="host" data-aspect-ratio="2.085" data-width="100%"><a href="https://tenor.com/view/herd-cats-cowboy-rancher-impossible-gif-7676797">Herd Cats GIF</a>from <a href="https://tenor.com/search/herd-gifs">Herd GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>

> Suddenly, you're a cat herder.

This is where pipeline patterns come in. They help you:

1. Break complex processes into manageable steps
2. Handle each type of processing (sync/async) appropriately
3. Manage errors and retries consistently
4. Scale from simple to complex workflows without rewriting everything
5. Keep your code readable and maintainable

Instead of fighting with a growing monster of nested try-catch blocks and job dispatches, pipelines give you a clean way to express your intent: "Take this data, process it through these steps, and handle the complexities for me."

The rest of this guide will show you how to use different types of pipelines to handle these challenges elegantly, whether you need immediate results or can process things in the background.

## Understanding Pipelines

### What Makes a Pipeline Different from Regular Code

Think of a pipeline as a factory assembly line. Each station does one specific job, and parts move from station to station until the product is complete. In code, each station is a function that takes input, does something specific, and passes its result to the next function.

Here's what makes pipelines special:

```php
// Regular procedural code - everything mixed together
public function processUser(array $userData) 
{
    $userData['name'] = ucwords($userData['name']);
    $userData['email'] = strtolower($userData['email']);
    
    if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
        throw new ValidationException('Invalid email');
    }
    
    $user = User::create($userData);
    $user->profile()->create([
        'bio' => $userData['bio'] ?? null,
        'avatar' => $userData['avatar'] ?? null
    ]);
    
    return $user;
}

// Pipeline approach - each step is isolated and focused
class CreateUserPipeline 
{
    public function __construct(
        private readonly EventDispatcher $events
    ) {}

    public function process(array $userData) 
    {
        return app(Pipeline::class)
            ->send($userData)
            ->through([
                FormatUserDataStep::class,
                ValidateUserDataStep::class,
                CreateUserStep::class,
                SendWelcomeEmailStep::class,
            ])
            ->then(function($result) {
                $this->events->dispatch(new UserCreated($result['user']));
                return $result['user'];
            });
    }
}
```

### The Beauty of Small, Focused Steps

Each step in your pipeline should do exactly one thing:

```php
class FormatUserDataStep 
{
    public function handle($userData, $next) 
    {
        return $next([
            ...$userData,
            'name' => ucwords($userData['name']),
            'email' => strtolower($userData['email'])
        ]);
    }
}

class ValidateUserDataStep 
{
    public function handle($userData, $next) 
    {
        $validator = Validator::make($userData, [
            'email' => ['required', 'email'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'min:8'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'avatar' => ['nullable', 'image', 'max:2048']
        ]);
        
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        
        return $next($userData);
    }
}

class CreateUserStep 
{
    public function handle($userData, $next) 
    {
        $user = DB::transaction(function() use ($userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password'])
            ]);
            
            if (isset($userData['bio']) || isset($userData['avatar'])) {
                $user->profile()->create([
                    'bio' => $userData['bio'] ?? null,
                    'avatar' => $userData['avatar'] ?? null
                ]);
            }
            
            return $user;
        });
        
        return $next(['user' => $user, 'data' => $userData]);
    }
}
```

This approach gives you:
1. Easy testing - each step can be tested in isolation
2. Simple maintenance - when something breaks, you know exactly where to look
3. Reusability - steps can be mixed and matched for different workflows
4. Clear boundaries - each step has a clear input and output contract

## How Data Flows Through Your Application

In a pipeline, data flows one direction - forward. Each step can:
- Transform the data
- Validate it
- Enrich it with more information
- Save it somewhere
- Trigger side effects

But it can't go backwards. This one-way flow makes pipelines predictable and easier to debug:

```php
// The pipeline itself is just a series of transformations
$result = $pipeline
    ->send($initialData)      // Start with some data
    ->through([
        Step1::class,         // Maybe format it
        Step2::class,         // Validate it
        Step3::class,         // Enrich it
        Step4::class          // Save it
    ])
    ->thenReturn();          // Get the final result
```

## Keeping Things Simple When Complexity Grows

The real power of pipelines shows up when your process gets complex. Need to add logging? Add a step. Need to handle special cases? Add a conditional step. Need to retry something? Wrap the step in a retry decorator:

```php
class RetryStep 
{
    public function __construct(
        private readonly string $step,
        private readonly int $maxAttempts = 3
    ) {}
    
    public function __invoke($data, Closure $next)
    {
        return retry($this->maxAttempts, function() use ($data, $next) {
            return app($this->step)($data, $next);
        });
    }
}

// Using the retry wrapper
$pipeline
    ->send($data)
    ->through([
        Step1::class,
        new RetryStep(SaveToExternalAPI::class),
        Step3::class
    ])
    ->thenReturn();
```

Your pipeline can grow without becoming a mess:
- Each new requirement becomes a new step
- Steps can be conditional
- Steps can be decorated with retry logic, logging, or timing
- Steps can be reordered without breaking things
- Failed steps can be retried without affecting other steps

The key is that your pipeline represents the "what" of your process - what needs to happen, in what order. The individual steps handle the "how" - how each particular operation should work.

This separation makes pipelines a powerful tool for handling complex workflows while keeping your code clean and maintainable. Whether you're processing user input, handling API responses, or managing complex business workflows, pipelines give you a structured way to express multi-step processes.

## Deciding: Pipeline vs Queue

The key decision isn't about code organization - both approaches help you break down complex processes into manageable steps. The real question is: "When does this work need to happen?"

### Use a Pipeline When:

1. **You Need the Result Right Now**
```php
// User is waiting for the result
$result = app(Pipeline::class)
    ->send($request->validated())
    ->through([
        ValidateAddressStep::class,
        CalculateShippingStep::class,
        CheckInventoryStep::class
    ])
    ->thenReturn();

// User sees the shipping options immediately
return response()->json($result);
```

2. **Steps are Quick**
```php
// All steps are in-memory transformations
$processed = app(Pipeline::class)
    ->send($data)
    ->through([
        FormatNameStep::class,
        NormalizeDateStep::class,
        CalculateTotalsStep::class
    ])
    ->thenReturn();
```

3. **You Need Database Transactions**
```php
DB::transaction(function() use ($order) {
    return app(Pipeline::class)
        ->send($order)
        ->through([
            ValidateInventoryStep::class,
            UpdateStockStep::class,
            CreateInvoiceStep::class,
            ChargeCustomerStep::class
        ])
        ->thenReturn();
});
```

### Use Queue Jobs When:

1. **The Work is Time-Consuming**
```php
// This could take minutes
Bus::chain([
    new ProcessPodcastAudio($podcast),
    new GenerateTranscript($podcast),
    new UpdateSearchIndex($podcast)
])->dispatch();

return response()->json([
    'message' => 'Processing started',
    'podcast_id' => $podcast->id
]);
```

2. **You're Dealing with External Services**
```php
// External APIs might be slow or fail
Bus::chain([
    new SyncToShopify($order),
    new UpdateShippingPartner($order),
    new NotifySlack($order)
])->dispatch();
```

3. **You Need Parallel Processing**
```php
$batch = Bus::batch([
    new ProcessChunk($data, 0, 1000),
    new ProcessChunk($data, 1001, 2000),
    new ProcessChunk($data, 2001, 3000)
])->dispatch();
```

### Real World Example: Order Processing

```php
class OrderController
{
    public function store(OrderRequest $request)
    {
        // First: Quick validations and calculations (Pipeline)
        $orderData = app(Pipeline::class)
            ->send($request->validated())
            ->through([
                ValidateInventoryStep::class,
                CalculateTotalsStep::class,
                ApplyDiscountsStep::class
            ])
            ->thenReturn();

        // Create the order in a transaction
        $order = DB::transaction(function() use ($orderData) {
            return Order::create($orderData);
        });

        // Then: Queue the slow stuff
        Bus::chain([
            new SyncToAccountingSystem($order),
            new NotifyShippingPartner($order),
            new SendOrderConfirmation($order)
        ])->dispatch();

        return response()->json([
            'order' => $order,
            'message' => 'Order created successfully'
        ]);
    }
}
```

### Tl;dr

- Use a Pipeline when you need the result now and the work is quick
- Use Queue Jobs when the work is slow or can happen later
- When in doubt, ask "Would I be okay with this taking a few minutes?"

Photo by <a href="https://unsplash.com/@realaxer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">T K</a> on <a href="https://unsplash.com/photos/black-metal-tube-lot-9AxFJaNySB8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      
---
title: "How to cleanly organize Laravel application events."
slug: "how-to-cleanly-organize-laravel-application-events"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-09-28T15:33:40.609Z"
dateUpdated: ""
---

Lately I've been working on an application with quite a few events. Some events were related to user actions. Some were related to payment transactions. Others were related to bookings.

Not only is there a pretty big surface area of namespacing between these three, but there's a lot of boilerplate for setting event constructors and member properties. Each event required me to set a `User $user` parameter in the constructor, as well as a `$user` property on the class itself. After a few classes, this became pretty tedious. This also introduced the opportunity for bugs should I need to make application-wide changes to these events.

The solution was just simple inheretance. For each namespace of events, I created a base event class. Each user event, for example, would at the very least require a `$user` parameter to the constructor.

    <?php
    
    namespace App\Events\Users;
    
    use App\User;
    use Illuminate\Broadcasting\Channel;
    use Illuminate\Broadcasting\InteractsWithSockets;
    use Illuminate\Broadcasting\PresenceChannel;
    use Illuminate\Broadcasting\PrivateChannel;
    use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
    use Illuminate\Foundation\Events\Dispatchable;
    use Illuminate\Queue\SerializesModels;
    
    class BaseUserEvent
    {
        use Dispatchable, InteractsWithSockets, SerializesModels;
    
        public $user;
    
        /**
         * Create a new event instance.
         *
         * @return void
         */
        public function __construct(User $user)
        {
            $this->user = $user;
        }
    
        /**
         * Get the channels the event should broadcast on.
         *
         * @return \Illuminate\Broadcasting\Channel|array
         */
        public function broadcastOn()
        {
            return new PrivateChannel('channel-name');
        }
    }
    

And now subsiquently, all other user events can be declared like this:

    <?php 
    namespace App\Events\Users;
    
    class NewUserRegistrationEvent extends BaseUserEvent {}
    

This also allows us to send all of the User events to the same queue, and other configurations on the `BaseUserEvent` class. And of course, any of these can be overridden should the implimentation call for it.

This saves tons of time on boilerplate, keeps your code consistent yet flexible, and also makes it more readable.

Happy coding!
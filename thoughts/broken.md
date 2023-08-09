# Computers are broken

What do horses, miners, worms and bombs have in common?
They are all used to name computer exploits.
Besides trojan horses, fork bombs and crypto miners there are countless types
of other exploits.

So many in fact, that computer specialists take some kind of pride in
distinguishing attacks by choosing "cool" names such as:
Heartbleed, Meltdown, Spectre, Rowhammer, WannaCry, Shellshock...
And the list goes on.

While the computer security community has gotten quite good at naming things,
(which is one of the three hard problems of computer science, after all), no
significant progress towards preventing these bugs has been made.

That is not to say that there haven't been made attempts!
In fact, the necessary security primitives to prevent software bugs are mostly
already present.
(To convince yourself of that, you only have to take a look at something like seL4.)
And although there are some honorable mentions for making computers safer (Rust comes to mind),
we still are at a point where a simple buffer overflow is enough to compromise a system.

It seems like we care more about making computers faster than keeping them
secure, which is unfortunate for two reasons.
First, with some performance overhead and better design, we could prevent any
attack that doesn't directly target the computer's hardware.
Second, our obsession with performance isn't even justified because we keep
adding layers upon layers of leaky abstractions on top of our systems, making
any performance gains negligible.

So if we can't reap the benefits of faster computers, why not make them secure
instead?

The computer industry is like a sinking ship.
We've been building bigger ships to stay afloat, but it's getting harder and
the water level keeps rising.
We need to fix the leak before we can't build bigger ships anymore. 
